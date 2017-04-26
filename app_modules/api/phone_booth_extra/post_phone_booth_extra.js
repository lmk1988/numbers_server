"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;
const models        = rootRequire("app_modules/models");
const CONSTANTS     = models.CONSTANTS;

function postPhoneBoothExtra(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else if(!req.params || !req.params.phone_booth_id || !_.isInteger(req.params.phone_booth_id)){
        res.easy_invalid();
    }else{
        return PHONE_BOOTH.checkValidOwnerShip(req.user.id, req.params.phone_booth_id)
        .then(function(bol_valid){
            if(!bol_valid){
                res.easy_not_found();
            }else{
                const name = req.body[CONSTANTS.FIELDS.NAME];
                const details = req.body[CONSTANTS.FIELDS.DETAILS];

                if(_.isString(name) && name.length < 45 && _.isString(details) && details.length < 200){
                    return PHONE_BOOTH.addPhoneBoothExtra(req.params.phone_booth_extra_id)
                    .then(function(phoneBookExtraInstance){
                        res.easy_success({ [CONSTANTS.FIELDS.PHONE_BOOTH_EXTRA_ID] : phoneBookExtraInstance.get(CONSTANTS.FIELDS.PHONE_BOOTH_EXTRA_ID) });
                    });
                }else{
                    res.easy_invalid();
                }
            }
        })
        .catch(function(err){
            winston.error("post phone booth extra error: ", err);
            res.easy_error();
        });
    }
}

module.exports = postPhoneBoothExtra;