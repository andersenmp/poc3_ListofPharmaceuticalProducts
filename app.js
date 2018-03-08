var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var exphbs = require('express-handlebars');
var hbsHelpers = require('handlebars-helpers')


var index = require('./routes/index');
var ListofPharmaceuticalProducts = require('./routes/ListofPharmaceuticalProducts');

var app = express();


var hbs = exphbs.create({
    extname: ".handlebars",
    layoutsDir: path.join(__dirname, "views/layouts/"),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main.handlebars',
    helpers: {
        block: function(name){
            var blocks = this._blocks;
            content = blocks && blocks[name];
            return content ? content.join('\n') : null;
        },
        contentFor: function(name, options){
            var blocks = this._blocks || (this._blocks = {});
            block = blocks[name] || (blocks[name] = []); //Changed this to [] instead of {}
            block.push(options.fn(this));
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/ListofPharmaceuticalProducts', ListofPharmaceuticalProducts);

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
