"use strict";
const winston   = require("winston");
const validator = require("validator");
const config    = require("config");
const mail      = rootRequire("app_modules/components/email");
const internal  = rootRequire("app_modules/internal");
const USER      = internal.USER;
const TOKEN     = internal.TOKEN;

function resetPassword(req, res){

    const email = req.body.email;

    //Validate for email
    if(validator.isEmail(email)){
        USER.getUserIDOfEmail(email)
        .then(function(userID){
            if(userID){
                TOKEN.generateResetPasswordToken(userID)
                .then(function(resetPasswordToken){
                    const protocol = config.util.getEnv("NODE_ENV")=="prod"?"https":"http"
                    const url = protocol+"://"+config.get("Server.hostName")+"/reset_password?reset_token="+resetPasswordToken;
                    return mail.templateResetPasswordConfirm(email, url)
                    .then(function(body){
                        mail.sendEmail(email, "Reset Password", body);
                    });
                })
                .catch(function(err){
                    winston.error("reset password error", err, req.body);
                    res.status(500).json({ error : "server error" });
                });
            }else{
                res.status(403).json({ msg : "email does not exist" });
            }
        });
    }else{
        res.status(400).json({ msg : "invalid fields" });
    }
}

module.exports = resetPassword