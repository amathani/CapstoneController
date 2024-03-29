var express      = require('express');
var router       = express.Router();
var functions = require('./functions');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
  Sign up a user using the provided information. Also performs an email validation and checks for correctness of the inputs
*/
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
  var verification_id = Math.floor((Math.random() * 100000) + 54);
  verification_id = functions.checkId(verification_id, db);

  var sql = "";
  try {
    sql      = "INSERT INTO `user`(`username`,`password`,`fullname`,`email`, `umail`, `uni_id`, `verification_id`) VALUES ("
    + functions.escape(username) + "," + functions.escape(password) + "," + functions.escape(fullname)
    + "," + functions.escape(email) + "," + functions.escape(umail) + "," + functions.escape(uni_id) + "," + functions.escape(verification_id) + ")";
  } catch(error) {
    return res.status(440).json({
      message: error
    });
  }
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      message = "Account Already Exists";
      // console.log(err);
      return res.status(400).json({
        "message" : message
      });
    }
    message    = "Your account has been created.";
    functions.verifyAccount(verification_id, umail);
    return res.status(200).json({
      "message:" : message
    });
  });
});

// Logs in a user and sets up the session variables
router.post('/login', function(req, res, next) {
  message        = '';
  var post = req.body;
  console.log(post);
  var username = post.username;
  var password = post.password;
  var sql = "";
  try {
    var sql = "Select username, verified FROM `user` WHERE `username` = " + functions.escape(username)
    + " and `password` = " + functions.escape(password) + "";
  } catch(error) {
    return res.status(440).json({
      message: error
    });
  }
  console.log(sql);
  db.query(sql, function(err, results) {
    if(results.length == 1) {
      if(results[0].verified == 0) {
        message = "User Verification Required";
        return res.status(400).json({
          "user" : username,
          "message" : message
        });
      }
      req.session.username = results[0].username;
      console.log(req.session.username);
      message = "successful";
      console.log(message);
      return res.status(200).json({
        "User" : req.session.username,
        "message" : message
      });
    } else {
      message = "failed";
      return res.status(400).json({
        "user" : username,
        "message" : message
      });
    }
  });

});

/**
  Gets a user profile for the privided username
*/
router.get('/profile', function(req, res, next) {
  var get = req.query;
  var username = "";
  try {
    username = functions.getUserName(get.username, req.session.username);
  } catch(error) {
    return res.status(440).json({
      message: error
    });
  }
  var sql = "";
  try {
    sql      = "SELECT username, fullname, email, umail, image_names FROM `user` WHERE username = " + functions.escape(username);
  } catch(error) {
    return res.status(440).json({
      message: error
    });
  }
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
      message = "Invalid username"
      res.status(400).json({
        message: message
      });
    }
    res.status(200).json(result);
  });
});

router.get('/listings', function(req, res, next) {
  var get = req.query;
  var username = "";
  try {
    username = functions.getUserName(get.username, req.session.username);
  } catch(error) {
    return res.status(440).json({
      message: error
    });
  }

  var sql      = "SELECT * FROM `book` WHERE username = '" + username + "'";
  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
      message = "Invalid Request";
      // console.log(err);
      return res.status(400).json({
        "message" : message
      });
    }
    return res.status(200).json(result);
  });
});

/**
  Destroys the user session and logs out a user
*/
router.get('/logout', function(req, res, next) {
  console.log(req.session.username);
  req.session.destroy(function(err) {
    res.status(200).json({
      message: "Successfully Logged Out!"
    });
  });
});
router.get('/verifyUser', function(req, res) {
  var get = req.query;
  var sql = "";
  try {
    sql = "UPDATE `user` SET `verified` = '1' WHERE `verification_id` = "
    + functions.escape(get.verification_id);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid verification request"
    });
  }

  console.log(sql)
  var query    = db.query(sql, function(err, result) {
    if(err) {
      console.log(err);
      message = "Invalid Request";
      // console.log(err);
      return res.status(400).json({
        "message" : message
      });
    }
    message = "Validation Complete";
    // console.log(err);
    return res.status(400).json({
      "message" : message
    });
  });

});

module.exports   = router;
