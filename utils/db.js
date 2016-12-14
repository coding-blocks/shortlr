/**
 * Created by championswimmer on 25/11/16.
 */
const Sequelize = require('sequelize');
const r = require('convert-radix64');

//This is so that BIGINT is treated at integer in JS
require('pg').defaults.parseInt8 = true;
//We have made sure that we do not use integers larger than 2^53 in our logic

const DB_HOST = process.env.NODE_MYSQL_HOST || "localhost";
const DB_USER = process.env.SHORTURL_SQL_USER || "shorturl";
const DB_PASS = process.env.SHORTURL_SQL_PASSWORD || "shorturl";
const DB_NAME = process.env.SHORTURL_SQL_DBNAME || "shorturl";


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});


const URL = sequelize.define('url', {
    code    : { type: Sequelize.BIGINT, primaryKey: true },
    codeStr : {type: Sequelize.STRING, unique: true},
    longURL : { type: Sequelize.STRING },
    hits    : { type: Sequelize.INTEGER, defaultValue: 0 }
});

const Event = sequelize.define('event', {
    time    : { type: Sequelize.DATE },
    from    : { type: Sequelize.STRING }
});

const Alias = sequelize.define('alias', {

});

const User = sequelize.define('user', {
    username:   {type: Sequelize.STRING },
    password:   {type: Sequelize.STRING }
});

Event.belongsTo(URL);

sequelize.sync(); //Normal case
//sequelize.sync({force: true}); //If schema changes NOTE: It will drop/delete old data


module.exports = {
    addUrl: function (code, longURL, alias, done, failed) {
        if (!alias) {
            URL.findOrCreate({
                where: {
                    code: code
                },
                defaults: {
                    code: code,
                    codeStr: r.to64(code),
                    longURL: longURL
                }

            }).spread(function (url, created) {
                done(url.codeStr, !created, url.longURL);
            }).catch(function (error) {
                console.log(error);
                failed(error);
            })
        } else {
            //TODO: handle longer than 9 with alias map
        }
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
    },
    urlStats: function (done, failed) {
        URL.findAll({
            order: [['hits', 'DESC']]
        }).then(function (urls) {
            done(urls);
        }).catch(function (error) {
            failed(error)
        })
    }
};