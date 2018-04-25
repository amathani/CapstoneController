// Manages all of the transactions for a given product

var express = require('express');
var router = express.Router();
var functions = require('./functions');

// Call to sell a product
router.post('/buyProduct', function(req, res, next) {
  var post = req.body;
  var username = "";
  var sql_requests = "";
  var sql_faq = "";
  var sql_bookmarks = "";
  var sql_book = "";
  try {
    username = functions.getUserName(post.username, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  try {
    sql_requests = "DELETE FROM `meetups` WHERE product_id = " + functions.escape(post.book_id);
    sql_faq = "DELETE FROM `faqs` WHERE product_id = " + functions.escape(post.book_id);
    sql_bookmarks = "DELETE FROM `bookmarks` WHERE book_id = " + functions.escape(post.book_id);
    sql_book = "DELETE FROM `book` WHERE book_id = " + functions.escape(post.book_id);
  } catch(error) {
    return res.status(400).json({
      message: error
    });
  }
  var result = db.query(sql_requests, function(err, result) {
    if(err) {
      console.log(err);
      message = "Invalid request made";
      return res.status(400).json({
        "message" : message
      });
    }
  });

  var result = db.query(sql_faq, function(err, result) {
    if(err) {
      console.log(err);
      message = "Invalid request made";
      return res.status(400).json({
        "message" : message
      });
    }
  });

  var result = db.query(sql_bookmarks, function(err, result) {
    if(err) {
      console.log(err);
      message = "Invalid request made";
      return res.status(400).json({
        "message" : message
      });
    }
  });

  var result = db.query(sql_requests, function(err, result) {
    if(err) {
      console.log(err);
      message = "Invalid request made";
      return res.status(400).json({
        "message" : message
      });
    }
  });

  var result = db.query(sql_book, function(err, result) {
    if(err) {
      console.log(err)
      message = "Invalid request made";
      res.status(400).json({
        "message" : message
      });
    } else {
      message = "Purchase Completed";
      // console.log(result);
      return res.status(200).json({
        "message" : message
      });
    }
  });
});

// Get the most common meeting points
router.get('/locations', function(req, res, next) {
  var get = req.query;
  var sql      = "SELECT * FROM `meetups_location`";
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
      message = "invalid request";
      return res.status(400).json({
        "message" : message
      });
    }
    res.status(200).json(result);
  });
});

// Create a request for a product
router.post('/create/request', function(req, res, next) {
  var post = req.body;
  console.log(post);
  var username = "";
  try {
    username = functions.getUserName(post.username_buyer, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  var sql = "INSERT INTO `meetups` (`username_seller`, `username_buyer`, `date`, `comments`, `product_id`, `longitude`, `latitude`) VALUES ("
  + functions.escape(post.username_seller) + "," + functions.escape(username) + "," + functions.escape(post.date)
  + "," + functions.escape(post.comments) + "," + functions.escape(post.product_id)
  + "," + functions.escape(post.longitude) + "," + functions.escape(post.latitude) + ")";
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

// Modify an existing request thorugh change in status/change in seller's condition
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

// Get all the requests associated with a user and his items being sold.
router.get('/requests', function(req, res, next) {
  var get = req.query;

  var username = "";
  try {
    username = functions.getUserName(get.username_buyer, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }

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
