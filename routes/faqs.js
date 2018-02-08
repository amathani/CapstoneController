var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/ask', function(req, res, next) {
  var post = req.body;
  var sql = "INSERT into `faqs` (`asker_usernames`, `owner_usernames`, `question`, `product_id`" +
  " VALUES ('" + post.asker_usernames + post.owner_usernames + post.question + post.product_id;
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

router.post('/answer', function(req, res, next) {
  var post = req.body;
  var sql = "UPDATE `faqs` SET `answer` = '" + post.answer + "' WHERE `faq_id` = '" + post.faq_id + "'";
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

router.post('/retrieve', function(req, res, next) {
  var post = req.body;
  var sql = "SELECT * FROM `faq` WHERE `owner_usernames` = " + post.username + " and `answer` IS NULL"
  console.log(sql);

  var result    = db.query(sql, function(err, result) {
    if(err) {
      console.log("ERROR\n" + err);
      res.status(400);
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
