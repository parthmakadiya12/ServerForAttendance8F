const express        = require('express');
var path             = require('path');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
var auth             = require('./auth/auth');
var node_routes      = require('./app/routes/node_routes');
var signup           = require('./app/routes/signup');
var dashboard        = require('./app/routes/dashboard');
var emailsend        = require('./app/routes/emailsend');
var index            = require('./app/routes/index');
var db               = require('./db');
var cors             = require('cors');
var authToken        = require('./auth/authToken');
var leave            = require('./app/routes/leave');
const app            = express();
//Just copy paste node_routes,signup whenever you wanted
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
  var whitelist = [
    'http://localhost:8000','http://localhost:4200','http://localhost:5000','http://localhost:3005'
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
    ,optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors()) 
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index);
app.use('/notes', node_routes);
app.use('/signup', signup);
app.use('/dashboard',dashboard);
app.use('/emailsend',emailsend);
app.use('/leave',leave);

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

db.connect('mongodb://localhost:27017/Attendance', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(8000, function() {
      console.log('Listening on port ...8000')
    })
  }
})
  module.exports = app;