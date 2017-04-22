"use strict";
const express   = require("express");
const users     = require("./users");
const router    = express.Router();

router.use("/users", users);

router.use("/phone_booth", function(req, res){
    res.send('phonebooth')
});

module.exports = router;