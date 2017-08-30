/**
 * Created by championswimmer on 14/12/16.
 */
const express = require('express');
const config = require('../config.json');
const route = express.Router();
const models = require('./../utils/db').models;

const shortner = require('../utils/shortner');
const SHORTENER_SECRET = process.env.SHORTURL_SECRET || "cb@123";

const SHORTENER_LONGURL_SECRET = process.env.SHORTURL_LONGURL_SECRET || "cb@123";
const db = require('./../utils/db');
const SHORTENER_GROUP_SECRET = process.env.SHORTURL_GROUP_SECRET || "cb@321"

route.post('/shorten', function (req, res) {
  let url = req.body.url;
  var http = /^https?:\/\//i;
  if (http.test(url) == false)
    url = "http://" + url;
  let secret = req.body.secret;
  let code = null;

  let shortCode = req.body.code.split('/');
  if (shortCode.length == 1 && secret == SHORTENER_SECRET) {
    console.log('Using secret');
    code = req.body.code;
    if (code && code.length > 9) {
      console.log('Too long code');
      return res.send("We do not support larger than 9 character")
    }
    shortner.shorten(url, code, function (shortcode, existed, longURL) {
      return res.send({
        shortcode, existed, longURL
      });
    });
  }

  else if (secret == SHORTENER_GROUP_SECRET) {
    console.log("Creating Group Secret");
    const groupName = shortCode[0];
    let tempCode = shortCode[1];

    models.Group.findOrCreate({
      where: {groupName: groupName},
      defaults: {
        groupName: groupName
      }
    }).spread(function (group, created) {
      tempCode = group.id + tempCode;
      while (tempCode.length < 9) {
        tempCode = tempCode + "0";
      }
      code = tempCode;

      if (code && code.length > 9) {
        console.log('Too long code');
        return res.send("We do not support larger than 9 character")
      }
      shortner.shorten(url, code, function (shortcode, existed, longURL) {
        if (shortcode === code) {
          return res.send({
            shortcode: req.body.code, existed, longURL
          });
        }
        return res.send({
          shortcode, existed, longURL
        });
      });
    }).catch(function (err) {
      console.log(err);
      return res.send("Internal Server Error");
    });

  } else {
    shortner.shorten(url, code, function (shortcode, existed, longURL) {
      res.send({
        shortcode, existed, longURL
      });
    });
  }

});

route.get('/expand/:shortcode', function (req, res) {
  if (req.params.shortcode.length > 9) {
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

route.post('/search', function (req, res) {
  if (req.body.secret !== SHORTENER_LONGURL_SECRET) {
    return res.send({
      status: 401,
      message: "Wrong secret Code"
    })
  }
  db.fetchLongUrl(req.body.longcode, function (urls) {
    if (urls.length === 0) {
      return res.send({
        status: 404,
        message: 'No Shortlinks found for this URL'
      })
    } else {
      return res.send({
        status: 200,
        urls: urls
      })
    }
  })

})
;

route.get('/stats', function (req, res) {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split("?").shift();

  let {page, size} = req.query;
  page = parseInt(page) || 1;
  size = parseInt(size) || config.PAGINATION_SIZE;

  shortner.stats(page, size, fullUrl).then(({urls, prevPage, nextPage, lastPage}) => {
    const meta = {prevPage, nextPage, lastPage};
    res.json({urls, meta});
  }).catch(err => {
    console.error(err);
    res.send({
      code: 501,
      message: "Error occured"
    })
  });
});

route.use((req, res) => {
  res.send("This is not the way to use the api")
});

module.exports = route;
