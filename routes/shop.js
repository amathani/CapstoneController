var express = require('express');
var router = express.Router();
var isbn = require('node-isbn');
var functions = require('./functions');

// Get a book associated with a given book_id
router.get('/books', function(req, res, next) {
  var get = req.query;
  var category = "book";
  var category_sql = "";
  if (get.category) {
    category = get.category;
  }
  category_sql = " AND `category` = " + functions.escape(category);

  console.log(get);
  if (get.book_id) {
    var sql = "Select * FROM `book` WHERE `book_id` = " + functions.escape(get.book_id, res);
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
  } else if (get.search){
    var range = "";
    if(get.cost_high && get.cost_low) {
      range = " and `price` BETWEEN '"+ get.cost_low + "' and '"+ get.cost_high + "'";
    }
    var order_by = "";
    if(get.order_by == "ASC") {
      order_by = " ORDER BY `price` ASC"
    } else if(get.order_by == "DESC") {
      order_by = " ORDER BY `price` DESC"
    }
    var sql = "SELECT * FROM `book` WHERE MATCH (title,description,author) AGAINST ('" + get.search + "' IN NATURAL LANGUAGE MODE)"
    + category_sql + range + order_by;
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
      }
      // console.log(result);
      res.status(200).json(result);
    });

  } else {
    var range = "";

    category_sql = " WHERE `category` = " + functions.escape(category);
    if(get.cost_high && get.cost_low) {
      range = " AND `price` BETWEEN '" + get.cost_low  +"' and '" + get.cost_high + "'";
    }

    var order_by = "";
    if(get.order_by == "ASC") {
      order_by = " ORDER BY `price` ASC"
    } else if(get.order_by == "DESC") {
      order_by = " ORDER BY `price` DESC"
    }

    var sql = "Select * FROM `book`" + category_sql + range + order_by;
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

// List a book for sale this is a depricated method only for items put to sale without any images
router.post('/books/list', function(req, res, next) {
  var post = req.body;
  var username = "";
  try {
    username = functions.getUserName(post.username, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  try {
    var sql = "INSERT INTO `book` (`username`, `uni_id`, `price`, `description`, `preferred_payment_method`, `title`, `author`, `isbn`) VALUES ("
    + functions.escape(username) + ",'" + "1" + "'," + functions.escape(post.price) + ","
    + functions.escape(post.desc) + "," + functions.escape(post.payment)
    + "," + functions.escape(post.title) + "," + functions.escape(post.author) + ","
    + functions.escape(post.isbn) + ")";
  } catch (error) {
    return res.status(400).json({
      message: error
    });
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

// Get information regarding a given ISBN number, this has an improved version of using a barcode image instead
router.get('/getInfo', function(req, res, next) {
  var get = req.query;
  if(!get.isbn) {
    message = "No ISBN found";
    return res.status(400).json({
      message: message
    });
  }
  isbn.resolve(get.isbn, function(err, book) {
    if(err) {
      message = "Invalid ISBN/Book not found";
      return res.status(400).json({
        message: message
      });
    } else {
      return res.status(200).json(book);
    }
  });
});

// Search suggestions for items to be searched for
router.get('/books/ajax', function(req, res, next) {

  var get = req.query;
  var category = "book";
  var category_sql = "";
  if (get.category) {
    category = get.category;
  }
  category_sql = " AND `category` = " + functions.escape(category);

  // console.log(get);
  var sql = "Select `title` FROM `book` WHERE `title` LIKE '%" + get.search + "%'" + category_sql;
  console.log(sql);
  var result    = db.query(sql, function(err, result) {
    if(err) {
      console.log("ERROR\n" + err);
      message = "Invalid Request";
      return res.status(400).json({
        message: message
      });
    }
    var data=[];
    // console.log(result);
    for(i=0; i<result.length; i++) {
      data.push(result[i].title);
    }
    res.status(200).json(data);
  });
});

// Maintains a list of items the user has marked to be interested in
router.get('/bookmarks', function(req, res, next) {
  var get = req.query;
  var username = "";
  try {
    username = functions.getUserName(get.username, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  var sql = "Select `book_id` FROM `bookmarks` WHERE `username` = '" + username + "'";
  console.log(sql);
  var result    = db.query(sql, function(err, result) {
    if(err) {
      console.log("ERROR\n" + err);
      message = "Invalid Request";
      return res.status(400).json({
        message: message
      });
    }
    res.status(200).json(result);
  });
});

router.post('/bookmarks', function(req, res, next) {
  var post = req.body;
  console.log(post);
  try {
    username = functions.getUserName(post.username, req.session.username);
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }
  var sql = "";
  try {
    sql = "INSERT INTO `bookmarks` (`book_id`, `username`) VALUES (" + functions.escape(post.book_id) + "," + functions.escape(username) + ")";
  } catch (error) {
    return res.status(440).json({
      message: error
    });
  }

  var query    = db.query(sql, function(err, result) {
    if(err) {
      message = "Bookmark Already Exists";
      // console.log(err);
      return res.status(400).json({
        "message" : message
      });
    }
    message    = "Added bookmark";
    return res.status(200).json({
      "message:" : message
    });
  });

});

module.exports = router;
