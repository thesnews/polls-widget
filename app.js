
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    swig = require('swig'),
    conf = require('./config'),
    mongoose = require('mongoose');

var app = express();

app.engine('html', cons.swig);
swig.init({
    root: __dirname + '/views',
    autoescape: false,
    cache: (function() {
        if( process.env.NODE_ENV == 'production' ) {
            return true;
        }
        return false;
    })()
});

app.configure(function(){
    app.set('port', conf.port || process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.my = {};
app.my.app_path = __dirname;

mongoose.connect('mongodb://localhost/lobo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

require('./routes/index')(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
