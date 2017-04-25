"use strict";

const express    = require("express");
const router     = express.Router();
const auth_middleware = rootRequire("app_modules/middlewares/auth");
const getProfile = require("./get_profile");
const putProfile = require("./put_profile");

router.get("/", auth_middleware, getProfile);
router.put("/", auth_middleware, putProfile);

module.exports = router;