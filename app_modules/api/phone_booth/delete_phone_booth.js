"use strict";

const winston       = require("winston");
const _             = require("lodash");
const PHONE_BOOTH   = rootRequire("app_modules/internal").PHONE_BOOTH;

function deletePhoneBooth(req, res){
    if(!req.user || !req.user.id){
        res.easy_forbidden();
    }else if(!req.params || !req.params.phone_booth_id || isNaN(_.parseInt(req.params.phone_booth_id))){
        res.easy_invalid();
    }else{
        PHONE_BOOTH.removePhoneBooth(req.user.id, req.params.phone_booth_id)
        .then(function(){
            res.easy_success();
        })
        .catch(function(err){
            winston.error("delete phone booth error: ", err);
            res.easy_error();
        });
    }
}

module.exports = deletePhoneBooth;