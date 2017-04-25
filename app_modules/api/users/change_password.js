"use strict";
const winston   = require("winston");
const validator = require("validator");
const internal  = rootRequire("app_modules/internal");
const USER      = internal.USER;

function changePassword(req, res){

    const new_password = req.body.new_password;

    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else if(!validator.isAlphanumeric(new_password) || !new_password.length < 8){
        res.easy_invalid();
    }else{
        USER.setNewUserPassword(req.user.id, new_password)
        .then(function(){
            res.easy_success();
        })
        .catch(function(err){
            res.easy_error();
        });
    }
}

module.exports = changePassword;