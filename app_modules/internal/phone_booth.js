"use strict";

const _ = require("lodash");
const Promise = require("bluebird");
const database = rootRequire("app_modules/components/database");
const sequelizeConnection = database.sequelizeConnection;
const models = rootRequire("app_modules/models");
const CONSTANTS = models.CONSTANTS;
const UserInfo = models.UserInfo;
const PhoneBooth = models.UserPhoneBooth;
const PhoneBoothExtra = models.UserPhoneBoothExtra;

/**
 * Retrieve list of phone booth ids belonging to user
 * @param {Integer} user_id
 * @returns {Promise<Array<Integer>>} 
 */
function getUserPhoneBoothIDList(user_id){
    return PhoneBooth.MODEL.findAll({
        where : {
            [CONSTANTS.FIELDS.USER_ID] : user_id
        },
        attributes : [ CONSTANTS.FIELDS.PHONE_BOOTH_ID ]
    })
    .then(function(phoneBoothInstanceArr){

        return _.map(phoneBoothInstanceArr, function(phoneBoothInstance){
            return phoneBoothInstance.get(CONSTANTS.FIELDS.PHONE_BOOTH_ID);
        })

    });
}

function addPhoneBooth(user_id, name, contact_num, contact_ext, imgURI){
    //TODO handle URI
    return PhoneBooth.MODEL.create({
        [CONSTANTS.FIELDS.USER_ID] : user_id,
        [CONSTANTS.FIELDS.NAME] : name,
        [CONSTANTS.FIELDS.CONTACT_NUM] : contact_num,
        [CONSTANTS.FIELDS.CONTACT_EXT] : contact_ext,
    })
}

/**
 * Adds extra details to phone booth data
 * @param {Integer} phone_booth_id 
 * @param {String} name 
 * @param {String} details 
 * @returns {Promise<Instance>} PhoneBoothExtraInstance
 */
function addPhoneBoothExtra(phone_booth_id, name, details){
    return PhoneBoothExtra.MODEL.create({
        [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id,
        [CONSTANTS.FIELDS.NAME] : name,
        [CONSTANTS.FIELDS.DETAILS] : details
    });
}

/**
 * Remove phone booth extra data
 * @param {Integer} phone_booth_extra_id
 * @returns {Promise<Integer>} 0 if no found, 1 if removed
 */
function removePhoneBoothExtra(phone_booth_extra_id){
    return PhoneBoothExtra.MODEL.destroy({
        where : {
            [CONSTANTS.FIELDS.PHONE_BOOTH_EXTRA_ID] : phone_booth_extra_id
        }
    });
}

/**
 * Modify phone booth extra data
 * @param {Integer} phone_booth_extra_id 
 * @param {String} name 
 * @param {String} details 
 */
function modifyPhoneBoothExtra(phone_booth_extra_id, name, details){
    return PhoneBoothExtra.MODEL.update({
        [CONSTANTS.FIELDS.NAME] : name,
        [CONSTANTS.FIELDS.DETAILS] : details
    },{
        where : {
            [CONSTANTS.FIELDS.PHONE_BOOTH_EXTRA_ID] : phone_booth_extra_id
        }
    })
    .spread(function(affectedCount, affectedRows){
        if(affectedCount == 0){
            return Promise.reject(new Error("modifyPhoneBoothExtra invalid phone_booth_extra_id"));
        }else{
            //Nothing to return
            return Promise.resolve();
        }
    });
}

/**
 * Retrieve array of phone booth extra instances belonging to phone_booth_id
 * @param {Integer} phone_booth_id 
 * @param {Transaction} transaction
 * @returns {Promise<Array<Instance>>} Array of PhoneBoothExtra instances
 */
function _getPhoneBoothExtraArrOfPhoneBooth(phone_booth_id, transaction){
    return PhoneBoothExtra.MODEL.findAll({
        where : {
            [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
        },
        transaction : transaction
    });
}

/**
 * Retrieve phone booth instance and phone booth extra instances under phone_booth_id
 * @param {Integer} phone_booth_id
 * @returns {Promise<[Instance, Array<Instance>]>} Returns phone booth instance and the array of phone booth extra instances inside an array.
 *                                                  Note that phone booth instance can be null
 */
function getPhoneBoothData(phone_booth_id){
    return sequelizeConnection.transaction(function (t) {
        PhoneBooth.MODEL.findById(phone_booth_id, {
            transaction : t
        })
        .then(function(phoneBoothInstance){
            if(!phoneBoothInstance){
                //Data not found
                return Promise.resolve([null, []]);
            }else{
                return _getPhoneBoothExtraArrOfPhoneBooth(phone_booth_id, t);
            }
        })
    });
}

/**
 * 
 * @param {Array<Integer>} phone_booth_id_arr 
 * @returns {Promise<Array<[Instance, Array<Instance>]>>}
 */
function getArrayOfPhoneBoothData(phone_booth_id_arr){
    return Promise.map(phone_booth_id_arr, function(phone_booth_id){
        return getPhoneBoothData(phone_booth_id);
    });
}

exports.getUserPhoneBoothIDList     = getUserPhoneBoothIDList;
exports.addPhoneBooth               = addPhoneBooth;
exports.addPhoneBoothExtra          = addPhoneBoothExtra;
exports.removePhoneBoothExtra       = removePhoneBoothExtra;
exports.modifyPhoneBoothExtra       = modifyPhoneBoothExtra;
exports.getPhoneBoothData           = getPhoneBoothData;
exports.getArrayOfPhoneBoothData    = getArrayOfPhoneBoothData;