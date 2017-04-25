"use strict";

const winston   = require("winston");
const validator = require("validator");
const USER      = rootRequire("app_modules/internal").USER;
const models = rootRequire("app_modules/models");
const _         = require("lodash");
const CONSTANTS = models.CONSTANTS;

function putProfile(req, res){
     if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else{
        const new_name = req.body[CONSTANTS.FIELDS.NAME];
        if(!_.isString(new_name) || new_name.length > 45){
            res.easy_invalid();
        }else{
            USER.setUserProfile(req.user.id, new_name)
            .then(function(){
                res.easy_success({ [CONSTANTS.FIELDS.NAME] : new_name });
            })
            .catch(function(err){
                winston.error("get profile error: ", err);
                res.easy_error();
            });
        }
    }
}

module.exports = putProfile;