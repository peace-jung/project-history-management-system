const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const expressErrorHandler = require('express-error-handler');

const get_router = require('./routes/get_router');
const post_router = require('./routes/post_router');
const mysqlConnection = require('./routes/mysqlConnection')();

connection = mysqlConnection.init(); //전역객체 선언
mysqlConnection.open();

app.set('views');
app.set('view engine', 'ejs');
app.set('port', 5301);

app.use(express.static('public'));
app.use(express.static('bootstrap'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'sdlkfs987SDfj9872ASdfh',
  resave: true,
  saveUninitialized: true
}));

app.use(get_router);
app.use(post_router);

var errorHandler = expressErrorHandler({
  static: {
    '404': './views/404.ejs'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

user = {
  id: "undefined",
  name: "undefined",
  major: "undefined",
  user_type: "undefined"
};

// server open
app.listen(app.get('port'), () => {
  console.log('Server On : ' + app.get('port'));
});