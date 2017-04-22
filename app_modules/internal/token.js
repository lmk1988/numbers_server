"use strict";

const Promise = require("bluebird");
const database = rootRequire("app_modules/components/database");
const sequelizeConnection = database.sequelizeConnection;
const models = rootRequire("app_modules/models");
const CONSTANTS = models.CONSTANTS;
const UserAccess = models.UserAccess;
const UserRefresh = models.UserRefresh;

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

function removeAccessToken(accessToken) {
    return UserAccess.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.ACCESS_TOKEN]: accessToken
        }
    });
}

function removeExpiredAccessTokens() {
    return UserAccess.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.ACCESS_EXPIRY]: {
                $and: [{ $ne: null }, { $lt: new Date() }]
            }
        }
    });
}

function removeRefreshToken(refreshToken) {
    return UserRefresh.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.REFRESH_TOKEN]: refreshToken
        }
    });
}

function removeExpiredRefreshTokens() {
    return UserRefresh.MODEL.destroy({
        where: {
            [CONSTANTS.FIELDS.REFRESH_EXPIRY]: {
                $and: [{ $ne: null }, { $lt: new Date() }]
            }
        }
    });
}

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


exports.saveAccessToken             = saveAccessToken;
exports.saveRefreshToken            = saveRefreshToken;
exports.removeAccessToken           = removeAccessToken;
exports.removeExpiredAccessTokens   = removeExpiredAccessTokens;
exports.removeRefreshToken          = removeRefreshToken;
exports.removeExpiredRefreshTokens  = removeExpiredRefreshTokens;
exports.getAccessTokenDetails       = getAccessTokenDetails;
exports.getRefreshTokenDetails      = getRefreshTokenDetails;