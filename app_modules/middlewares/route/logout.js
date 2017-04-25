"use strict";
const Promise   = require("bluebird");
const winston   = require("winston");
const internal  = rootRequire("app_modules/internal");
const TOKEN     = internal.TOKEN;

function logout(req, res){
    if(req.session && req.session.access_token){
        TOKEN.removeAccessToken(req.session.access_token)
        .then(function(){
            return Promise.promisify(req.session.destroy)()
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