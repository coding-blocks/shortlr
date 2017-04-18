/**
 * Created by varun on 4/5/17.
 */
const express = require('express');
const db = require('../utils/db');
const bp = require('body-parser');
const encode = require('hashcode').hashCode();
const sg = require('sendgrid-nodejs').SendGrid;
const shortener = require('../utils/shortner');


const router = express.Router();
router.use(bp.json());
router.use(bp.urlencoded({extended: true}));

let transporter = new sg('user','password');


router.post('/:shortcode', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let shortcode = req.params.shortcode;
    db.checkEmail(email, password, shortcode, function (url) {
        res.send(url);
    }, function () {
        res.send(req.protocol + '://' + req.get('host') + '/addmail' + '/PleaseVerify');
    }, function (email) {
        transporter.send({
            to : email,
            from : '"Coding Blocks" <email>',
            subject: 'Please Verify Your Email',
            text: 'Click on the link below to verify your email to access all the links provided by coding blocks \n' +
                req.protocol + '://' + req.get('host') + '/addmail/verify/' + encode.value(email) + '/' + shortcode
        },function () {
                db.addEmail(email, password, function (err) {
                    if (err) throw err

                    res.send(req.protocol + '://' + req.get('host') + '/addmail/thankyou');
                });
        });
    },function () {
        res.send("invalid");
    });
});


router.use('/PleaseVerify', function (req, res) {

    res.render('index', {
        title: "Please Verify",
        body: "Please Verify your email in order to access coding blocks links. Happy Coding"
    });


});


router.use('/thankyou', function (req, res) {

    res.render('index', {
        title: "Thankyou",
        body: "Thankyou for registering your email. Verification Link has been sent to you. Happy Coding"
    });

});

router.use('/verify/:hashcode/:shortcode', function (req, res) {
    db.verifyEmail(req.params.hashcode, req.params.shortcode, function (url) {

        res.render('verified', {
            title: "verified",
            body: "Congrats..! Now you can access all coding blocks links. Happy Coding",
            url: url
        });

    });
});


module.exports = router;
