"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;
const models        = rootRequire("app_modules/models");
const CONSTANTS     = models.CONSTANTS;

function putPhoneBooth(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else if(!req.params || !req.params.phone_booth_id || !_.isInteger(req.params.phone_booth_id)){
        res.easy_invalid();
    }else{
        const name = req.body[CONSTANTS.FIELDS.NAME];
        const contact_num = req.body[CONSTANTS.FIELDS.CONTACT_NUM];
        const contact_ext = req.body[CONSTANTS.FIELDS.CONTACT_EXT];

        let bol_valid = true;
        const updateData = {};
        //Can be null
        if(name != null && _.isString(name) && name.length < 45){
            updateData[CONSTANTS.FIELDS.NAME] = name;
        }else{
            bol_valid = false;
        }

        if(bol_valid && contact_num != null && _.isString(contact_num) && contact_num.length < 30){
            updateData[CONSTANTS.FIELDS.CONTACT_NUM] = contact_num;
        }else{
            bol_valid = false;
        }

        if(bol_valid && contact_ext != null && _.isString(contact_ext) && contact_ext/length < 10){
            updateData[CONSTANTS.FIELDS.CONTACT_EXT] = contact_ext;
        }else{
            bol_valid = false;
        }

        if(!bol_valid){
            res.easy_invalid();
        }else{
            PHONE_BOOTH.updatePhoneBooth(req.user.id, req.params.phone_booth_id, updateData)
            .then(function(){
                req.easy_success();
            })
            .catch(function(err){
                winston.error("put phone booth error: ", err);
                req.easy_error();
            });
        }
    }
}

module.exports = putPhoneBooth;