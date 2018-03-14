var express      = require('express');
var router       = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');
var isbn = require('node-isbn');

var imageToTextDecoder = require('image-to-text');

 var key = '2SrmhTT5yQ8VnnOeZiNdQw'; //Your key registered from cloudsightapi @ https://cloudsightapi.com
 imageToTextDecoder.setAuth(key);

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
      + post.username + "','" + "1" + "','" + post.price + "','" + post.desc + "','" + post.payment
      + "','" + post.title + "','" + post.author + "','"
      + post.isbn + "','" + image_paths + "')";
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
    imageToTextDecoder.getKeywordsForImage(file).then(function(keywords, error) {
      if(error) {
        res.status(400).json({
          message: "File Parsing Error"
        });
      } else {
        console.log(keywords);
        keywords.trim();
        words = keywords.split(" ");
        var index = words.indexOf("barcode");
        var isbn_string = "";
        console.log(words);
        for (i = 0; i < words.length; i++) {
          if (!isNaN(words[i]) && words[i].length != 0) {
            isbn_string = words[i]
            break;
          }
        }
        if(isbn_string.lenght == 0) {
          res.status(400).json({
            message: "Invalid ISBN"
          });
        }
        console.log(isbn_string);
        isbn.resolve(isbn_string, function(err, book) {
          if(err) {
            console.log()
            message = "Invalid ISBN/Book not found";
            return res.status(400).json({
              message: message
            });
          } else {
            return res.status(400).json(book);
          }
        });
      }
    });
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports   = router;
