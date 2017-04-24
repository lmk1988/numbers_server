"use strict";
const Sequelize = require("sequelize");
const CONSTANTS = require("./constants");
const database  = rootRequire("app_modules/components/database");
const UserInfo  = require("./user_info");

const TABLE_FIELDS = {
    [CONSTANTS.FIELDS.RESET_PASSWORD_ID] : {
        type : Sequelize.INTEGER.UNSIGNED,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    [CONSTANTS.FIELDS.USER_ID] : {
        type : Sequelize.INTEGER.UNSIGNED,
        allowNull : false,
        references : {
            model : UserInfo.MODEL,
            key   : CONSTANTS.FIELDS.USER_ID
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
    },

    [CONSTANTS.FIELDS.RESET_PASSWORD_TOKEN] : {
        type : Sequelize.STRING(255),
        allowNull : false,
        unique : true
    },

    [CONSTANTS.FIELDS.RESET_PASSWORD_EXPIRY] : {
        type : Sequelize.DATE,
        allowNull : false
    },

    [CONSTANTS.FIELDS.CREATED_AT] : {
        type : Sequelize.DATE,
        allowNull : false
    },

    [CONSTANTS.FIELDS.UPDATED_AT] : {
        type : Sequelize.DATE,
        allowNull : false
    }
};

const MODEL = database.createModel(CONSTANTS.TABLES.USER_RESET_PASSWORD, TABLE_FIELDS);

exports.MODEL           = MODEL;
exports.TABLE_FIELDS    = TABLE_FIELDS;