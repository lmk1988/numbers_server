"use strict";

const express   = require("express");
const path      = require("path");
const router    = express.Router();

router.get("/", function(req, res, next){
    res.sendFile(path.join(process.cwd() + '/public/html/welcome.html'));
});

module.exports = router;