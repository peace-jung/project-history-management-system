const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressErrorHandler = require('express-error-handler');
const route = require('./routes/index');
const app = express();

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
app.use(route);

var errorHandler = expressErrorHandler({
  static: {
    '404': './views/404.ejs'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// server open
app.listen(app.get('port'), () => {
  console.log('Server On : ' + app.get('port'));
});