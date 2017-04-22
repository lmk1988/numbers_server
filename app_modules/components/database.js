"use strict";

const config    = require("config");
const Promise   = require("bluebird");
const Sequelize = require("sequelize");

/**
 * @return {Object} Sequelize object which is used to interact with database
 */
function createSequelizeDatabaseConnection(){

    const databaseConfig = config.get('Database');

    const sequelizeOption = {
        dialect : databaseConfig.dialect,
        host : databaseConfig.host,
        logging : false,
        timezone : '+00:00',
        define : {
            freezeTableName: true
        }
    };

    //Extra unique configurations
    if(databaseConfig.port){
        sequelizeOption.port = databaseConfig.port
    }

    if(databaseConfig.dialectOptions){
        sequelizeOption.dialectOptions = databaseConfig.dialectOptions
    }
    
    //parameters to connect to the database
    return new Sequelize(databaseConfig.name,
                         databaseConfig.user,
                         databaseConfig.password,
                         sequelizeOption);
}

const sequelizeConnection = createSequelizeDatabaseConnection();

function validateDatabaseConnection(){
    return sequelizeConnection.authenticate()
    .then(function(){
        return sequelizeConnection.sync();
    });
}

const GENERAL_TABLE_OPTIONS = {
    underscored : true,
    timestamps  : true
};

function createModel(tableName, tableFields){

    //Copy general options
    const options = Object.assign({}, GENERAL_TABLE_OPTIONS);
    
    //Point sequelize to the correct timestamp fields
    if(tableFields[CONSTANTS.FIELDS.CREATED_AT]){
        options.createdAt = CONSTANTS.FIELDS.CREATED_AT;
    }

    if(tableFields[CONSTANTS.FIELDS.UPDATED_AT]){
        options.updatedAt = CONSTANTS.FIELDS.UPDATED_AT;
    }

    return sequelizeConnection.define(tableName, tableFields, options);
}

exports.sequelizeConnection         = sequelizeConnection;
exports.validateDatabaseConnection  = validateDatabaseConnection;
exports.createModel                 = createModel;