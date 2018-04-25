// A set of helper functions
var express = require('express');
var sqlString = require('sqlstring');
var nodemailer = require('nodemailer');
// This for email verification
var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "projectulist@gmail.com",
    pass: "projectUlist@2017"
  }
});

module.exports = {
  getUserName: function(body_username, sessions_username) {
    if (body_username == null && sessions_username == null) {
      var message = "Session Time-out";
      throw message;
    } else {
      return body_username == null ? sessions_username : body_username;
    }
  },

  escape: function(input) {
    console.log(input);
    if (input == null) {
      var message = "missing input";
      throw message;
    }
    return sqlString.escape(input);
  },

  checkId: function(verification_id, db) {
    console.log(verification_id);
    var sql = "SELECT username FROM `user` WHERE `verification_id` = '" + verification_id + "'";
    db.query(sql, function(err, results) {
      if (results.length != 0) {
        verification_id = Math.floor((Math.random() * 100000) + 54);
        return checkId(verification_id, db)
      }
    });
    return verification_id;
  },

  verifyAccount: function(verification_id, recieverEmail) {
    var link = "http://52.53.155.198:3001/users/verifyUser?verification_id=" + verification_id;
    mailOptions={
      from: "projectulist@gmail.com",
      to : recieverEmail,
      subject : "Please confirm your UMail account for UList",
      html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    // console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if(error) {
        console.log(error);
        throw "Could not verify email";
      } else {
        console.log("Message sent: " + response.message);
      }
    });
  }
};
