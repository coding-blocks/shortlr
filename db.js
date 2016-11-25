/**
 * Created by championswimmer on 25/11/16.
 */
const Sequelize = require('sequelize');

var sequelize = new Sequelize('shorturl', 'shorturl', 'shorturl', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

sequelize.sync();


var URL = sequelize.define('url', {
    code: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    longURL : {
        type: Sequelize.STRING
    }
});

module.exports = {
    addUrl: function (code, longURL, done, failed) {
        URL.create({
            code: code,
            longURL: longURL
        }).then(function(url) {
            done();
        }).catch(function(error) {
            console.log(error);
            failed(error);
        })
    },
    fetchUrl: function(code, done, failed) {
        URL.findById(code).then(function (url) {
            done(url.longURL);
        }).catch(function(error) {
            failed(error)
        })
    }
};