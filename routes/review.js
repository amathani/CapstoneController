var express = require('express');
var router = express.Router();
var functions = require('./functions');
/* GET home page. */
router.get('/', function(req, res, next) {
  var get = req.query;
  username = functions.getUserName(get.username, req.session.username, res);
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
  var username = functions.getUserName(post.username, req.session.username, res);
  var sql = "INSERT INTO `user_review` (`username`, `reviewername`, `rating`, `comment`) VALUES ("
  + functions.escape(username, res) + ",'" + functions.escape(post.reviewername, res)
  + "," + functions.escape(post.rating, res) + "," + functions.escape(post.comment, res) + ")";
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
