"use strict";

const Promise   = require("bluebird");
const database  = rootRequire("app_modules/components/database");
const models    = rootRequire("app_modules/models");
const hash      = rootRequire("app_modules/components/hash")
const sequelizeConnection = database.sequelizeConnection;
const CONSTANTS = models.CONSTANTS;
const UserAccess = models.UserAccess;
const UserRefresh = models.UserRefresh;
const UserResetPassword = models.UserResetPassword;


//////////////////
// ACCESS TOKEN //
//////////////////
/**
 * Save access token to database
 * @param {Integer} userID
 * @param {String} accessToken
 * @param {Date} expiry
 * @returns {Promise}
 */
function saveAccessToken(userID, accessToken, expiry) {
    const data = {
        [CONSTANTS.FIELDS.USER_ID]: userID,
        [CONSTANTS.FIELDS.ACCESS_TOKEN]: accessToken
    };

    if (expiry) {
        data[CONSTANTS.FIELDS.ACCESS_EXPIRY] = expiry;
    }

    return UserAccess.MODEL.create(data);
}

/**
 * Remove access token from database
 * @param {String} accessToken
 * @returns {Promise}
 */
function removeAccessToken(accessToken) {
    return UserAccess.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.ACCESS_TOKEN]: accessToken
        }
    });
}

/**
 * Removes all expired access tokens from database
 * @returns {Promise}
 */
function removeExpiredAccessTokens() {
    return UserAccess.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.ACCESS_EXPIRY]: {
                $and: [{ $ne: null }, { $lt: new Date() }]
            }
        }
    });
}

/**
 * Retrieves access token details
 * @param {String} accessToken
 * @returns {Promise<[String,Date]>} returns an array containing userID and expiry. Both can be null if access token does not exist
 */
function getAccessTokenDetails(accessToken){
    return UserAccess.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.ACCESS_TOKEN]: accessToken
        },

        attributes : [
            CONSTANTS.FIELDS.USER_ID,
            CONSTANTS.FIELDS.ACCESS_EXPIRY
        ]
    })
    .then(function(userAccessInstance){
        if(userAccessInstance){
            return [
                userAccessInstance.get(CONSTANTS.FIELDS.USER_ID),
                userAccessInstance.get(CONSTANTS.FIELDS.ACCESS_EXPIRY)
            ];
        }else{
            return [null, null];
        }
    });
}

/**
 * Retrieve userID that can be accessed using the given access token
 * @param {String} accessToken
 * @returns {Promise<String>} returns userID (can be null if invalid access token)
 */
function getUserIDWithAccessToken(accessToken){
    return UserAccess.MODEL.findOne({
        where: {
            [CONSTANTS.FIELDS.ACCESS_TOKEN]: accessToken,
            [CONSTANTS.FIELDS.ACCESS_EXPIRY]: {
                $or: [{ $eq: null }, { $gte: new Date() }]
            }
        },
        attributes : [ CONSTANTS.FIELDS.USER_ID ]
    })
    .then(function(userAccessInstance){
        if(userAccessInstance){
            return userAccessInstance.get(CONSTANTS.FIELDS.USER_ID);
        }else{
            return null;
        }
    });
}

/**
 * Checks if the given access token exist and has not expired
 * @param {String} accessToken
 * @returns {Promise<Boolean>} true if access token is valid
 */
function isAccessTokenValid(accessToken){
    return getUserIDWithAccessToken(accessToken)
    .then(function(userID){
        return (userID != null);
    });
}


///////////////////
// Refresh Token //
///////////////////

/**
 * Save refresh token to database
 * @param {Integer} userID
 * @param {String} refreshToken
 * @param {Date} expiry
 * @returns {Promise}
 */
function saveRefreshToken(userID, refreshToken, expiry) {
    const data = {
        [CONSTANTS.FIELDS.USER_ID]: userID,
        [CONSTANTS.FIELDS.REFRESH_TOKEN]: refreshToken
    };

    if (expiry) {
        data[CONSTANTS.FIELDS.REFRESH_EXPIRY] = expiry;
    }

    return UserRefresh.MODEL.create(data);
}


/**
 * Remove refresh token from database
 * @param {String} refreshToken
 * @returns {Promise}
 */
function removeRefreshToken(refreshToken) {
    return UserRefresh.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.REFRESH_TOKEN]: refreshToken
        }
    });
}

