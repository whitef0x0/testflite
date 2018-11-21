var path = require('path');
var _ = require('underscore');

/** these methods always return what tests returns */

module.exports = async function createRoutes(app, authMiddleware){
    var db = await require('./db/index');

    if(!authMiddleware || authMiddleware === null){
        authMiddleware = function(req, res, next) {
            next();
        }
    }

    app.get('/testflite', authMiddleware, (req, res) => {
        var filePath = path.join(__dirname, '../public', 'index.html');
        //we assume the file does exist
        return res.sendfile(filePath);
    });

    /** get all tests */
    app.get('/testflite/test', authMiddleware, async (req, res) => {
        var items = await db.loadAll();
        items = _.map(items, function(item){
            if(item.hasOwnProperty("_id")){
                item.id = item._id;
            }
            return item;
        });
        return res.send(items);
    });

    /** delete test with given id */
    app.post('/testflite/test/:id', authMiddleware, async (req, res) => {
        var test = await db.delete({_id: req.params.id});
        db.flush();
        return res.send(test);
    });


    /** create new test */
    app.post('/testflite/test', authMiddleware, async (req, res) => {
        var test = await db.save(req.body);
        db.flush();

        return res.send(test);
    });

    app.get('/testflite/reloaddb', authMiddleware, (req, res) => {
        db.reload();
        return res.send();
    });

    /** route other requests to files */
    app.get('/testflite/*', (req, res) => {
        var file = req.originalUrl.replace('/testflite', '')
        var filePath = path.join(__dirname, '../public', file);

        //we assume the file does exist
        return res.sendfile(filePath);
    });
}