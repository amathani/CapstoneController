var express = require('express');
var router = express.Router();
var functions = require('./functions');
/* GET home page. */
router.get('/', function(req, res, next) {
  var get = req.query;
  try {
    username = functions.getUserName(post.username, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  var sql = "Select * FROM `user_review` where `username` = '" + username + "'";
  var result    = db.query(sql, function(err, result) {
    if(err) {
      console.log("ERROR\n" + err);
      res.status(400).json({
        message: "Invalid Request"
      });
    }
    res.status(200).json(result);
  });
});
router.post('/', function(req, res, next) {
  var post = req.body;
  try {
    username = functions.getUserName(post.username, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  try {
    var sql = "INSERT INTO `user_review` (`username`, `reviewername`, `rating`, `comment`) VALUES ("
    + functions.escape(username) + ",'" + functions.escape(post.reviewername)
    + "," + functions.escape(post.rating) + "," + functions.escape(post.comment) + ")";
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  console.log(sql);

  var result = db.query(sql, function(err, result) {
    if(err) {
      console.log(err)
      res.status(400).json({
        message: "Error occured while adding review"
      });
    } else {
      res.status(200).json({
        message: "Added review for user"
      });
    }
  });
});
module.exports = router;
