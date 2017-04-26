"use strict";
const express           = require("express");
const router            = express.Router();
const users             = require("./users");
const phone_booth       = require("./phone_booth");

router.use("/users", users);
router.use("/phone_booth", phone_booth);
//Phone booth extra is located in phone booth route

module.exports = router;