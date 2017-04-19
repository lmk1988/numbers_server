"use strict";
const config    = require("config");
const bcrypt    = require("bcrypt");
const crypto    = require("crypto");
const Promise   = require("bluebird");

/**
 * @param {String} password plain text password
 * @returns {Promise<String>} hashed password
 */
function hashPlainPassword(password){
    return bcrypt.hash(password, config.get("Password").SaltRounds);
}

/**
 * @param {String} plainPassword plain text password
 * @param {String} hashedPassword bcrypt hashed password
 * @returns {Promise<Boolean>} Boolean which indicates if they are the same 
 */
function comparePassword(plainPassword, hashedPassword){
    return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generates a random string
 * @param {*} length length of the desired random string
 */
function generateRandomString(length){
    //Length divide by 2 because a byte generated 2 characters
    return Promise.promisify(crypto.randomBytes)(Math.ceil(length/2))
    .then(function(randomBytes){
        //Convert bytes to hex
        return randomBytes.toString("hex");
    });
}

exports.hashPlainPassword       = hashPlainPassword;
exports.comparePassword         = comparePassword;
exports.generateRandomString    = generateRandomString;