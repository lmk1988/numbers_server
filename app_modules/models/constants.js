"use strict";

const TABLES = {
    USER_INFO               : "user_info",
    USER_PASSWORD           : "user_password",
    USER_ACCESS             : "user_access",
    USER_REFRESH            : "user_refresh",
    USER_PHONE_BOOTH        : "user_phone_booth",
    USER_PHONE_BOOTH_EXTRA  : "user_phone_booth_extra"
};

const FIELDS = {
    USER_ID                 : "user_id",
    NAME                    : "name",
    EMAIL                   : "email",
    PASSWORD_HASH           : "password_hash",
    ACCESS_ID               : "access_id",
    ACCESS_TOKEN            : "access_token",
    ACCESS_EXPIRY           : "access_expiry",
    REFRESH_ID              : "refresh_id",
    REFRESH_TOKEN           : "refresh_token",
    REFRESH_EXPIRY          : "refresh_expiry",
    PHONE_BOOTH_ID          : "phone_booth_id",
    IMG_URL                 : "img_url",
    CONTACT_NUM             : "contact_num",
    CONTACT_EXT             : "contact_ext",
    PHONE_BOOTH_EXTRA_ID    : "phone_booth_extra_id",
    DETAILS                 : "details",
    CREATED_AT              : "created_at",
    UPDATED_AT              : "updated_at"
};

const VIRTUAL_FIELDS = {
    PHONE_BOOTH_EXTRA_ARR   : "phone_booth_extras"
};

const CONSTANTS = {
    "TABLES" : TABLES,
    "FIELDS" : FIELDS
};

module.exports = CONSTANTS;