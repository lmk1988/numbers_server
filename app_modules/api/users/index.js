"use strict";
const express    = require("express");
const router     = express.Router();

const register          = require("./register");
const resetPassword     = require("./reset_password");
const profile           = require("./profile");
const changePassword    = require("./change_password");

const auth_middleware = rootRequire("app_modules/middlewares/auth");

router.use("/profile", profile);

router.post("/register", register);
router.post("/reset_password", resetPassword);

//Routes that require authorization
router.post("/change_password", auth_middleware, changePassword);

module.exports = router;