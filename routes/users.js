var express      = require('express');
var router       = express.Router();
var functions = require('./functions');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  message        = '';
  console.log("Signing up user");
  var post     = req.body;
  console.log(post);
  var username = post.username;
  var password = post.password;
  var fullname = post.fullname;
  var email    = post.email;
  var umail    = post.umail;
  var uni_id   = 1;
  var sql      = "INSERT INTO `user`(`username`,`password`,`fullname`,`email`, `umail`, `uni_id`) VALUES ("
  + functions.escape(username) + "," + functions.escape(password) + "," + functions.escape(fullname)
  + "," + functions.escape(email) + "," + functions.escape(umail) + "," + functions.escape(uni_id) + ")";
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
      res.status
    }
    message    = "Your account has been created.";
    res.status(200).json({
      "message:" : message
    });
  });
});

router.post('/login', function(req, res, next) {
  message        = '';
  var post = req.body;
  var username = post.username;
  var password = post.password;

  var sql = "Select username FROM `user` WHERE `username` = " + functions.escape(username, res)
  + "' and `password` = " + functions.escape(password, res) + "";
  console.log(query);
  db.query(sql, function(err, results) {
    if(results.length == 1) {
      req.session.username = results[0].username;
      console.log(req.session.username);
      message = "successful";
      console.log(message);
      res.status(200).json({
        "User" : req.session.username,
        "message" : message
      });
    } else {
      message = "failed";
      res.status(400).json({
        "user" : username,
        "message" : message
      });
    }
  });

});

router.post('/profile', function(req, res, next) {
  message        = '';

});

router.get('/profile', function(req, res, next) {
  username = functions.getUserName(get.username, req.session.username);
  var get = req.query;
  var sql      = "SELECT * FROM `user` WHERE username = '" + get.username + "'";
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
      res.status(400);
    }
    res.status(200).json(result);
  });
});

router.get('/listings', function(req, res, next) {
  var get = req.query;
  var sql      = "SELECT * FROM `book` WHERE username = '" + get.username + "'";
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/logout', function(req, res, next) {
  console.log(req.session.username);
  req.session.destroy(function(err) {
    res.status(200).json("Successfully Logged Out!")
  });

});

module.exports   = router;
