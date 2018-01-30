var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes')
var http = require('http')
var path = require('path');
var session = require('express-session')

var index = require('./routes/index');
var users = require('./routes/users');
var shop = require('./routes/shop')
var review = require('./routes/review')
var transactions = require('./routes/transactions')

var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
              host     : 'ulistinstance.cocp2o6qdzv5.us-west-1.rds.amazonaws.com',
              user     : 'root',
              password : 'mypassword',
              database : 'ulistdb'
            });

connection.connect();

global.db = connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }));

app.use('/', index);
app.use('/users', users);
app.use('/shop', shop)
app.use('/review', review)
app.use('/transactions', transactions)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
