"use strict";

const Promise   = require("bluebird");
const express   = require("express");
const path      = require("path");
const winston   = require("winston");
const router    = express.Router();
const internal  = rootRequire("app_modules/internal");
const TOKEN     = internal.TOKEN;

router.get("/main", function(req, res){
    if(req.query && req.query.access_token){
        TOKEN.isAccessTokenValid(req.query.access_token)
        .then(function(bol_valid){
            if(bol_valid){
                res.sendFile(path.join(process.cwd() + '/private/html/main.html'));
            }else{
                res.status(403).json({ msg : "Forbiddened" });
            }
        })
        .catch(function(err){
            winston.error("middleware /main error", err);
            res.status(500)({ msg : "Server Error" });
        });
    }else{
        res.status(403).json({ msg : "Forbiddened" });
    }
});

router.get("/", function(req, res){
    res.sendFile(path.join(process.cwd() + '/public/html/welcome.html'));
});

module.exports = router;