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

exports.registerUser        = registerUser;
exports.setNewUserPassword  = setNewUserPassword;