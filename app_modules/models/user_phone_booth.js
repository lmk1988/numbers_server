"use strict";
const Sequelize = require("sequelize");
const CONSTANTS = require("./constants");
const database  = rootRequire("app_modules/components/database");
const UserInfo  = require("./user_info");

const TABLE_FIELDS = {
    [CONSTANTS.FIELDS.PHONE_BOOTH_ID] : {
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

    [CONSTANTS.FIELDS.NAME] : {
        type : Sequelize.STRING(50),
        allowNull : false
    },

    [CONSTANTS.FIELDS.IMG_URL] : {
        type : Sequelize.STRING(200),
        allowNull : true
    },

    [CONSTANTS.FIELDS.CONTACT_NUM] : {
        type : Sequelize.STRING(30),
        allowNull : false
    },

    [CONSTANTS.FIELDS.CONTACT_EXT] : {
        type : Sequelize.STRING(10),
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

const MODEL = database.createModel(CONSTANTS.TABLES.USER_PHONE_BOOTH, TABLE_FIELDS);

exports.MODEL           = MODEL;
exports.TABLE_FIELDS    = TABLE_FIELDS;