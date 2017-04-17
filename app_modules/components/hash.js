const config = require("config");
const bcrypt = require("bcrypt");

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

exports.hashPlainPassword = hashPlainPassword;
exports.comparePassword = comparePassword;