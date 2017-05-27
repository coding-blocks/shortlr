/**
 * Created by championswimmer on 14/12/16.
 */
const express = require('express');
const config = require('../config.json');
const route = express.Router();

const shortner = require('../utils/shortner');
const SHORTENER_SECRET = process.env.SHORTURL_SECRET || "cb@123";


route.post('/shorten', function (req, res) {
    let url = req.body.url;
    var http = /^https?:\/\//i;
    if(http.test(url) == false)
        url = "http://"+url;
    let secret = req.body.secret;
    let code = null;
    if (secret == SHORTENER_SECRET) {
        console.log('Using secret');
        code = req.body.code;
        if (code && code.length > 9) {
            console.log('Too long code');
            return res.send("We do not support larger than 9 character")
        }
    }

    shortner.shorten(url, code, function (shortcode, existed, longURL) {
        res.send({
            shortcode, existed, longURL
        });
    });
});

route.get('/expand/:shortcode', function (req, res) {
    if(req.params.shortcode.length > 9) {
        res.redirect(200, 'http://www.codingblocks.com');
    }

    if (!req.params.shortcode || req.params.shortcode.length == 0) {
        res.send({
            status: 501,
            message: "Wrong shortcode, or no shortcode given"
        })
    } else {
        shortner.expand(req.params.shortcode, req.headers.referer, function (URL) {
            if (URL) {
                res.send({
                    status: 200,
                    url: URL
                })
            } else {
                res.send({
                    status: 501,
                    message: "Server error"
                })
            }
        });
    }

});

route.get('/stats', function (req, res) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("?").shift() ;

    let {page,size} = req.query ;
    page = parseInt(page) || 1;
    size = parseInt(size) || config.PAGINATION_SIZE;

    shortner.stats(page,size,fullUrl).then( ({urls,prevPage,nextPage,lastPage})=>{
        const meta = { prevPage,nextPage,lastPage };
        res.json({urls,meta});
    }).catch(err=>{
        console.error(err);
        res.send ({
            code: 501,
            message: "Error occured"
        })
    });
});

route.use((req, res) => {
    res.send("This is not the way to use the api")
});

module.exports = route;
