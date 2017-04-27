"use strict";
const Promise   = require("bluebird");
const winston   = require("winston");
const internal  = rootRequire("app_modules/internal");
const TOKEN     = internal.TOKEN;

function logout(req, res){
    if(req.session && req.session.access_token){
        TOKEN.removeAccessToken(req.session.access_token)
        .then(function(){
            return new Promise(function(resolve){
                req.session.destroy(function(){
                    resolve();
                });
            });
        })
        .then(function(){
            res.redirect("/");
        })
        .catch(function(err){
            winston.error("middleware /logout error", err);
            res.easy_error();
        });
    }else{
        //Nothing to logout from
        res.redirect("/");
    }
}

module.exports = logout;