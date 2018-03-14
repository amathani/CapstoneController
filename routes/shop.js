var express = require('express');
var router = express.Router();
var isbn = require('node-isbn');

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
    var sql = "SELECT * FROM `book` WHERE MATCH (title,description,author) AGAINST ('" + get.search + "' IN NATURAL LANGUAGE MODE)" + range + order_by;
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
    if(get.cost_high && get.cost_low) {
      range = " WHERE `price` BETWEEN '" + get.cost_low  +"' and '" + get.cost_high + "'";
    }

    var order_by = "";
    if(get.order_by == "ASC") {
      order_by = " ORDER BY `price` ASC"
    } else if(get.order_by == "DESC") {
      order_by = " ORDER BY `price` DESC"
    }

    var sql = "Select * FROM `book`" + range + order_by;
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
      console.log()
      message = "Invalid ISBN/Book not found";
      return res.status(400).json({
        message: message
      });
    } else {
      return res.status(200).json(book);
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
    var range = "";
    if(get.cost_high && get.cost_low) {
      range = " and `price` BETWEEN '"+ get.cost_low + "' and '"+ get.cost_high + "'";
    }
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
    var range = "";
    if(get.cost_high && get.cost_low) {
      range = " WHERE `price` BETWEEN '" + get.cost_low  +"' and '" + get.cost_high + "'";
    }
    var sql = "Select * FROM `product`" + range;
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

router.get('/books/ajax', function(req, res, next) {
  var get = req.query;
  console.log(get);
  var sql = "Select `title` FROM `book` WHERE `title` LIKE '%" + get.search + "%'";
  console.log(sql);
  var result    = db.query(sql, function(err, result) {
    if(err) {
      console.log("ERROR\n" + err);
    }
    var data=[];
    // console.log(result);
    for(i=0; i<result.length; i++) {
      data.push(result[i].title);
    }
    res.status(200).json(data);
  });
});

module.exports = router;
