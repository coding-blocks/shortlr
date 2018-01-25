/**
 * Created by championswimmer on 14/12/16.
 */
const express = require('express')
const route = express.Router()

const models = require('./../utils/db').models

const shortner = require('../utils/shortner')

route.get('/:groupName/:shortcode', (req, res, next) => {
    let code = req.params.shortcode
    if (!req.params.shortcode || req.params.shortcode.length === 0) {
        next()
    }
    const groupName = req.params.groupName
    let tempCode = req.params.shortcode

    models.Group.findOne({
        where: {groupName: groupName},
    }).then(function (group) {
        if (group) {
            tempCode = "" + group.id + tempCode
            while (tempCode.length < 9) {
                tempCode = tempCode + "0"
            }
            code = tempCode
            shortner.expand(code, req.headers.referer, function (URL) {
                if (!URL) {
                    next()
                } else {
                    res.redirect(URL)
                }
            })
        } else {
            next()
        }
    }).catch(function (err) {
        console.log(err)
        return res.send("Internal Server Error")
    })

})

route.get('/:shortcode', (req, res, next) => {

    if (!req.params.shortcode || req.params.shortcode.length === 0) {
        return next()
    }

    req.params.shortcode = req.params.shortcode.trim()

    if (req.params.shortcode.length > 9) {
        return next()
    }

    shortner.expand(req.params.shortcode, req.headers.referer, function (URL) {
        if (!URL) {
            next()
        } else {
            res.redirect(URL)
        }
    })

})

module.exports = route