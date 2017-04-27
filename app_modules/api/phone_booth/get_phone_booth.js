"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;
const models        = rootRequire("app_modules/models");
const CONSTANTS     = models.CONSTANTS;

function getPhoneBooth(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else if(!req.params || !req.params.phone_booth_id || isNaN(_.parseInt(req.params.phone_booth_id))){
        res.easy_invalid();
    }else{
        PHONE_BOOTH.getPhoneBoothData(req.user.id, req.params.phone_booth_id)
        .spread(function(phoneBoothInstance, phoneBoothExtraInstanceArr){
            if(!phoneBoothInstance){
                res.easy_not_found();
            }else{
                const reply = phoneBoothInstance.toJSON();
                const phoneBoothExtraArr = [];
                _.forEach(phoneBoothExtraInstanceArr, function(phoneBoothExtraInstance){
                    phoneBoothExtraArr.push(phoneBoothExtraInstance.toJSON());
                });
                reply[CONSTANTS.VIRTUAL_FIELDS.PHONE_BOOTH_EXTRA_ARR] = phoneBoothExtraArr;

                res.easy_success(reply);
            }
        })
        .catch(function(){
            winston.error("get phone booth error: ", err);
            res.easy_error();
        });
    }
}

module.exports = getPhoneBooth;