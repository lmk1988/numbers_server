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
const fileStorage = rootRequire("app_modules/components/file_storage");

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
    if(imgURI == null){
        return PhoneBooth.MODEL.create({
            [CONSTANTS.FIELDS.USER_ID] : user_id,
            [CONSTANTS.FIELDS.NAME] : name,
            [CONSTANTS.FIELDS.CONTACT_NUM] : contact_num,
            [CONSTANTS.FIELDS.CONTACT_EXT] : contact_ext,
        })
    }else{
        return fileStorage.storeImage(imgURI)
        .then(function(newImagePath){
            return PhoneBooth.MODEL.create({
                [CONSTANTS.FIELDS.USER_ID] : user_id,
                [CONSTANTS.FIELDS.NAME] : name,
                [CONSTANTS.FIELDS.CONTACT_NUM] : contact_num,
                [CONSTANTS.FIELDS.CONTACT_EXT] : contact_ext,
                [CONSTANTS.FIELDS.IMG_URL] : imgURI
            })
        });
    }
}

function replacePhoneBoothImage(user_id, phone_booth_id, imgURI){
    return PhoneBooth.MODEL.findOne({
         where : {
            [CONSTANTS.FIELDS.USER_ID] : user_id,
            [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
        }
    })
    .then(function(phoneBoothInstance){
        if(!phoneBoothInstance){
            return Promise.reject(new Error("replacePhoneBoothImage does not exist"));
        }else{
            const img_url = phoneBoothInstance.get(CONSTANTS.FIELDS.IMG_URL);
            let removePromise;
            //check if phone booth has img_url
            if(img_url == null){
                removePromise = Promise.resolve();
            }else{
                removePromise = fileStorage.removeImage(img_url);
            }

            return removePromise
            .then(function(){
                return fileStorage.storeImage(imgURI);
            })
            .then(function(newImagePath){
                return PhoneBooth.MODEL.update({
                    [CONSTANTS.FIELDS.IMG_URL] : newImagePath
                },{
                    where : {
                        [CONSTANTS.FIELDS.USER_ID] : user_id,
                        [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
                    }
                })
                .then(function(){
                    return newImagePath;
                })
            });
        }
    });
}

function removePhoneBooth(user_id, phone_booth_id){
    return PhoneBooth.MODEL.findOne({
         where : {
            [CONSTANTS.FIELDS.USER_ID] : user_id,
            [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
        }
    })
    .then(function(phoneBoothInstance){
        if(!phoneBoothInstance){
            //Nothing to remove
            return Promise.resolve();
        }else{
            const img_url = phoneBoothInstance.get(CONSTANTS.FIELDS.IMG_URL);
            let removePromise;
            //check if phone booth has img_url
            if(img_url == null){
                removePromise = Promise.resolve();
            }else{
                removePromise = fileStorage.removeImage(img_url);
            }

            return removePromise
            .then(function(){
                return PhoneBooth.MODEL.destroy({
                    where : {
                        [CONSTANTS.FIELDS.USER_ID] : user_id,
                        [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
                    }
                });
            })
        }
    })
}

function updatePhoneBooth(user_id, phone_booth_id, data){
    return PhoneBooth.MODEL.update(data,{
        where : {
            [CONSTANTS.FIELDS.USER_ID] : user_id,
            [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
        }
    })
    .spread(function(affectedCount, affectedRows){
        if(affectedCount == 0){
            return Promise.reject(new Error("updatePhoneBooth invalid phone_booth_id"));
        }else{
            //Nothing to return
            return Promise.resolve();
        }
    });
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
 * @param {Object} data
 */
function modifyPhoneBoothExtra(phone_booth_extra_id, data){
    return PhoneBoothExtra.MODEL.update(data,{
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
 * @param {Integer} user_id
 * @param {Integer} phone_booth_id
 * @returns {Promise<[Instance, Array<Instance>]>} Returns phone booth instance and the array of phone booth extra instances inside an array.
 *                                                  Note that phone booth instance can be null
 */
function getPhoneBoothData(user_id, phone_booth_id){
    return sequelizeConnection.transaction(function (t) {
        PhoneBooth.MODEL.findOne({
            where : {
                [CONSTANTS.FIELDS.USER_ID] : user_id,
                [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
            },
            transaction : t
        })
        .then(function(phoneBoothInstance){
            if(!phoneBoothInstance){
                //Data not found
                return Promise.resolve([null, []]);
            }else{
                return Promise.all([
                    Promise.solve(phoneBoothInstance),
                    _getPhoneBoothExtraArrOfPhoneBooth(phone_booth_id, t)
                ]);
            }
        })
    });
}

/**
 * @param {Integer} user_id
 * @returns {Promise<Array<[Instance, Array<Instance>]>>}
 */
function getArrayOfPhoneBoothData(user_id){
    return sequelizeConnection.transaction(function (t) {
        return PhoneBooth.MODEL.findAll({
            where : {
                [CONSTANTS.FIELDS.USER_ID] : user_id
            },
            transaction : t
        })
        .then(function(phoneBoothInstanceArr){
            return Promise.map(phoneBoothInstanceArr, function(phoneBoothInstance){
                return Promise.all([
                    Promise.resolve(phoneBoothInstance),
                    _getPhoneBoothExtraArrOfPhoneBooth(phoneBoothInstance.get(CONSTANTS.FIELDS.PHONE_BOOTH_ID), t)
                ]);
            });
        });
    });
}

function _checkUserOwnsPhoneBoothID(user_id, phone_booth_id){
    return PhoneBooth.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.USER_ID] : user_id,
            [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id
        },
        attributes : [ CONSTANTS.FIELDS.PHONE_BOOTH_ID ]
    })
    .then(function(phoneBoothInstance){
        if(phoneBoothInstance){
            return true;
        }else{
            return false;
        }
    });
}

function _checkPhoneBoothIDOwnsPhoneBoothExtraID(phone_booth_id, phone_booth_extra_id){
    return PhoneBoothExtra.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : phone_booth_id,
            [CONSTANTS.FIELDS.PHONE_BOOTH_EXTRA_ID] : phone_booth_extra_id
        },
        attributes : [ CONSTANTS.FIELDS.PHONE_BOOTH_EXTRA_ID ]
    })
    .then(function(phoneBoothExtraInstance){
        if(phoneBoothExtraInstance){
            return true;
        }else{
            return false;
        }
    });
}

function checkValidOwnerShip(user_id, phone_booth_id, phone_booth_extra_id){
    if(user_id != null && phone_booth_id != null){
        if(phone_booth_extra_id != null){
            return Promise.all([
                _checkUserOwnsPhoneBoothID(user_id, phone_booth_id),
                _checkPhoneBoothIDOwnsPhoneBoothExtraID(phone_booth_id, phone_booth_extra_id)
            ])
            .spread(function(bol_owner, bol_under){
                if(bol_owner && bol_under){
                    return true;
                }else{
                    return false;
                }
            });
        }else{
            return _checkUserOwnsPhoneBoothID(user_id, phone_booth_id);
        }
    }else{
        return Promise.resolve(false);
    }
}

exports.getUserPhoneBoothIDList     = getUserPhoneBoothIDList;
exports.addPhoneBooth               = addPhoneBooth;
exports.replacePhoneBoothImage      = replacePhoneBoothImage;
exports.removePhoneBooth            = removePhoneBooth;
exports.updatePhoneBooth            = updatePhoneBooth;
exports.addPhoneBoothExtra          = addPhoneBoothExtra;
exports.removePhoneBoothExtra       = removePhoneBoothExtra;
exports.modifyPhoneBoothExtra       = modifyPhoneBoothExtra;
exports.getPhoneBoothData           = getPhoneBoothData;
exports.getArrayOfPhoneBoothData    = getArrayOfPhoneBoothData;
exports.checkValidOwnerShip         = checkValidOwnerShip;