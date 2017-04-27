"use strict";
const Promise   = require("bluebird");
const fs        = require("fs");
const sharp     = require("sharp");
const hash      = require("./hash");
const config    = require("config");

const STORAGE_CONFIG = config.get("Storage");

const STORAGE_TYPE = {
    LOCAL : "LOCAL",
    REMOTE : "REMOTE"
};

const LOCAL_IMAGE_FOLDER = process.cwd()+"/public/user_img";
const AZURE_CONTAINER_NAME = "user-images";
let blobSvc = null;

function storeImageOnLocal(buffer_data){
    return Promise.promisify(fs.stat)(LOCAL_IMAGE_FOLDER)
    .catch(function(){
        //Directory doesn't exist
        return Promise.promisify(fs.mkdir)(LOCAL_IMAGE_FOLDER);
    })
    .then(function(){
        return hash.generateRandomString(128);
    })
    .then(function(randomString){
        return new Promise(function(resolve, reject){
            sharp(buffer_data).toFile(LOCAL_IMAGE_FOLDER+"/"+randomString+".png", function(err, info){
                if(err){
                    reject(err);
                }else{
                    resolve(STORAGE_CONFIG.prefix+randomString+".png");
                }
            });
        })
    });
}

function initAzureService(){
    return new Promise(function(resolve, reject){
        if(blobSvc == null){
            blobSvc = azure.createBlobService();
            blobSvc.createContainerIfNotExists(AZURE_CONTAINER_NAME, {
                publicAccessLevel: 'blob'
            }, function(err, result, response) {
                if(err){
                    reject(err);
                }else{
                    resolve(blobSvc);
                }
            });
        }else{
            resolve(blobSvc);
        }
    })
}

function storeImageOnAzure(buffer_data){
    return initAzureService()
    .then(function(){
        return hash.generateRandomString(128);
    })
    .then(function(randomString){
        return new Promise(function(resolve, reject){
            const fileName = randomString+".png";
            blobSvc.createBlockBlobFromText(AZURE_CONTAINER_NAME, fileName, buffer_data, function(err, result, response){
                if(err){
                    reject(err);
                }else{
                    console.log(response);
                    resolve(STORAGE_CONFIG.prefix+fileName);
                }
            })
        });
    });
}

/**
 * @param {String} imgDataURI image base64/URI data
 */
function storeImage(imgDataURI){
    if(!imgDataURI){
        return Promise.reject(new Error("storeImage invalid imageDataURI"));
    }
    imgDataURI = imgDataURI.trim();
    if(imgDataURI.startsWith("data:image/")){
        imgDataURI = imgDataURI.replace(/^data:image\/\w+;base64,/, '');
    }
    imgDataURI = new Buffer(imgDataURI, "base64");

    //Resize to smaller thumbnail resolution
    return sharp(imgDataURI).resize(200,200).max().resize(200,200).crop().png()
    .toBuffer()
    .then(function(buffer){
        switch(STORAGE_CONFIG.type){
            case STORAGE_TYPE.LOCAL:
                return storeImageOnLocal(buffer);
            case STORAGE_TYPE.REMOTE:
                return storeImageOnAzure(buffer);
            default:
                return Promise.reject(new Error("storeImage, unknown storage type"));
        }
    });
}

function removeLocalImagePath(path){
    //Convert path to possible file name
    let fileName = path;
    let lastSlashIndex = fileName.lastIndexOf("/");
    if(lastSlashIndex<0){
        lastSlashIndex = fileName.lastIndexOf("\\");
    }

    if(lastSlashIndex>=0 && ((lastSlashIndex+1) < path.length)){
        fileName = fileName.substring(lastSlashIndex+1);
    }
    return Promise.promisify(fs.unlink)(LOCAL_IMAGE_FOLDER+"/"+fileName);
}

function removeAzureBlob(path){
    return initAzureService()
    .then(function(){
        //Convert path to possible file name
        let fileName = path;
        let lastSlashIndex = fileName.lastIndexOf("/");
        if(lastSlashIndex<0){
            lastSlashIndex = fileName.lastIndexOf("\\");
        }

        if(lastSlashIndex>=0 && ((lastSlashIndex+1) < path.length)){
            fileName = fileName.substring(lastSlashIndex+1);
        }
        return new Promise(function(resolve, reject){
            blobSvc.deleteBlob(AZURE_CONTAINER_NAME, fileName, function(err, response){
                if(err){
                    reject(err);
                }else{
                    resolve(response);
                }
            });
        });
    });
}

function removeImage(path){
    switch(STORAGE_CONFIG.type){
        case STORAGE_TYPE.LOCAL:
            return removeLocalImagePath(path);
        case STORAGE_TYPE.REMOTE:
            return removeAzureBlob(path);
        default:
            return Promise.reject(new Error("removeImage, unknown storage type"));
    }
}

exports.storeImage  = storeImage;
exports.removeImage = removeImage;