riot.tag2('toggle-preview', '<div if="{opts.variations && opts.variations.length > 0}" class="toggle-wrapper"> <div class="tf-header"> TestFlite Split Test </div> <div class="first-line"> <div> Showing </div> <div> <select onchange="{selectVariant}"> <option> </option> <option each="{variant in opts.variations}" riot-value="{variant.value}" selected="{variant.value == opts.variantNum}"> {variant.displayName} </option> <select> </div> </div> <span>Go to <a href="/testflite">Admin Panel</a></span> </div>', 'toggle-preview .toggle-wrapper select,[data-is="toggle-preview"] .toggle-wrapper select{ -webkit-appearance: button; -webkit-border-radius: 2px; -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1); -webkit-padding-end: 20px; -webkit-padding-start: 2px; -webkit-user-select: none; background-image: url(http://i62.tinypic.com/15xvbd5.png), -webkit-linear-gradient(#FAFAFA, #F4F4F4 40%, #E5E5E5); background-position: 97% center; background-repeat: no-repeat; border: 1px solid #AAA; color: #555; font-size: inherit; margin: 20px; overflow: hidden; padding: 5px 10px; text-overflow: ellipsis; white-space: nowrap; width: 300px; font-size: 100%; line-height: 1.15; margin: 0; } toggle-preview .toggle-wrapper,[data-is="toggle-preview"] .toggle-wrapper{ position: fixed; top: 100px; right: 50px; z-index: 9999; background: rgba(200,200,200,0.7); border: 15px solid rgba(200,200,200,0); border-radius: 5px; } toggle-preview .toggle-wrapper .first-line,[data-is="toggle-preview"] .toggle-wrapper .first-line{ padding-bottom: 15px; } toggle-preview .toggle-wrapper .first-line div,[data-is="toggle-preview"] .toggle-wrapper .first-line div{ display: inline-block; } toggle-preview .toggle-wrapper .tf-header,[data-is="toggle-preview"] .toggle-wrapper .tf-header{ color: rgb(100, 100, 100); font-size: 1.5rem; }', '', function(opts) {

  var controller = this;

  controller.updateQueryString = function(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
  }

  controller.selectVariant = function(event){
    var selectValue = parseInt(event.originalTarget.value);
    window.location = controller.updateQueryString('variant', selectValue, String(window.location));
  };
});