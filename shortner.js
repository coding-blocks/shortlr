/**
 * Created by championswimmer on 24/11/16.
 */

const db = require('./db');
const r = require('convert-radix64');


const getRandomCode = function () {
    let randCode =
        // 2 digit number with 6 zeros
        (((Math.random() * 100) << 0) * 1000000)
        +
        //current milliseconds (cutting off last 2 digits), 6-digit
        (((new Date().getTime() / 100) << 0) % 1000000);
    return randCode;

};


module.exports = {
    shorten: function (url, code, done) {

        let alias = null;

        if (!code) {
            code = getRandomCode();

        } else {
            if (code.length <= 9) {
                code = r.from64(code);
            } else {
                alias = code;
                code = getRandomCode();
            }
        }

        db.addUrl(code, url, alias, function (shortcode) {
            done(r.to64(shortcode));
        }, function (error) {
            console.log(error);
            done(null)
        });

    },
    expand: function(shortcode, from, done) {
        db.fetchUrl(r.from64(shortcode), from, function (url) {
            done(url);
        }, function (error) {
            console.log(error);
            done(null)
        });
    }
};