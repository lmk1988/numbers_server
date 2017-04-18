"use strict";
const Sequelize = require("sequelize");
const CONSTANTS = require("./constants");
const database  = rootRequire("components/database");

const TABLE_FIELDS = {
    [CONSTANTS.FIELDS.USER_ID] : {
        type : Sequelize.INTEGER.UNSIGNED,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    [CONSTANTS.FIELDS.NAME] : {
        type : Sequelize.STRING(50),
        allowNull : false
    },

    [CONSTANTS.FIELDS.EMAIL] : {
        type : Sequelize.STRING(50),
        allowNull : false,
        validate : {
            isEmail : true
        },
        unique : true
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

const MODEL = database.createModel(CONSTANTS.TABLES.USER_INFO, TABLE_FIELDS);

exports.MODEL           = MODEL;
exports.TABLE_FIELDS    = TABLE_FIELDS;