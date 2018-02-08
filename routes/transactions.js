var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/create/request', function(req, res, next) {
  var post = req.body;
  console.log(post);

  var sql = "INSERT INTO `meetups` (`username_seller`, `username_buyer`, `date`, `location`, `comments`) VALUES ('" + post.username_seller + "','" + "1" +
  "','" + post.username_buyer + "','" + post.date + "','" + post.loc + "','" + post.comments + "','" + post.product_id +"')";
  console.log(sql);

  var result = db.query(sql, function(err, result) {
    if(err) {
      console.log(err)
      message = "Invalid request made"
      res.status(400).json({
        "message" : message
      })
    } else {
      message = "Successfully created request"
      // console.log(result);
      res.status(200).json({
        "message" : message
      });
    }
  });
});

router.post('/request', function(req, res, next) {
  var post = req.body;
  console.log(post);
  if(!post.meetup_id) {
    message = "No meetup_id provided";
    res.status(400).json({
      "message" : message
    });
  }
  var sql = "";
  if(post.seller_ready) {
    sql = "UPDATE `meetups` SET `seller_ready` = '1' where `meetup_id` = '" + post.meetup_id + "'";
  } else if(post.buyer_ready) {
    sql = "UPDATE `meetups` SET `buyer_ready` = '1' where `meetup_id` = '" + post.meetup_id + "'";
  } else if(post.accepted) {
    if(post.accepted == "true") {
      sql = "UPDATE `meetups` SET `accpeted` = '1', `pending` = '0' where `meetup_id` = '" + post.meetup_id + "'"
    } else {
      sql = "UPDATE `meetups` SET `accpeted` = '0', `pending` = '0' where `meetup_id` = '" + post.meetup_id + "'"
    }
  } else {
    message = "Invalid POST request";
    res.status(400).json({
      "message" : message
    });
  }
  console.log(sql);

  var result = db.query(sql, function(err, result) {
    if(err) {
      console.log(err)
      message = "Invalid request made"
      res.status(400).json({
        "message" : message
      })
    } else {
      message = "Successfully created request"
      // console.log(result);
      res.status(200).json({
        "message" : message
      });
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
  } else if (get.username_seller) {
    var sql = "Select * FROM `meetups` where `username_seller` = '" + get.username_seller + "'";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        message = "Incorrect Info"
        console.log("ERROR\n" + err);
        res.status(400).json({
          "message" : message
        });
      }
      if(result.length) {
        res.status(200).json(result[0]);
      }
    });
  } else if (get.username_buyer) {
    var sql = "Select * FROM `meetups` where `username_buyer` = '" + get.username_buyer + "'";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        message = "Incorrect Info"
        console.log("ERROR\n" + err);
        res.status(400).json({
          "message" : message
        });
      }
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
