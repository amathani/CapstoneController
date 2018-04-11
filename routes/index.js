var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testSessions', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times " + req.session.username);
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time! " + req.session.username);
   }
});

module.exports = router;
