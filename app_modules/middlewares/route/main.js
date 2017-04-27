"use strict";
const Promise   = require("bluebird");
const path      = require("path");
const winston   = require("winston");
const internal  = rootRequire("app_modules/internal");
const TOKEN     = internal.TOKEN;

function main(req, res){
    if(req.query && req.query.access_token){
        //Convert access token to Session
        const access_token = req.query.access_token;

        TOKEN.isAccessTokenValid(access_token)
        .then(function(bol_valid){
            if(bol_valid){
                //Store access token into session
                req.session.access_token = access_token;
                res.redirect("/main/");
            }else{
                res.easy_forbidden();
            }
        })
        .catch(function(err){
            winston.error("middleware /main token error", err);
            res.easy_error();
        });
    }else if(req.session && req.session.access_token){
        //Session access

        TOKEN.isAccessTokenValid(req.session.access_token)
        .then(function(bol_valid){
            if(bol_valid){
                //Render main html
                res.sendFile(path.join(process.cwd() + '/private/html/main.html'));
            }else{
                res.easy_forbidden();
            }
        })
        .catch(function(err){
            winston.error("middleware /main session error", err);
            res.easy_error();
        });
    }else{
        res.redirect("/");
    }
}

module.exports = main;