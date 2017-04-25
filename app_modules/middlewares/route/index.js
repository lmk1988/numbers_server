"use strict";

const express       = require("express");
const router        = express.Router();

const main          = require("./main");
const resetPassword = require("./reset_password");
const root          = require("./root");
const logout        = require("./logout");

router.get("/main", main);
router.get("/reset_password", resetPassword);
router.get("/logout", logout);
router.get("/", root);

module.exports = router;