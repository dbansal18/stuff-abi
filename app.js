var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var cookieSession = require('cookie-session');
var passportSetup = require('./config/passport');
var db = require('./db');
var mongoose = require('mongoose');
var keys = require('./config/keys');

// Create a new Express application.
var app = express();

// set up session cookies
app.use(cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'devil is dbansal', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
	console.log('listning on port 3000');
    console.log('connected to mongodb');
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactsRouter = require('./routes/contacts');
var customerCareRouter = require('./routes/customerCare');
var adminLoginRouter = require('./routes/login');
var addproductRouter = require('./routes/addProducts');
var productsRoutes = require('./routes/products-routes');
var editProductRoutes = require('./routes/editProduct-routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contactUs', contactsRouter);
app.use('/customerCare', customerCareRouter);
app.use('/adminLogin', adminLoginRouter);
app.use('/addproduct',(req,res,next)=>{s
	if(!req.user){
		res.redirect('/');
	}
	next();
},addproductRouter);
app.use('/products', productsRoutes);
app.use('/edit',(req,res,next)=>{
  if(!req.user){
    res.redirect('/');
  }
  next();
}, editProductRoutes);

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

module.exports = app;
