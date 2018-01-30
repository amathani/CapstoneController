var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/create/request', function(req, res, next) {
  var post = req.body;
  console.log(post);

  var sql = "INSERT INTO `meetups` (`username_seller`, `username_buyer`, `date`, `location`, `comments`) VALUES ('" + post.username_seller + "','" + "1" +
  "','" + post.username_buyer + "','" + post.date + "','" + post.loc + "','" + post.comments + "')";
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

router.get('/requests', function(req, res, next) {
  var get = req.query;
  console.log(get);
  if (get.meetup_id) {
    var sql = "Select * FROM `meetups` where `meetup_id` = '" + get.meetup_id + "'";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
      }
      // console.log(result);
      if(result.length) {
        res.status(200).json(result[0]);
      }
    });
  } else {
    var sql = "Select * FROM `meetups`";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
      }
      // console.log(result);
      res.status(200).json(result);
    });
  }
});

router.post('/modify', function(req, res, next) {
  var post = req.body;
  console.log(post);
  var sql = ""
  if (post.response == "rejected") {
    sql = "UPDATE `meetups` set accpeted = 'false', pending = 'false'";
  } else {
    sql = "UPDATE `meetups` set accpeted = 'true', pending = 'false'";
  }
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
