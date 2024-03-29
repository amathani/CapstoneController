// Handles all the different FAQ requests

var express = require('express');
var router = express.Router();
var functions = require('./functions');

// Creates an FAQ request
router.post('/ask', function(req, res, next) {
  var post = req.body;
  try {
    var username = functions.getUserName(post.asker_username, req.session.username, res);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  try {
    var sql = "INSERT into `faqs` (`asker_username`, `owner_username`, `question`, `product_id`" +
    ") VALUES (" + functions.escape(username) + "," + functions.escape(post.owner_usernames)
    + "," + functions.escape(post.question) + "," + functions.escape(post.product_id) + ")";
  } catch(error) {
    return res.status(440).json({
      message: error
    });
  }
  console.log(sql);

  var result = db.query(sql, function(err, result) {
    if(err) {
      console.log(err)
      message = "Invalid request made";
      res.status(400).json({
        "message" : message
      })
    } else {
      message = "Successfully created faq question";
      // console.log(result);
      res.status(200).json({
        "message" : message
      });
    }
  });
});

// Let's a user answer the FAQ request
router.post('/answer', function(req, res, next) {
  var post = req.body;
  // var username = functions.getUserName(post.username, req.session.username);
  var sql = "UPDATE `faqs` SET `answer` = " + functions.escape(post.answer, res)
  + " WHERE `faq_id` = " + functions.escape(post.faq_id, res);
  console.log(sql);

  var result = db.query(sql, function(err, result) {
    if(err) {
      console.log(err)
      message = "Invalid request made";
      res.status(400).json({
        "message" : message
      })
    } else {
      message = "Successfully created request";
      // console.log(result);
      res.status(200).json({
        "message" : message
      });
    }
  });
});

// Retrieves all of the requests made by a user
router.get('/retrieve', function(req, res, next) {
  var get = req.query;
  if(get.product_id) {
    var sql = "SELECT * FROM `faqs` WHERE `product_id` = '" + get.product_id + "'"
    console.log(sql);

    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
        message = "Invalid request";
        res.status(400).json({
          "message" : message
        });
      } else {
        res.status(200).json(result);
      }
    });
  } else {
    message = "Invalid request";
    res.status(400).json({
      "message" : message
    });
  }
});

module.exports = router;
