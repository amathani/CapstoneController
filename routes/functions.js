var express = require('express');
sqlString = require('sqlstring');
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
    if (input == null) {
      var message = "missing input";
      throw message;
    }
    return sqlString.escape(input);
  }
};
