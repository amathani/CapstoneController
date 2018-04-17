var express = require('express');
sqlString = require('sqlstring');
module.exports = {
  getUserName: function(body_username, sessions_username, res) {
    if (body_username == null && sessions_username == null) {
      var message = "Session Time-out";
      return res.status(440).json({
        message: message
      });
    } else {
      return body_username == null ? sessions_username : body_username;
    }
  },
  escape: function(input, res) {
    if (input == null) {
      var message = "missing input";
      return res.status(400).json({
        message: message
      });
    }
    return sqlString.escape(input);
  }
};
