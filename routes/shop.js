var express = require('express');
var router = express.Router();

router.get('/books', function(req, res, next) {
  var get = req.query;
  console.log(get);
  if (get.book_id) {
    var sql = "Select * FROM `book` where `book_id` = '" + get.book_id + "'";
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
    var sql = "SELECT * FROM `book` WHERE MATCH (title,description,author) AGAINST ('" + get.search + "' IN NATURAL LANGUAGE MODE)"
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
      }
      // console.log(result);
      res.status(200).json(result);
    });

  } else {
    var sql = "Select * FROM `book`";
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

router.post('/books/list', function(req, res, next) {
  var post = req.body;
  console.log(post);

  var sql = "INSERT INTO `book` (`username`, `uni_id`, `price`, `description`, `preferred_payment_method`, `title`, `author`, `isbn`) VALUES ('"
  + post.username + "','" + "1" + "','" + post.price + "','" + post.desc + "','" + post.payment
  + "','" + post.title + "','" + post.author + "','"
  + post.isbn + "')";
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

router.get('/products', function(req, res, next) {
  var get = req.query;
  console.log(get);
  if (get.prod_id) {

    var sql = "Select * FROM `book` where `product` = '" + get.prod_id + "'";
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
    var sql = "SELECT * FROM `product` WHERE MATCH (title,description) AGAINST ('" + get.search + "' IN NATURAL LANGUAGE MODE)"
    console.log(sql);
    var result    = db.query(sql, function(err, result) {
      if(err) {
        console.log("ERROR\n" + err);
      }
      // console.log(result);
      res.status(200).json(result);
    });
  } else {
    var sql = "Select * FROM `product`";
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

router.post('/products/list', function(req, res, next) {
  var post = req.body;
  console.log(post);

  var sql = "INSERT INTO `product` (`username`, `uni_id`, `price`, `description`, `preferred_payment_method`, `product_photo_id`) VALUES ('" + post.username + "','" + "1" + "','" + post.price + "','" + post.desc + "','" + post.payment + "','"
  + "1" + "')";
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
