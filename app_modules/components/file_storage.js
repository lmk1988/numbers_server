const fs = require("fs")

const STORAGE_TYPE = {
    LOCAL : "LOCAL",
    REMOTE : "REMOTE"
};

/**
 * @param {String} imgDataURI image base64/URI data
 */
function storeImageOnLocal(imgDataURI){
    //TODO
}

/**
 * @param {String} imgDataURI image base64/URI data
 */
function storeImageOnAWSS3(imgDataURI){
    return Promise.reject(new Error("storeImageOnAWSS3, we do not use S3 but it's expandable"));
}

/**
 * @param {String} imgDataURI image base64/URI data
 * @param {STORAGE_TYPE} storageType storage type
 */
function storeImage(imgDataURI, storageType){
    switch(storageType){
        case STORAGE_TYPE.LOCAL:
            return storeImageOnLocal(imgDataURI);
        case STORAGE_TYPE.REMOTE:
            return storeImageOnAWSS3(imgDataURI);
        default:
            return Promise.reject(new Error("storeImage, unknown storage type"));
    }
}

exports.storeImage = storeImage;