"use strict";

//Allows easy response

function easy_response(req, res, next){
    //Attach functions for easy usage

    res.easy_success = function(data){
        res.status(200).json({ status : "success" , data : data });
    }

    res.easy_invalid = function(msg){
        res.status(400).json({ status : "fail", message : (msg || "Invalid Fields") });
    }

    res.easy_forbidden = function(msg){
        res.status(403).json({ status : "fail", message : (msg || "Forbiddened") });
    }

    res.easy_conflict = function(msg){
        res.status(409).json({ status : "fail", message : (msg || "Conflict") });
    }

    res.easy_error = function(msg){
        res.status(500)({ status : "error", message : (msg || "Server Error") });
    }
    next();
}

module.exports = easy_response;