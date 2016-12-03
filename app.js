var express = require('express');


var path = require('path');
//var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var helmet = require('helmet');
var Memcached = require('memcached');
var compression = require('compression');
var config = require('./config');
var flash  = require('connect-flash');


var debug = require('debug')('api');
var bunyan = require('bunyan');
var app = express();

global.log = bunyan.createLogger({
  name: 'LS_NODE',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res
  }
});

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, 'public')));

//app.set('view engine', 'swig');
app.set('view engine', 'pug');
app.locals.Sequelize = require("sequelize");
var memcached = new Memcached(config.MEMCACHED);
app.use(function(req, res, next) {
    global.memcached = memcached;
    next();
});


// ==============
// Create passport instance && JWT

//app.set('superSecret', "ThisislucstocksecretKeyforJWT");
var passport = require("passport");
require('./apps/users/passport')(passport); // pass passport for configuration

var session = require('express-session');
var MemcachedStore = require('connect-memcached')(session);

app.use(session({
    secret: 'user_idnetity',
    name : 'user identity',
    resave : false,
    saveUninitialized : false,
    // store : new MemcachedStore({
    //     hosts : [config.MEMCACHED],
    //     secret : 'iloveluckstock.com!@#$%^'
    // }),
    cookie: { secure: true }
    }
));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//module.exports = passport;
global.passport = passport;
app.use(flash()); // use connect-flash for flash messages stored in session
////// ====== END OF PASSPORT

app.use(compression());
app.use(cors());
app.use(helmet());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//app.use(express.static(path.join(__dirname, './client/static')));

// load config
app.set('configuration', config);

app.use(function(req, res, next) {
    res.setHeader('X-Powered-By', 'luckstock');
    next();
});

// extend app for route object mapping
app.map = (a, route) =>{
    route = route || '';
    for (var key in a) {
        if (Array.isArray(a[key])) {
            // get: [function(){ ... }]
            app[key](route, a[key]);
        } else if (typeof a[key] === 'object') {
            // { '/path': { ... }}
            //debug("key : ", key);
            app.map(a[key], route + key);
        } else if (typeof a[key] === 'function') {
            // get: function(){ ... }
            app[key](route, a[key]);
        }
    }
};

// bootstrap api
require('./index')(app);

// DONT REMOVE
//list all routes
// app._router.stack.forEach(function (r) {
// if (r.route && r.route.path) {
// console.log(r.route.path)
// }
// });

module.exports = app;
