"use strict";

//Allows easy response

function easy_response(req, res, next){
    //Attach functions for easy usage
    res.easy_forbidden = function(){
        res.status(403).json({ msg : "Forbiddened" });
    }

    res.easy_error = function(){
        res.status(500)({ msg : "Server Error" });
    }
    next();
}

module.exports = easy_response;