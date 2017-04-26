"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;
const models        = rootRequire("app_modules/models");
const CONSTANTS     = models.CONSTANTS;

function putPhoneBoothExtra(req, res){
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
                const name = req.body[CONSTANTS.FIELDS.NAME];
                const details = req.body[CONSTANTS.FIELDS.DETAILS];

                let bol_valid = true;
                const updateData = {};

                 if(name != null && _.isString(name) && name.length < 45){
                    updateData[CONSTANTS.FIELDS.NAME] = name;
                }else{
                    bol_valid = false;
                }

                if(bol_valid && details != null && _.isString(details) && details.length < 200){
                    updateData[CONSTANTS.FIELDS.DETAILS] = details;
                }else{
                    bol_valid = false;
                }

                if(!bol_valid){
                    res.easy_invalid();
                }else{
                    return PHONE_BOOTH.modifyPhoneBoothExtra(req.params.phone_booth_extra_id, updateData)
                    .then(function(){
                        res.easy_success();
                    });
                }
            }
        })
        .catch(function(err){
            winston.error("put phone booth extra error: ", err);
            req.easy_error();
        });

    }
}

module.exports = putPhoneBoothExtra;