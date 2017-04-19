"use strict";

const express   = require("express");
const router    = express.Router()

router.use("/", function(req, res, next){
    res.send('Homepage')
});

module.exports = router;