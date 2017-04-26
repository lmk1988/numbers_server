"use strict";

const Promise       = require("bluebird");
const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;
const models        = rootRequire("app_modules/models");
const CONSTANTS     = models.CONSTANTS;

function getAllPhoneBooth(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else{
        PHONE_BOOTH.getArrayOfPhoneBoothData(req.user.id)
        .then(function(phoneBoothDataArr){
            return Promise.map(phoneBoothDataArr, function(phoneBoothData){
                const phoneBoothJSON = phoneBoothData[0].toJSON();
                const phoneBoothExtraJSONArr = [];
                _.forEach(phoneBoothData[1], function(phoneBoothExtraInstance){
                    phoneBoothExtraJSONArr.push(phoneBoothExtraInstance.toJSON());
                });
                phoneBoothJSON[CONSTANTS.VIRTUAL_FIELDS.PHONE_BOOTH_EXTRA_ARR] = phoneBoothExtraJSONArr;

                return phoneBoothJSON;
            })
        })
        .then(function(jsonData){
            res.easy_success({ [CONSTANTS.VIRTUAL_FIELDS.PHONE_BOOTH_ARR] : jsonData });
        })
        .catch(function(err){
            winston.error("get all phone booth error: ", err);
            res.easy_error();
        });
    }
}

module.exports = getAllPhoneBooth;