/**
 * Remove expired refresh tokens from database
 * @returns {Promise}
 */
function removeExpiredRefreshTokens() {
    return UserRefresh.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.REFRESH_EXPIRY]: {
                $and: [{ $ne: null }, { $lt: new Date() }]
            }
        }
    });
}

/**
 * Retrieves refresh token details
 * @param {String} refreshToken
 * @returns {Promise<[String,Date]>} returns an array containing userID and expiry. Both can be null if refresh token does not exist
 */
function getRefreshTokenDetails(refreshToken){
    return UserRefresh.MODEL.findOne({
        where : {
            [CONSTANTS.FIELDS.REFRESH_TOKEN]: refreshToken
        },

        attributes : [
            CONSTANTS.FIELDS.USER_ID,
            CONSTANTS.FIELDS.REFRESH_EXPIRY
        ]
    })
    .then(function(userRefreshInstance){
        if(userRefreshInstance){
            return [
                userRefreshInstance.get(CONSTANTS.FIELDS.USER_ID),
                userRefreshInstance.get(CONSTANTS.FIELDS.REFRESH_EXPIRY)
            ];
        }else{
            return [null, null];
        }
    });
}


//////////////////////////
// Reset Password Token //
//////////////////////////

/**
 * Generates a reset password token for the given userID and stores it in database
 * @param {Integer} userID
 * @returns {Promise<String>} The generated and stored reset password token
 */
function generateResetPasswordToken(userID){

    return hash.generateRandomString(60)
    .then(function(randomString){
        const now = new Date();
        const expiry = new Date(now.getTime() + 1000 * 60 * 60); //expires in an hour

        const data = {
            [CONSTANTS.FIELDS.USER_ID]: userID,
            [CONSTANTS.FIELDS.RESET_PASSWORD_TOKEN]: randomString,
            [CONSTANTS.FIELDS.RESET_PASSWORD_EXPIRY] : expiry
        };

        return UserResetPassword.MODEL.create(data)
        .then(function(){
            return randomString;
        })
    });
}

/**
 * Retrieves userID with the given reset password token
 * @param {String} resetPasswordToken
 * @returns {Promise<Integer>} returns userID or null if it doesn't exist
 */
function getUserIDWithResetPasswordToken(resetPasswordToken){
    return UserResetPassword.MODEL.findOne({
        where: {
            [CONSTANTS.FIELDS.RESET_PASSWORD_TOKEN]: resetPasswordToken,
            [CONSTANTS.FIELDS.RESET_PASSWORD_EXPIRY]: {
                $gte: new Date()
            }
        },
        attributes : [ CONSTANTS.FIELDS.USER_ID ]
    })
    .then(function(userAccessInstance){
        if(userAccessInstance){
            return userAccessInstance.get(CONSTANTS.FIELDS.USER_ID);
        }else{
            return null;
        }
    });
}

/**
 * Removes the given reset password token
 * @param {String} resetPasswordToken 
 */
function removeResetPasswordToken(resetPasswordToken){
    return UserResetPassword.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.RESET_PASSWORD_TOKEN]: resetPasswordToken
        }
    });
}

/**
 * Removes expired reset password tokens
 */
function removeExpiredResetPasswordTokens(){
    return UserResetPassword.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.ACCESS_EXPIRY]: {
                $lt: new Date()
            }
        }
    });
}

//Access Token
exports.saveAccessToken             = saveAccessToken;
exports.removeAccessToken           = removeAccessToken;
exports.removeExpiredAccessTokens   = removeExpiredAccessTokens;
exports.getAccessTokenDetails       = getAccessTokenDetails;
exports.getUserIDWithAccessToken    = getUserIDWithAccessToken;
exports.isAccessTokenValid          = isAccessTokenValid;
//Refresh Token
exports.saveRefreshToken            = saveRefreshToken;
exports.removeRefreshToken          = removeRefreshToken;
exports.removeExpiredRefreshTokens  = removeExpiredRefreshTokens;
exports.getRefreshTokenDetails      = getRefreshTokenDetails;
//Reset Password Token
exports.generateResetPasswordToken          = generateResetPasswordToken;
exports.getUserIDWithResetPasswordToken     = getUserIDWithResetPasswordToken;
exports.removeResetPasswordToken            = removeResetPasswordToken;
exports.removeExpiredResetPasswordTokens    = removeExpiredResetPasswordTokens;