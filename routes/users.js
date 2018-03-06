var express      = require('express');
var router       = express.Router();

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
  var sql      = "INSERT INTO `user`(`username`,`password`,`fullname`,`email`, `umail`, `uni_id`) VALUES ('" + username + "','" + password + "','" + fullname + "','" + email + "','" + umail + "','" + uni_id + "')";
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
    }
    message    = "Your account has been created.";
    res.status(200).json(message);
  });
});

router.post('/login', function(req, res, next) {
  message        = '';
  var post = req.body;
  console.log(post);
  var username = post.username;
  var password = post.password;

  var query = "Select username FROM `user` WHERE `username` = '" + username + "' and `password` = '" + password + "'";
  console.log(query);
  db.query(query, function(err, results) {
    if(results.length == 1) {
      req.session.username = results[0].username;
      console.log(results[0].username);
      message = "successful";
      console.log(message);
      res.status(200).json({
        "User" : req.session.username,
        "Message" : message
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
