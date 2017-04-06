/**
 * Created by championswimmer on 14/12/16.
 */
const express = require('express');
const route = express.Router();

const shortner = require('../utils/shortner');


route.get('/:shortcode', (req, res, next) => {

    if (!req.params.shortcode || req.params.shortcode.length == 0) {
        next();
    }

    shortner.expand(req.params.shortcode, req.headers.referer, function (URL,emailCheck,shortcode) {
     if(!emailCheck){
        if (!URL) {
            next();
        } else {
            res.redirect(URL);
        }
    }
    else{
         res.redirect(req.protocol + '://' + req.get('host') + '/Email' +'?q=' + shortcode);
     }


    });

});

module.exports = route;