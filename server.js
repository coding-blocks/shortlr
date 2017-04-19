/**
 * Created by championswimmer on 24/11/16.
 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-hbs');
const path = require('path');
const forceSSL = require('express-force-ssl');
const config = require('./config.json');

const app = express();

app.set('forceSSLOptions', {
    enable301Redirects: config.ENABLE_301_HTTPS_REDIRECT,
    trustXFPHeader: config.TRUST_HTTPS_PROXY,
    sslRequiredMessage: config.NON_HTTPS_REQUEST_ERRMSG
});

const shortner = require('./utils/shortner');
const expressGa = require('express-ga-middleware');


const route = {
    api_v1: require('./routes/api_v1'),
    shortcode: require('./routes/shortcode'),
    addmail : require('./routes/addmail')
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('hbs', exphbs.express4({}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname ,'views'))


const redirectToHome = function (req, res) {
    res.redirect('http://codingblocks.com')
};
const checkThisUrl = function (req,res,next) {
    if(req.header('host') == "cb.lk")
       return  res.send("You cannot shorten cb.lk links");

    next();
}


if (config.FORCE_HTTPS) {
    app.use('/admin', forceSSL)
}
app.use('/admin', express.static(__dirname + "/static/admin"));

app.use('/.well-known', express.static(__dirname + "/.well-known"));

app.use(expressGa('UA-83327907-4'));
app.use('/api/v1', checkThisUrl, route.api_v1);
app.use('/addmail',route.addmail);
app.use('/Email',express.static(__dirname + '/static/Email'))

app.use('/', route.shortcode);
app.use(redirectToHome);


app.listen(4000, () => {
    console.log("Listening on http://localhost:4000/");
});