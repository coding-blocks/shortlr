/**
 * Created by championswimmer on 24/11/16.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const shortner = require('./utils/shortner');

const route = {
    api_v1: require('./routes/api_v1'),
    shortcode: require('./routes/shortcode')
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const redirectToHome = function (req, res) {
    res.redirect('http://codingblocks.com')
};

app.use('/api/v1', route.api_v1);
app.use('/admin', express.static(__dirname + "/public_html"));
app.use('/', route.shortcode);
app.use(redirectToHome);


app.listen(4000, () => {
    console.log("Listening on http://localhost:4000/");
});