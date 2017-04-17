
const express = require("express");
const router = express.Router()

router.use("/users", function(req, res){
    res.send('users')
});

router.use("/phone_booth", function(req, res){
    res.send('phonebooth')
});

module.exports = router;