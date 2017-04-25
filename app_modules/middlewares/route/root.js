"use strict";
const path      = require("path");

function root(req, res){
    res.sendFile(path.join(process.cwd() + '/public/html/welcome.html'));
}

module.exports = root;