"use strict";

const Promise   = require("bluebird");
const express   = require("express");
const path      = require("path");
const winston   = require("winston");
const router    = express.Router();
const internal  = rootRequire("app_modules/internal");
const TOKEN     = internal.TOKEN;
const userID    = internal.USER;
const hash      = rootRequire("app_modules/components/hash");
const email     = rootRequire("app_modules/components/email");

function resForbiddened(res){
    res.status(403).json({ msg : "Forbiddened" });
}

function resError(res){
    res.status(500)({ msg : "Server Error" });
}

router.get("/main", function(req, res){
    if(req.query && req.query.access_token){
        //Convert access token to Session
        const access_token = req.query.access_token;

        TOKEN.isAccessTokenValid(access_token)
        .then(function(bol_valid){
            if(bol_valid){
                //Store access token into session
                req.session.access_token = access_token;
                res.redirect("/main");
            }else{
                resForbiddened(res);
            }
        })
        .catch(function(err){
            winston.error("middleware /main token error", err);
            resError(res);
        });
    }else if(req.session && req.session.access_token){
        //Session access

        TOKEN.isAccessTokenValid(req.session.access_token)
        .then(function(bol_valid){
            if(bol_valid){
                //Render main html
                res.sendFile(path.join(process.cwd() + '/private/html/main.html'));
            }else{
                resForbiddened(res);
            }
        })
        .catch(function(err){
            winston.error("middleware /main session error", err);
            resError(res);
        });
    }else{
        resForbiddened(res);
    }
});

router.get("/reset_password", function(req, res){
    if(req.query && req.query.reset_token){
        const resetToken = req.query.reset_token;
        TOKEN.getUserIDWithResetPasswordToken(resetToken)
        .then(function(userID){
            if(userID == null){
                resForbiddened(res);
            }else{
                return TOKEN.removeResetPasswordToken(resetToken)
                .then(function(){
                    return hash.generateRandomString(10)
                })
                .then(function(newPassword){
                    return USER.setNewUserPassword(userID, newPassword)
                    .then(function(){
                        return Promise.all([
                            USER.getEmailOfUserID(userID),
                            Promise.resolve(newPassword)
                        ])
                    });
                })
                .spread(function(to_email, randomString){
                    return email.templateGeneratePassword(to_email, randomString)
                    .then(function(body){
                        email.sendEmail(to_email, "Your New Password", body);
                    });
                })
                .then(function(){
                    res.sendFile(path.join(process.cwd() + '/public/html/reset_password_ok.html'));
                });
            }
        })
        .catch(function(err){
            winston.error("middleware /reset_password error", err);
            resError(res);
        });
    }else{
        resForbiddened(res);
    }
});

router.get("/logout", function(req, res){
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
            resError(res);
        });
    }else{
        //Nothing to logout from
        res.redirect("/");
    }
});

router.get("/", function(req, res){
    res.sendFile(path.join(process.cwd() + '/public/html/welcome.html'));
});

module.exports = router;