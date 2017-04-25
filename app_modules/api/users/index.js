"use strict";
const express    = require("express");
const router     = express.Router();

const register          = require("./register");
const resetPassword     = require("./reset_password");
const profile           = require("./profile");
router.use("/profile", profile);

router.post("/register", register);
router.post("/reset_password", resetPassword);

module.exports = router;