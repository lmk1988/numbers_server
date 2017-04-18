"use strict";
const Sequelize         = require("sequelize");
const CONSTANTS         = require("./constants");
const database          = rootRequire("components/database");
const UserPhoneBooth    = require("./user_phone_booth");

const TABLE_FIELDS = {
    [CONSTANTS.FIELDS.PHONE_BOOTH_EXTRA_ID] : {
        type : Sequelize.INTEGER.UNSIGNED,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : {
        type : Sequelize.INTEGER.UNSIGNED,
        allowNull : false,
        references : {
            model : UserPhoneBooth.MODEL,
            key   : CONSTANTS.FIELDS.PHONE_BOOTH_ID
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
    },

    [CONSTANTS.FIELDS.NAME] : {
        type : Sequelize.STRING(50),
        allowNull : false
    },

    [CONSTANTS.FIELDS.DETAILS] : {
        type : Sequelize.STRING(250),
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

const MODEL = database.createModel(CONSTANTS.TABLES.USER_PHONE_BOOTH_EXTRA, TABLE_FIELDS);

exports.MODEL           = MODEL;
exports.TABLE_FIELDS    = TABLE_FIELDS;