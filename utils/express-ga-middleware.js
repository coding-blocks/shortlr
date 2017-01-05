/**
 * Created by championswimmer on 29/12/16.
 */

const ua = require('universal-analytics');

function ExpressGA(uaCode) {
    this.uaCode = uaCode;

    this.middleware = function (req, res, next) {
        let visitor = ua(this.uaCode);
        visitor.pageview({
            dp: req.originalUrl,
            dr: req.get('Referer'),
            ua: req.headers['user-agent'],
            uip: req.headers['x-forwarded-for'].split(',').pop()
                    || req.connection.remoteAddress
                    || req.socket.remoteAddress
                    || req.connection.socket.remoteAddress
        }).send();
        next();
    };

    return this.middleware;
};


module.exports = ExpressGA;