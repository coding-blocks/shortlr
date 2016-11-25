/**
 * Created by championswimmer on 24/11/16.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const shortner = require('./shortner');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', express.static(__dirname + "/public_html"));

app.get('/:shortcode', (req, res) => {

    shortner.expand(req.params.shortcode, function (URL) {
        if (!URL) {
            res.send("Shit wtf!")
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
    // expand shortcode,
    // generate original URL
    // send the URL back
});

app.listen(4000, () => {
    console.log("Listening on http://localhost:4000/");
});