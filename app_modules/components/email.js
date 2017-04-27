"use strict";

const Promise   = require("bluebird");
const winston   = require("winston");
const helper    = require("sendgrid").mail
const fs        = require("fs");
const ejs       = require("ejs");

const promiseReadFile = Promise.promisify(fs.readFile);

//Unconfigured sendgrid API (non-prod)
const sg = process.env.SENDGRID_API_KEY?(require('sendgrid')(process.env.SENDGRID_API_KEY)):null;

const from_email = new helper.Email("no-reply@phone-booth.azurewebsites.net");

/**
 * @param {String} email email address to send to
 * @param {String} subject string title
 * @param {String} body html body
 * @returns {Promise<Boolean>} true if email was sent successfully
 */
function sendEmail(email, subject, body){
    if(sg == null){
        winston.warn("sendGrid API not configured");
        return Promise.reject(new Error(""));
    }else{
        const to_email = new helper.Email(email);
        const content = new helper.Content("text/html", body);
        const mail = new helper.Mail(from_email, subject, to_email, content);

        const request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });

        return sg.API(request)
        .then(function(response){
            //200 is valid but not queued to be delivered
            if(response && response.statusCode == 202){
                winston.info("sendEmail sent to : "+email);
                return true;
            }else{
                winston.error("sendEmail failed", response.statusCode, response.body, response.headers);
                return false;
            }
        })
    }
}

/**
 * Generate template for reset password confirmation
 * @param {String} email
 * @param {String} url url for server to register confirmation
 */
function templateResetPasswordConfirm(email, url){
    return promiseReadFile('private/email_template/reset_password_confirm.ejs', 'utf8')
    .then(function(file){
        return ejs.render(file, {
            email : email,
            url : url
        });
    });
}

/**
 * Generate template for generation of new password
 * @param {String} email
 * @param {String} new_password new generated password
 */
function templateGeneratePassword(email, new_password){
    return promiseReadFile('private/email_template/generate_password.ejs', 'utf8')
    .then(function(file){
        return ejs.render(file, {
            email : email,
            new_password : new_password
        });
    });
}

exports.sendEmail                       = sendEmail;
exports.templateResetPasswordConfirm    = templateResetPasswordConfirm;