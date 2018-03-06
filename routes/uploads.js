var express      = require('express');
var router       = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);
      cb(null, raw.toString('hex') + "-" + Date.now() + path.extname(file.originalname));
    });
  }
});

var upload = multer({ storage: storage })
router.post('/profile', upload.single('avatar'), function(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  if(!req.file) {
    console.log("No File Received");
    message = "No File Received";
    return res.status(400).json({
      message: message
    });
  } else {
    console.log('file received');
    message = "file received"
    var body = req.body;
    var sql = "UPDATE `user` SET `image_names`='" + req.file.path + "' WHERE `username`='" + body.username + "'";
    console.log(sql);

    var result = db.query(sql, function(err, result) {
      if(err) {
        console.log(err)
        message = "Invalid request made";
        res.status(400).json({
          "message" : message
        })
      }
    });
    return res.status(200).json({
      message: message
    });
  }
});

router.post('/product', upload.array('images'), function(req, res, next) {
  console.log(req.body);
  console.log(req.files);
  if(!req.files) {
    console.log("No File Received");
    message = "No File Received";
    return res.status(400).json({
      message: message
    });
  } else {
    for (var keys in req.files) {
      thisFile = req.files[keys];
      console.log(thisFile.originalname);
    }
    console.log('file received');
    message = "file received";
    //Process the product
    var post = req.body;
    console.log(post);
    if(!post.product_id) {
      var sql = "INSERT INTO `product` (`username`, `uni_id`, `price`, `description`, `preferred_payment_method`, `product_photo_id`) VALUES ('"
      + post.username + "','" + "1" + "','" + post.price + "','" + post.desc + "','" + post.payment + "','"
      + "1" + "')";
      console.log(sql);

      var result = db.query(sql, function(err, result) {
        if(err) {
          console.log(err);
          message = "Invalid Product Creation";
          return res.status(400).json({
            message: message
          });
        }
      });
    }
    return res.status(200).json({
      message: message
    });
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports   = router;
