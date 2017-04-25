"use strict";

const winston   = require("winston");
const USER      = rootRequire("app_modules/internal").USER;

function getProfile(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else{
        USER.getJSONUserProfile(req.user.id)
        .then(function(jsonProfile){
            res.easy_success(jsonProfile);
        })
        .catch(function(err){
            winston.error("get profile error: ", err);
            res.easy_error();
        });
    }
}

module.exports = getProfile;