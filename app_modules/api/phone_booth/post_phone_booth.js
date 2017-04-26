"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;
const models        = rootRequire("app_modules/models");
const CONSTANTS     = models.CONSTANTS;

function postPhoneBooth(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else{
        const name = req.body[CONSTANTS.FIELDS.NAME];
        const contact_num = req.body[CONSTANTS.FIELDS.CONTACT_NUM];
        const contact_ext = req.body[CONSTANTS.FIELDS.CONTACT_EXT];

        if(_.isString(name) && name.length < 45 && _.isString(contact_num) && contact_num.length < 30 && _.isString(contact_ext) && contact_ext/length < 10){
            PHONE_BOOTH.addPhoneBooth(req.user.id, name, contact_num, contact_ext)
            .then(function(phoneBoothInstance){
                req.easy_success({ [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phoneBoothInstance.get(CONSTANTS.FIELDS.PHONE_BOOTH_ID) })
            })
            .catch(function(err){
                winston.error("post phone booth error: ", err);
                req.easy_error();
            });
        }else{
            req.easy_invalid();
        }
    }
}

module.exports = postPhoneBooth;