var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//

var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sess = {
  secret: 'nyandog',
  store: new MongoStore({
    url: 'mongodb://db/test',
    autoRemove: 'native'
  }),
  cookie: {
    secure: true
    //,maxAge: 300000
  }
};

//

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression()); // enable gzip
app.use(helmet()); // security measures
app.use(session(sess)); // set up session with reverse proxy support and secure cookie
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//// cache control
//app.use('/stylesheets', express.static(path.join(__dirname, 'public', 'stylesheets'), {
//  maxAge: 60000
//}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
