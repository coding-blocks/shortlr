const router = require('express').Router();
const models = require('../utils/db');
const axios = require('axios');
const uid = require('uid2');

var secrets;
try {
    secrets = require('./../secrets.json');
  } catch (e) {
    secrets = require('./../secrets-sample.json');
  }

  router.post('/', function (req, res) {
      axios.post('https://account.codingblocks.com/oauth/token',
          {
            "client_id": secrets.CLIENT_ID,
            "redirect_uri": secrets.REDIRECT_URI,
            "client_secret": secrets.CLIENT_SECRET,
            "grant_type": secrets.GRANT_TYPE,
            "code": req.body.code
        })
        .then(models.authFunction(authtoken, function (oneauth) {
          if(oneauth.success === true)
            res.status(200).send(oneauth);
          else
            res.status(500).send(oneauth);
        })).catch(function (err) {
          console.log(err);
          res.status(500).send({
              success: false
            , code: "500"
            , error: {
                message: "Could not post data to Oneauth API(Internal Server Error)."
              }
          })
        })
    });

  module.exports = router;