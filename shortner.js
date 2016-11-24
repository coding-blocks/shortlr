/**
 * Created by championswimmer on 24/11/16.
 */

const hasha = require('hasha');

const codeMap = {};

module.exports = {
    shorten: function (url) {
        let hash = hasha(url, {encoding: "base64", algorithm: "md5"});
        let code = hash.slice(0,4);
        code = code.replace('/', '-');
        code = code.replace('+', '_');
        codeMap[code] = url;
        return code;
    },
    expand: function(shortcode) {
        return codeMap[shortcode];
    }
};