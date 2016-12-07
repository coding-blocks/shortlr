/**
 * Created by championswimmer on 24/11/16.
 */

const db = require('./db');
const r = require('convert-radix64');


module.exports = {
    shorten: function (url, shortcode, done) {

        if (!shortcode) {
            shortcode = (((Math.random() *100) << 0) * 1000000)
                +
                //current milliseconds (cutting off last 2 digits)
                (((new Date().getTime() / 100) << 0) % 1000000);
        }



        db.addUrl(code, url, function (shortcode) {
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