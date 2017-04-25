"use strict";
const express   = require("express");
const router    = express.Router();
const oauth     = rootRequire("app_modules/components/oauth2");

function middlewareAttachSessionAccessToken(req, res, next){
    //This allows consistent API to handle both client and mobile app API
    if(req.body && !req.body.access_token && req.session && req.session.access_token){
        //Attach session access_token to body for oauth to verify
        req.body.access_token = req.session.access_token;
    }

    next();
}

router.use(middlewareAttachSessionAccessToken);
router.use(oauth.authorise());

module.exports = router;