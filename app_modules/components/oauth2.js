"use strict";
const oauth2_server = require("oauth2-server");
const internal = rootRequire("app_modules/internal");
const USER = internal.USER;
const TOKEN = internal.TOKEN;

//Currently we only have 1 client, not really required to create another database for this
const BROWSER_CLIENT_ID = "q438dg51j235tswg53";
const BROWSER_CLIENT_SECRET = "fdafb823j45mmblds8934kjs";

//https://www.npmjs.com/package/node-oauth2-server

//Interface for library to work with
const oauthModel = {
    //////////////////////////////////
    // Required for all grant types //
    //////////////////////////////////

    getAccessToken : function(bearerToken, callback){
        TOKEN.getAccessTokenDetails(bearerToken)
        .spread(function(userID, expiry){
            if(userID != null){
                callback(null, {
                    expires : expiry,
                    user : { id : userID }
                });
            }else{
                callback(null, null);
            }
        })
        .catch(function(err){
            callback(err);
        });
    },

    getClient : function(clientId, clientSecret, callback){
        if(clientId == BROWSER_CLIENT_ID && clientSecret == BROWSER_CLIENT_SECRET){
            callback(null, {
                clientId : BROWSER_CLIENT_ID
            });
        }else{
            callback(new Error("invalid client"));
        }
    },

    grantTypeAllowed : function(clientId, grantType, callback){
        callback(null, (grantType == "password" || grantType == "refresh_token"));
    },

    saveAccessToken : function(accessToken, clientId, expires, user, callback){
        TOKEN.saveAccessToken(user.id, accessToken, expires)
        .then(function(){
            callback(null);
        })
        .catch(function(err){
            callback(err);
        });
    },

    //////////////////////////////////////
    // Required for password grant type //
    //////////////////////////////////////
    getUser  : function(username, password, callback){
        USER.validateUserPassword(username, password)
        .spread(function(bol_matched, userID){
            if(bol_matched && userID != null){
                callback(null, { id : userID });
            }else{
                callback(null, null);
            }
        })
        .catch(function(err){
            callback(err);
        });
    },

    ///////////////////////////////////////////
    // Required for refresh_token grant type //
    ///////////////////////////////////////////
    saveRefreshToken : function(refreshToken, clientId, expires, user, callback){
        TOKEN.saveRefreshToken(user.id, refreshToken, expires)
        .then(function(){
            callback(null);
        })
        .catch(function(err){
            callback(err);
        });
    },

    getRefreshToken : function(refreshToken, callback){
        TOKEN.getRefreshTokenDetails(refreshToken)
        .spread(function(userID, expiry){
            if(userID != null){
                callback(null, {
                    clientId : BROWSER_CLIENT_ID,
                    expires : expiry,
                    userId : userID
                });
            }else{
                callback(null, null);
            }
        })
        .catch(function(err){
            callback(err);
        });
    },
};

const oauth = oauth2_server({
    model: oauthModel,
    grants: ["password", "refresh_token"],
    //debug: true
});

module.exports = oauth;