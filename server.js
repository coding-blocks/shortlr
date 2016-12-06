/**
 * Created by championswimmer on 24/11/16.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const shortner = require('./shortner');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const redirectToHome = function (req, res) {
    res.redirect('http://codingblocks.com')
};


app.use('/admin', express.static(__dirname + "/public_html"));

app.get('/:shortcode', (req, res, next) => {

    if (!req.params.shortcode || req.params.shortcode.length == 0) {
        res.redirect("http://codingblocks.com")
    }

    shortner.expand(req.params.shortcode, req.headers.referer, function (URL) {
        if (!URL) {
            next();
        } else {
            res.redirect(URL);
        }
    });

});

app.post('/api/v1/shorten', function (req, res) {
    let url = req.body.url;
    shortner.shorten(url, function (shortcode) {
        res.send(shortcode);
    });
});

app.get('/api/v1/expand/:shortcode', function (req, res) {
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

app.use(redirectToHome);


app.listen(4000, () => {
    console.log("Listening on http://localhost:4000/");
});