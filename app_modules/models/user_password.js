"use strict";
const Sequelize = require("sequelize");
const CONSTANTS = require("./constants");
const database  = rootRequire("app_modules/components/database");
const UserInfo  = require("./user_info");

const TABLE_FIELDS = {
    [CONSTANTS.FIELDS.USER_ID] : {
        type : Sequelize.INTEGER.UNSIGNED,
        allowNull : false,
        primaryKey : true,
        references : {
            model : UserInfo.MODEL,
            key   : CONSTANTS.FIELDS.USER_ID
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
    },

    [CONSTANTS.FIELDS.PASSWORD_HASH] : {
        type : Sequelize.STRING(200),
        allowNull : false
    },

    [CONSTANTS.FIELDS.UPDATED_AT] : {
        type : Sequelize.DATE,
        allowNull : false
    }
};

const MODEL = database.createModel(CONSTANTS.TABLES.USER_PASSWORD, TABLE_FIELDS);

exports.MODEL           = MODEL;
exports.TABLE_FIELDS    = TABLE_FIELDS;