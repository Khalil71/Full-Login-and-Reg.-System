//requiring the mondules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var loaclStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
//setting up the connection to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;


// setting up the routes
var routes = require('./routes/index');
var users = require('./routes/users');
// initalizing the express app
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set the public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport initalizing
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect-flash middleware
app.use(flash());

//Global Vars
app.use(function(req, res, next){
  res.locals.sucess_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



//middleware for route files
app.use('/', routes);
app.use('/users', users);

//Listen to port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log("listining to port " + app.get('port'));
});
