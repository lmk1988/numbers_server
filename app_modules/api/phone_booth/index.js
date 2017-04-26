"use strict";

const express           = require("express");
const router            = express.Router();
const auth_middleware   = rootRequire("app_modules/middlewares/auth");
const phone_booth_extra = require("../phone_booth_extra");

const postPhoneBooth    = require("./post_phone_booth");
const getPhoneBooth     = require("./get_phone_booth");
const getAllPhoneBooth  = require("./get_all_phone_booth");
const putPhoneBooth     = require("./put_phone_booth");
const deletePhoneBooth  = require("./delete_phone_booth");

router.use("/:phone_booth_id/extra", phone_booth_extra);

router.get("/:phone_booth_id", auth_middleware, getPhoneBooth);
router.get("/", auth_middleware, getAllPhoneBooth);

router.put("/:phone_booth_id", auth_middleware, putPhoneBooth);
router.delete("/:phone_booth_id", auth_middleware, deletePhoneBooth);

router.post("/", auth_middleware, postPhoneBooth);

module.exports = router;