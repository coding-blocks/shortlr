/**
 * Created by championswimmer on 14/12/16.
 */
const express = require('express');
const route = express.Router();

const shortner = require('../utils/shortner');
const SHORTENER_SECRET = process.env.SHORTURL_SECRET || "cb@123";


route.post('/shorten', function (req, res) {
    let url = req.body.url;
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
    if (!req.params.shortcode || req.params.shortcode.length == 0) {
        res.send({
            status: 501,
            message: "Wrong shortcode, or no shortcode given"
        })
    } else {
        shortner.expand(req.params.shortcode, req.headers.referer, function (URL) {
            if (!URL) {
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
    shortner.stats(function (urls) {
        res.send(urls)
    }, function (error) {
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