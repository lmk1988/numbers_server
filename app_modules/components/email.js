"use strict";

const Promise = require("bluebird");
const winston = require("winston");
const helper = require("sendgrid").mail

const sg;
if(process.env.SENDGRID_API_KEY){
    sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
}else{
    //Unconfigured sendgrid API (non-prod)
    sg = null;
}

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

        sg.API(request)
        .then(function(response){
            if(response && response.statusCode == 200){
                winston.info("sendEmail sent to : "+email);
                return true;
            }else{
                winston.error("sendEmail failed", response.statusCode, response.body, response.headers);
                return false;
            }
        })
    }
}

exports.sendEmail = sendEmail;