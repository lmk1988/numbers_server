"use strict";
const Promise   = require("bluebird");
const path      = require("path");
const winston   = require("winston");
const internal  = rootRequire("app_modules/internal");
const hash      = rootRequire("app_modules/components/hash");
const email     = rootRequire("app_modules/components/email");
const TOKEN     = internal.TOKEN;
const USER      = internal.USER;

function resetPassword(req, res){
    if(req.query && req.query.reset_token){
        const resetToken = req.query.reset_token;
        TOKEN.getUserIDWithResetPasswordToken(resetToken)
        .then(function(userID){
            if(userID == null){
                res.easy_forbidden();
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
            res.easy_error();
        });
    }else{
        res.easy_forbidden();
    }
};

module.exports = resetPassword;