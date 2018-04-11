var express      = require('express');
var router       = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');
var isbn = require('node-isbn');
var quagga = require('quagga').default;
var sqlString = require('sqlstring');

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
    var sql = "UPDATE `user` SET `image_names`='" + req.file.filename + "' WHERE `username`='" + body.username + "'";
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
    var image_paths = "";
    for (var keys in req.files) {
      thisFile = req.files[keys];
      console.log(thisFile.filename);
      image_paths += thisFile.filename + " ";
    }
    console.log('file received');
    message = "file received";

    //Process the product
    var post = req.body;
    console.log(post);
    if(!post.book_id) {
      var sql = "INSERT INTO `book` (`username`, `uni_id`, `price`, `description`, `preferred_payment_method`, `title`, `author`, `isbn`, `image_paths`) VALUES ('"
      + sqlString.escape(post.username) + "','" + "1" + "','" + sqlString.escape(post.price) + "','" + sqlString.escape(post.desc) + "','" + sqlString.escape(post.payment)
      + "','" + sqlString.escape(post.title) + "','" + sqlString.escape(post.author) + "','"
      + sqlString.escape(post.isbn) + "','" + image_paths + "')";
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
    } else {
      var sql = "UPDATE `book` SET `image_paths`='" + image_paths + "' WHERE `book_id`='" + post.book_id + "'";
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
    }
    return res.status(200).json({
      message: message
    });
  }
});

router.post('/getInfo', upload.single('barcode'), function(req, res, next) {
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
    message = "file received";
    var file = {
      name: req.file.filename,
      path: './uploads/'
    };
    var isbn_string = "";
    quagga.decodeSingle({
      src: './uploads/' + req.file.filename,
      numOfWorkers: 0,  // Needs to be 0 when used within node
      inputStream: {
        size: 1920  // restrict input-size to be 800px in width (long-side)
      },
      decoder: {
        readers: ["ean_reader"] // List of active readers
      },
    }, function(result) {
      if(result.codeResult) {
        isbn_string = result.codeResult.code;
        console.log("result", result.codeResult.code);
        isbn.resolve(isbn_string, function(err, book) {
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
      } else {
        console.log("not detected");
      }
    });
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports   = router;
