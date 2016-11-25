/**
 * Created by championswimmer on 24/11/16.
 */

const hasha = require('hasha');
const db = require('./db');
const r = require('convert-radix64');

module.exports = {
    shorten: function (url, done) {
        let hash = hasha(url, {encoding: "base64", algorithm: "md5"});
        let code = hash.slice(0,4);
        code = code.replace('/', '-');
        code = code.replace('+', '_');

        db.addUrl(r.from64(code), url, function () {
            done(code);
        }, function (error) {
            console.log(error);
            done(null)
        });

    },
    expand: function(shortcode, done) {
        console.log("Code" + shortcode);
        console.log("Id" + r.from64(shortcode));
        db.fetchUrl(r.from64(shortcode), function (url) {
            done(url);
        }, function (error) {
            console.log(error);
            done(null)
        });
    }
};