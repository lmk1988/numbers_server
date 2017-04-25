"use strict";

const Promise = require("bluebird");
const hash = rootRequire("app_modules/components/hash");
const database = rootRequire("app_modules/components/database");
const sequelizeConnection = database.sequelizeConnection;
const models = rootRequire("app_modules/models");
const CONSTANTS = models.CONSTANTS;
const UserInfo = models.UserInfo;
const UserPassword = models.UserPassword;

/**
 * Register a new user
 * @param {String} name
 * @param {String} email 
 * @param {String} password
 * @returns {Promise} returns error if register failed
 */
function registerUser(name, email, password){
    return hash.hashPlainPassword(password)
    .then(function(hashedPassword){
        return sequelizeConnection.transaction(function (t) {
            return UserInfo.MODEL.create({
                [CONSTANTS.FIELDS.NAME] : name,
                [CONSTANTS.FIELDS.EMAIL] : email
            }, {transaction : t})
            .then(function(userInstance){
                return UserPassword.MODEL.create({
                    [CONSTANTS.FIELDS.USER_ID] : userInstance.get(CONSTANTS.FIELDS.USER_ID),
                    [CONSTANTS.FIELDS.PASSWORD_HASH] : hashedPassword
                }, {transaction : t});
            });
        });
    });
}

/**
 * Retrieve userID with the given email
 * @param {String} email 
 * @returns {Promise<Integer>} returns userID if email exist, else returns null
 */
function getUserIDOfEmail(email){
    return UserInfo.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.EMAIL] : email
        },
        attributes : [CONSTANTS.FIELDS.USER_ID]
    })
    .then(function(userInfoInstance){
        if(userInfoInstance){
            return userInfoInstance.get(CONSTANTS.FIELDS.USER_ID);
        }else{
            return null;
        }
    });
}

/**
 * Checks if a user with the given email already exist
 * @param {String} email
 * @returns {Promise<Boolean>} true if email exist
 */
function checkIfAccountExist(email){
    return getUserIDOfEmail(email)
    .then(function(userID){
        return userID != null;
    });
}

/**
 * Change user password
 * @param {Integer} user_id
 * @param {String} password 
 */
function setNewUserPassword(user_id, password){
    return hash.hashPlainPassword(password)
    .then(function(hashedPassword){
        return UserPassword.MODEL.update({
            [CONSTANTS.FIELDS.PASSWORD_HASH] : hashedPassword
        }, {
            where : {
                [CONSTANTS.FIELDS.USER_ID] : user_id
            },
            transaction : t
        })
    })
    .spread(function(affectedCount, affectedRows){
        if(affectedCount == 0){
            return Promise.reject(new Error("setNewUserPassword invalid user_id"));
        }else{
            //Nothing to return
            return Promise.resolve();
        }
    });
}


/**
 * Validate user email with its password
 * @param {String} email
 * @param {String} password
 * @returns {Promise<[Boolean, String]>} true if email exist and has the same password, returns the userID with it
 */
function validateUserPassword(email, password){
    return UserInfo.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.EMAIL] : email
        }
    })
    .then(function(userInfoInstance){
        if(!userInfoInstance){
            return [false, null];
        }else{
            const userID = userInfoInstance.get(CONSTANTS.FIELDS.USER_ID);
            return UserPassword.MODEL.findOne({
                where : {
                    [CONSTANTS.FIELDS.USER_ID] : userID,
                },
                attributes : [CONSTANTS.FIELDS.PASSWORD_HASH]
            })
            .then(function(userPasswordInstance){
                if(!userPasswordInstance){
                    return [false, null];
                }else{
                    return hash.comparePassword(password, userPasswordInstance.get(CONSTANTS.FIELDS.PASSWORD_HASH))
                    .then(function(bol_match){
                        return [bol_match, bol_match?userID:null];
                    });
                }
            })
        }
    });
}

/**
 * Retrieves email of the given userID
 * @param {Integer} userID
 * @returns {Promise<String>} returns email or null if invalid userID
 */
function getEmailOfUserID(userID){
    return UserInfo.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.USER_ID] : userID
        },
        attributes : [CONSTANTS.FIELDS.EMAIL]
    })
    .then(function(userInfoInstance){
        if(userInfoInstance){
            return userInfoInstance.get(CONSTANTS.FIELDS.EMAIL);
        }else{
            return null;
        }
    });
}

function getJSONUserProfile(userID){
    return UserInfo.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.USER_ID] : userID
        },
        attributes : [CONSTANTS.FIELDS.EMAIL, CONSTANTS.FIELDS.NAME]
    })
    .then(function(userInfoInstance){
        if(userInfoInstance){
            return userInfoInstance.toJSON();
        }else{
            return null;
        }
    });
}

function setUserProfile(userID, name){
    //Currently we can only change the name
    return UserInfo.MODEL.update({
        [CONSTANTS.FIELDS.NAME] : name
    },
    {
        where : {
            [CONSTANTS.FIELDS.USER_ID] : userID
        },
    });
}

exports.registerUser            = registerUser;
exports.getUserIDOfEmail        = getUserIDOfEmail;
exports.checkIfAccountExist     = checkIfAccountExist;
exports.setNewUserPassword      = setNewUserPassword;
exports.validateUserPassword    = validateUserPassword;
exports.getEmailOfUserID        = getEmailOfUserID;
exports.getJSONUserProfile      = getJSONUserProfile;
exports.setUserProfile          = setUserProfile;