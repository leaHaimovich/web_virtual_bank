var createError = require('http-errors');
var express = require('express');
const app = express()
var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');
const port = 4000
//var a = require('./routes/clientRout');
var clientRouter = require('./routes/clientRout');
var managerRouter = require('./routes/managerRout');
var indexRouter = require('./routes/index');
var loansRouter = require('./routes/loansRout');
var levcoinRouter = require('./routes/levCoinsRouter');
var transfersRouter = require('./routes/transfersRouter');
var chatRouter = require('./routes/chatRouter');
//const Client_ = require('./routes')("Client");
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(logger('dev'));
//app.use(express.json());
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use('/client', clientRouter);
app.use('/manager', managerRouter);
app.use('/',indexRouter);
app.use('/loan', loansRouter);
app.use('/levcoin',levcoinRouter );
app.use('/transfers',transfersRouter );
app.use('/chat',chatRouter);
require("./mongoConnection");
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
//
const { setTimeout } = require('timers');
var flag = true;
app.set('view engine', 'ejs')
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/home.html'))
});
app.use(express.static(path.join(__dirname, 'public')));
app.get("/webScraping.js", function (req, res) {
  res.sendFile(__dirname + '/webScraping.js');
});





  