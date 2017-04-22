"use strict";

const express   = require("express");
const path      = require("path");
const router    = express.Router();
const oauth     = rootRequire("app_modules/components/oauth2");

router.get("/main", oauth.authorise(), function(req, res){
    res.sendFile(path.join(process.cwd() + '/public/html/main.html'));
});

router.get("/", function(req, res){
    res.sendFile(path.join(process.cwd() + '/public/html/welcome.html'));
});

module.exports = router;