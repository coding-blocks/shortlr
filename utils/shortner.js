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

        db.addUrl(code, url, alias, function (shortcode, existed, longURL) {
            done(shortcode, existed, longURL);
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
    },
    stats: function (page,size,fullUrl) {
        return db.urlStats({page,size}).then( ({urls,lastPage})=>{
                    let nextPage= page==lastPage ? null : page+1;
                    let prevPage = page==1 ? null : page-1 ;
                    
                    if(nextPage)
                        nextPage = fullUrl + `?page=${nextPage}&size=${size}`;
                    if(prevPage)
                        prevPage = fullUrl + `?page=${prevPage}&size=${size}`;
            
                    return {urls,prevPage,nextPage,lastPage};
                })
    }
};