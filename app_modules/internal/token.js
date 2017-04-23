"use strict";

const Promise = require("bluebird");
const database = rootRequire("app_modules/components/database");
const sequelizeConnection = database.sequelizeConnection;
const models = rootRequire("app_modules/models");
const CONSTANTS = models.CONSTANTS;
const UserAccess = models.UserAccess;
const UserRefresh = models.UserRefresh;

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

exports.saveAccessToken             = saveAccessToken;
exports.saveRefreshToken            = saveRefreshToken;
exports.removeAccessToken           = removeAccessToken;
exports.removeExpiredAccessTokens   = removeExpiredAccessTokens;
exports.removeRefreshToken          = removeRefreshToken;
exports.removeExpiredRefreshTokens  = removeExpiredRefreshTokens;
exports.getAccessTokenDetails       = getAccessTokenDetails;
exports.getRefreshTokenDetails      = getRefreshTokenDetails;
exports.getUserIDWithAccessToken    = getUserIDWithAccessToken;
exports.isAccessTokenValid          = isAccessTokenValid;