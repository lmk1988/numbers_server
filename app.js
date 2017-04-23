"use strict";

//Override default Promise with bluebird
const Promise = require("bluebird");
global.Promise = Promise;

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

const config            = require("config");
const express           = require("express");
const winston           = require("winston");
const bodyParser        = require('body-parser');
const app               = express();

const middlewares   = rootRequire("app_modules/middlewares");
const api           = rootRequire("app_modules/api");
const database      = rootRequire("app_modules/components/database");
const oauth2        = rootRequire("app_modules/components/oauth2");

app.oauth = oauth2;

const SERVER_CONFIG = config.get("Server");
if(!SERVER_CONFIG){
    winston.error("NODE_ENV not set")
}else{
    database.validateDatabaseConnection()
    .then(function(){

        winston.info("database connection validated");
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({limit: '5mb'}));

        if(SERVER_CONFIG.forceHTTPS){
            //Force https
            app.use(function(req, res, next){
                if(!req.secure && req.get("x-forwarded-proto") !== "https"){
                    res.redirect("https://" + req.get("host") + req.url);
                }else{
                    next();
                }
            });
        }
        app.all('/oauth/token', app.oauth.grant());
        app.use(middlewares);
        app.use("/api", api);
        app.use('/', express.static(__dirname + '/public'));
        app.use(app.oauth.errorHandler());

        //TODO test
        app.use(function(req, res, next){
            winston.info("uncaught request", req.path, req.originalUrl);
            next();
        });

        const port = process.env.port || SERVER_CONFIG.port;
        app.listen(port, function () {
            winston.info("app listening on port: "+port)
        })
    })
    .catch(function(err){
        winston.error("database connection not ready", err)
    });
}
