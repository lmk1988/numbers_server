"use strict";

//Override default Promise with bluebird
const Promise = require("bluebird");
global.Promise = Promise;

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

const config        = require("config");
const express       = require("express");
const winston       = require("winston");
const io            = require("socket.io");
const app           = express();

const middlewares   = rootRequire("app_modules/middlewares");
const api           = rootRequire("app_modules/api");
const database      = rootRequire("app_modules/components/database");


const SERVER_CONFIG = config.get("Server");
if(!SERVER_CONFIG){
    winston.error("NODE_ENV not set")
}else{
    database.validateDatabaseConnection()
    .then(function(){
        
        winston.info("database connection validated");

        app.use(middlewares);
        app.use("/api", api);
        app.use('/', express.static(__dirname + '/public'));

        app.listen(process.env.port || SERVER_CONFIG.port, function () {
            winston.info("app listening on port: "+SERVER_CONFIG.port)
        })
    })
    .catch(function(err){
        winston.error("database connection not ready", err)
    });
}
