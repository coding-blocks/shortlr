/**
 * Created by championswimmer on 25/11/16.
 */
const Sequelize = require('sequelize');

const DB_HOST = process.env.NODE_MYSQL_HOST || "localhost";
const DB_USER = process.env.SHORTURL_MYSQL_USER || "shorturl";
const DB_PASS = process.env.SHORTURL_MYSQL_PASS || "shorturl";
const DB_NAME = process.env.SHORTURL_MYSQL_DBNAME || "shorturl";


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

sequelize.sync();


const URL = sequelize.define('url', {
    code    : { type: Sequelize.INTEGER, primaryKey: true },
    longURL : { type: Sequelize.STRING },
    hits    : { type: Sequelize.INTEGER, defaultValue: 0 }
});

const Event = sequelize.define('event', {
    time    : { type: Sequelize.DATE },
    from    : { type: Sequelize.STRING }
});

Event.belongsTo(URL);

module.exports = {
    addUrl: function (code, longURL, done, failed) {
        URL.create({
            code: code,
            longURL: longURL
        }).then(function(url) {
            done(url.code);
        }).catch(function(error) {
            console.log(error);
            failed(error);
        })
    },
    fetchUrl: function(code, from, done, failed) {
        URL.findById(code).then(function (url) {
            done(url.longURL);
            Event.create({
                from: from,
                time: new Date(),
                urlCode: url.code
            }).then(function () {url.increment('hits')});
        }).catch(function(error) {
            failed(error)
        })
    }
};