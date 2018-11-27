const _ = require('underscore');
const { calculatePercentage, calculateHits } = require('./util');
const configFile = require('./env/configFile');

const config = configFile.read();

var db = null;
(async function(){
    db = await require('./db/index');
}());

module.exports = async (req, res, next) => {

    if (res.render) {
        var render = res.render;
        res.render = async function(template, data, callback) {
            var isVariant = await updateVisitedPage(req, res, template);
            var tmp = await getNextTemplate(req, res, template);
            isVariant = isVariant || tmp.isVariant;
            var variantNum = tmp.variantNum;

            if(tmp.isVariant){
                template = tmp.template;
            }
            if (isVariant) {
                db.flush();
            }

            data.testfliteSwitch = '';

            if(req.session && showOverlay(req.session)){
                if(!config.useExternalRiotJS){
                    data.testfliteSwitch = `
                    <script src='/testflite/js/vendor/riot.min.js'> 
                    </script>`;
                }
                data.testfliteSwitch += `
                <script src='/testflite/js/riot-tags/toggle-preview.tag.js'> 
                </script>

                <toggle-preview>
                </toggle-preview>

                <script>
                    riot.mount("toggle-preview", {
                        variantNum: ` + tmp.variantNum + `,
                        variations: ` + JSON.stringify(tmp.variations) + `
                    })
                </script>`;
            }

            res.render = render;
            res.render(template, data, callback);
        }
    }
    next();
}

var showOverlay = function(current_session){
    if(config.overlay.showInDevelopment && process.env.NODE_ENV === 'development'){
        return true;
    }

    if(config.overlay.admin.show && current_session.user && current_session.user[config.overlay.admin.userFlag]){
        return true
    }

    return false;
}

/**
 * Update variation based on the visiting page and cookies
 */
var updateVisitedPage = async (req, res, template) => {
    var splitTest = await db.getByTestDestination(template);
    var isVariant = false;
    if(req.query && req.query.variant){
        if(req.query.variant == 'false'){
            return false;
        } 
        return true;
    } else if (splitTest) {
        var cookies = req.cookies;
        var cookieKey = `testflite.${splitTest.page.template}`;
        if (cookies && cookies[cookieKey]) {
            var cookie = cookies[cookieKey];
            var allVariations = _.union([splitTest.page], splitTest.variations);
            var pageRef = _.find(allVariations, (variation) => {
                return variation.template == cookie;
            });
            if (pageRef) {
                pageRef.returns++;
                isVariant = true;
            }

            splitTest.page = pageRef;
            await db.update(splitTest, splitTest);
        }
        return isVariant;
    }
}


var getNextTemplate = async (req, res, template) => {
    var splitTest = await db.getByTemplate(template);
    var newTemplate = template;
    var ret = {
        isVariant: false,
        template: '',
        variantNum: 0,
        variations: []
    };

    if (splitTest) {

        if(splitTest.variations){
            ret.variations = _.union(
                [{value: 0, displayName: 'Variant 1'}], 
                _.map(splitTest.variations, function(variation, idx){ 
                    return { 
                        value: idx + 1, 
                        displayName: "Variant " + String(idx + 2) 
                    }; 
                })
            );
        }


        //Force load specified variant
        if(req.query && req.query.variant) {
            if(req.query.variant !== '0'){
                var variantIndex = parseInt(req.query.variant) - 1;
                ret.template = splitTest.variations[variantIndex].template;
                ret.isVariant = true;
                ret.variantNum = variantIndex + 1;
            } else {
                ret.template = splitTest.page.template;
            }

            return ret;
        } else {
            //check if user has already visited this page
            //and display the same template
            var cookies = req.cookies;
            var cookieKey = `testflite.${splitTest.page.template}`;
            var allVariations = _.union([splitTest.page], splitTest.variations);
            if (cookies && cookies[cookieKey]) {
                ret.template = cookies[cookieKey];
                ret.variantNum = _.findIndex(allVariations, {
                    template: ret.template
                });

                ret.isVariant = true;
                return ret;
            }

            //user did not visit the page, 
            //find the template
            var pageRef = splitTest.page;
            if (splitTest.dynamicWeight) {
                pageRef = _.max(allVariations, calculatePercentage);
            } else {
                pageRef = _.min(allVariations, calculateHits);
            }

            ret.variantNum = _.findIndex(allVariations, {
                template: ret.template
            });
            //db holds references and should auto update
            pageRef.hits++;
            ret.isVariant = true;
            ret.template = pageRef.template;

            res.cookie(cookieKey, pageRef.template, {
                maxAge: 9999999999,
                path: '/'
            });

            splitTest.page = pageRef;
            await db.update(splitTest, splitTest);
        }
    }
    return ret;
};