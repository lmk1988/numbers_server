"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;
const models        = rootRequire("app_modules/models");
const CONSTANTS     = models.CONSTANTS;

function putPhoneBooth(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else if(!req.params || !req.params.phone_booth_id || isNaN(_.parseInt(req.params.phone_booth_id))){
        res.easy_invalid();
    }else{
        const name = req.body[CONSTANTS.FIELDS.NAME];
        const contact_num = req.body[CONSTANTS.FIELDS.CONTACT_NUM];
        const contact_ext = req.body[CONSTANTS.FIELDS.CONTACT_EXT];

        let bol_valid = true;
        const updateData = {};
        //Can be null
        if(name != null){
            if(_.isString(name) && name.length < 45){
                updateData[CONSTANTS.FIELDS.NAME] = name;
            }else{
                bol_valid = false;
            }
        }

        if(contact_num != null){
            if(bol_valid && _.isString(contact_num) && contact_num.length < 30){
                updateData[CONSTANTS.FIELDS.CONTACT_NUM] = contact_num;
            }else{
                bol_valid = false;
            }
        }

        if(contact_ext != null){
            if(bol_valid && _.isString(contact_ext) && contact_ext.length < 10){
                updateData[CONSTANTS.FIELDS.CONTACT_EXT] = contact_ext;
            }else{
                bol_valid = false;
            }
        }

        if(!bol_valid){
            res.easy_invalid();
        }else{
            PHONE_BOOTH.updatePhoneBooth(req.user.id, req.params.phone_booth_id, updateData)
            .then(function(){
                res.easy_success();
            })
            .catch(function(err){
                winston.error("put phone booth error: ", err);
                res.easy_error();
            });
        }
    }
}

module.exports = putPhoneBooth;