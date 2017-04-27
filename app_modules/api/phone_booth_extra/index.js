"use strict";

const express           = require("express");
const router            = express.Router({mergeParams: true}); //Bring phone booth id to this router
const auth_middleware   = rootRequire("app_modules/middlewares/auth");

const postPhoneBoothExtra    = require("./post_phone_booth_extra");
const putPhoneBoothExtra     = require("./put_phone_booth_extra");
const deletePhoneBoothExtra  = require("./delete_phone_booth_extra");

router.post("/", auth_middleware, postPhoneBoothExtra);
router.put("/:phone_booth_extra_id", auth_middleware, putPhoneBoothExtra);
router.delete("/:phone_booth_extra_id", auth_middleware, deletePhoneBoothExtra);

module.exports = router;