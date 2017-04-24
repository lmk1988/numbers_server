"use strict";
const express       = require("express");
const router        = express.Router();

const register      = require("./register");
const resetPassword = require("./reset_password");

router.post("/register", register);
router.post("/reset_password", resetPassword);

module.exports = router;