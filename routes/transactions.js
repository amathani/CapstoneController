var express = require('express');
var router = express.Router();
var functions = require('./functions');

router.get('/locations', function(req, res, next) {
  var get = req.query;
  var sql      = "SELECT * FROM `meetups_location`";
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
      message = "invalid request";
      res.status(400).json({
        "message" : message
      })
    }
    res.status(200).json(result);
  });
});

router.post('/create/request', function(req, res, next) {
  var post = req.body;
  console.log(post);
  username = functions.getUserName(post.username_buyer, req.session.username);
  var sql = "INSERT INTO `meetups` (`username_seller`, `username_buyer`, `date`, `comments`, `product_id`, `longitude`, `latitude`) VALUES ("
  + fucntions.escape(post.username_seller, res) + "," + fucntions.escape(username, res) + "," + fucntions.escape(post.date, res)
  + "," + fucntions.escape(post.comments, res) + "," + fucntions.escape(post.product_id, res)
  + "," + fucntions.escape(post.longitude, res) + "," + fucntions.escape(post.latitude, res) + ")";
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

router.post('/requests', function(req, res, next) {
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
    if(post.seller_ready == "true") {
      sql = "UPDATE `meetups` SET `seller_ready` = '1' where `meetup_id` = '" + post.meetup_id + "'";
    } else {
      sql = "UPDATE `meetups` SET `seller_ready` = '0' where `meetup_id` = '" + post.meetup_id + "'";
    }
  } else if(post.buyer_ready) {
    if(post.buyer_ready == "true") {
      sql = "UPDATE `meetups` SET `buyer_ready` = '1' where `meetup_id` = '" + post.meetup_id + "'";
    } else {
      sql = "UPDATE `meetups` SET `buyer_ready` = '0' where `meetup_id` = '" + post.meetup_id + "'";
    }
  } else if(post.accepted) {
    if(post.accepted == "true") {
      sql = "UPDATE `meetups` SET `accepted` = '1', `pending` = '0' where `meetup_id` = '" + post.meetup_id + "'"
    } else {
      sql = "UPDATE `meetups` SET `accepted` = '0', `pending` = '0' where `meetup_id` = '" + post.meetup_id + "'"
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
      message = "Invalid request made";
      res.status(400).json({
        "message" : message
      })
    } else {
      message = "Successfully modified request";
      // console.log(result);
      res.status(200).json({
        "message" : message
      });
    }
  });
});

router.get('/requests', function(req, res, next) {
  var get = req.query;
  username = functions.getUserName(get.username_buyer, req.session.username);
  console.log(get);
  if (get.meetup_id) {
    var sql = "SELECT `meetup_id`, `username_seller`, `username_buyer`, `seller_ready`, `buyer_ready`, `date`, `accepted`, `comments`, `pending`, `product_id`," +
     " `longitude`, `latitude`, `title` FROM `meetups`, `book` WHERE book.book_id = meetups.product_id and meetups.meetup_id = '" + get.meetup_id + "'";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
      }
      // console.log(result);
      res.status(200).json(result);
    });
  } else if (get.username_seller) {
    var sql = "SELECT meetup_id, username_seller, username_buyer, seller_ready, buyer_ready, date, accepted, comments, pending, product_id," +
     " `longitude`, `latitude`, `title` FROM `meetups`, `book` WHERE book.book_id = meetups.product_id and meetups.username_seller = '" + get.username_seller + "'";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        message = "Incorrect Info";
        console.log("ERROR\n" + err);
        res.status(400).json({
          "message" : message
        });
      }

      res.status(200).json(result);
    });
  } else if(get.book_id) {
    var sql = "SELECT meetup_id, username_seller, username_buyer, seller_ready, buyer_ready, date, accepted, comments, pending, product_id," +
     " `longitude`, `latitude`, `title` FROM `meetups`, `book` WHERE book.book_id = meetups.product_id and meetups.product_id = '" + get.book_id + "'";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        message = "Incorrect Info";
        console.log("ERROR\n" + err);
        res.status(400).json({
          "message" : message
        });
      }
      res.status(200).json(result);
    });
  } else if (username) {
    var sql = "SELECT meetup_id, username_seller, username_buyer, seller_ready, buyer_ready, date, accepted, comments, pending, product_id," +
     " `longitude`, `latitude`, `title` FROM `meetups`, `book` WHERE book.book_id = meetups.product_id and meetups.username_buyer = '" + username + "'";
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        message = "Incorrect Info";
        console.log("ERROR\n" + err);
        res.status(400).json({
          "message" : message
        });
      }
      res.status(200).json(result);
    });
  } else {
    var sql = "SELECT meetup_id, username_seller, username_buyer, seller_ready, buyer_ready, date, accepted, comments, pending, product_id," +
     " `longitude`, `latitude`, `title` FROM `meetups`, `book` WHERE book.book_id = meetups.product_id";
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

module.exports = router;
