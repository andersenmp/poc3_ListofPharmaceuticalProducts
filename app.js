var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var csrf = require('csurf');




//Sequelize ORM
const  Sequelize = require('sequelize');

const  sequelize = new Sequelize('mainDB', null, null, {
    dialect: "sqlite",
    storage: './database.sqlite',
});

sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

//Handelbars Template Language
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
app.use( session({
    key: 'user_sid',
    secret            : 'super secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use(csrf());


var userRegistration = function (req, res, next) {

    if(req.session.cas_user && !req.session.logged){
        var  db = require('./models');
        var User = db.User;

        User.findOne({ where:{username:req.session.cas_user}})
            .then(function (user) {
                if (!user) {
                    User.create(
                        {
                            username:req.session.cas_user,
                            firstName: req.session.cas_user,
                            lastName: 'Not in Sentry',
                            email: 'email@not.registred.com',
                        }
                    ).then(function (user){
                        req.session.user = user.dataValues;
                    })
                 }else{
                    req.session.user = user.dataValues;
                }
            });


            req.session.logged = true
    }
    next()
}


app.use(userRegistration)

var propagateSession = function (req, res, next) {
    res.locals.session = req.session;
    next();
}

app.use(propagateSession)


var testSession = function (req, res, next) {

    var SentryUtils = require('./Library/SentryUtils')

    if(req.session.cas_user) {
        var sentry = new SentryUtils(req.session.cas_user)
        sentry.hasAccessToFeature('/ADMINISTRATOR').then(function(x) {
            console.log('hasAccessToFeature');
            console.log(x)
        })
    }
    next();
}

app.use(testSession)




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
