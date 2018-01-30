var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var get = req.query;
  if (get.username && get.reviewername) {
    var sql = "Select * FROM `user_review` where `username` = '" + get.username + "' and `reviewername` = '" + get.reviewername + "'";
    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
      }
      // console.log(result);
      if(result.length) {
        res.status(200).json(result);
      }
    });
  }
});
router.post('/', function(req, res, next) {
  var post = req.body;
  console.log(post);

  var sql = "INSERT INTO `book` (`username`, `reviewername`, `rating`, `comment`) VALUES ('" + post.username + "','" + "1" + "','" + post.reviewername + "','" + post.rating + "','" + post.comment + "')";
  console.log(sql);

  var result = db.query(sql, function(err, result) {
    if(err) {
      console.log(err)
    } else {
      // console.log(result);
      res.status(200).json(JSON.stringify(result));
    }
  });
});
module.exports = router;
