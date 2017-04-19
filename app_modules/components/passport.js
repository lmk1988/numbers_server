"use strict";
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
const hash = rootRequire("app_modules/components/hash");
const models = rootRequire("app_modules/models");
const CONSTANTS = models.CONSTANTS;
const UserInfo = models.UserInfo;
const UserPassword = models.UserPassword;

//////////////////////////////
//  Email & Password Login  //
//////////////////////////////
passport.use(new LocalStrategy({
        usernameField: "email",
    },
    function(username, password, done) {
        UserInfo.findOne({
            where : {
                [CONSTANTS.FIELDS.EMAIL] : username
            }
        })
        .then(function(userInfoInstance){
            if(!userInfoInstance){
                return done(null, false, { message: "No user found" });
            }else{
                return UserPassword.findOne({
                    where : {
                        [CONSTANTS.FIELDS.USER_ID] : userInfoInstance.get(CONSTANTS.FIELDS.USER_ID),
                    },
                    attributes : [CONSTANTS.FIELDS.PASSWORD_HASH]
                })
                .then(function(userPasswordInstance){
                    if(!userPasswordInstance){
                        return done(new Error("Corrupted user password"));
                    }else{
                        hash.comparePassword(password, userPasswordInstance.get(CONSTANTS.FIELDS.PASSWORD_HASH))
                        .catch(function(){
                            return done(null, false, { message: "Incorrect password" });
                        })
                        .then(function(){
                            return done(null, userInfoInstance);
                        })
                    }
                })
            }
        });
    }
));

/////////////////////
//    Sessions     //
/////////////////////
passport.serializeUser(function(user, done) {
    done(null, user.get(CONSTANTS.FIELDS.USER_ID));
});

passport.deserializeUser(function(id, done) {
    UserInfo.findById(id)
    .then(function(userInfoInstance){
        done(null, userInfoInstance);
    })
    .catch(function(err){
        done(err);
    });
});



/* TODO provide Oauth2
TODO http bearer for Oauth2
passport.use("provider", new OAuth2Strategy({
    authorizationURL: 'https://www.provider.com/oauth2/authorize',
    tokenURL: 'https://www.provider.com/oauth2/token',
    clientID: '123-456-789',
    clientSecret: 'shhh-its-a-secret',
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(accessToken, refreshToken, profile, done) {
      //TODO
    User.findOrCreate(..., function(err, user) {
      done(err, user);
    });
  }
));*/

module.exports = passport;