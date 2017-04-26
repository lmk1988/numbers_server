"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;

function deletePhoneBoothExtra(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else if(!req.params || !req.params.phone_booth_id || !_.isInteger(req.params.phone_booth_id) || !req.params.phone_booth_extra_id || !_.isInteger(req.params.phone_booth_extra_id)){
        res.easy_invalid();
    }else{
        return PHONE_BOOTH.checkValidOwnerShip(req.user.id, req.params.phone_booth_id, req.params.phone_booth_extra_id)
        .then(function(bol_valid){
            if(!bol_valid){
                res.easy_not_found();
            }else{
                return PHONE_BOOTH.removePhoneBoothExtra(req.params.phone_booth_extra_id)
                .then(function(){
                    req.easy_success();
                });
            }
        })
        .catch(function(err){
            winston.error("delete phone booth extra error: ", err);
            req.easy_error();
        });
    }
}

module.exports = deletePhoneBoothExtra;