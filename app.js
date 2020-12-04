var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
mongoose.connect('mongodb://localhost/sc' , {useNewUrlParser: true ,useUnifiedTopology: true})
mongoose.set('useCreateIndex', true);
mongoose.connection.once('open' , () => console.log('connect to DB'))
mongoose.connection.on('error' , (error) => console.log(error))
var app = express();
require('./config/passport')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret : 'shopping-cart_?@!',
  saveUninitialized : false , 
  resave : true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/a', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
app.listen(3000 , () => console.log('done'))
module.exports = app;
