const express = require('express');
const http = require('http');
const csrf = require('csurf');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const getQRCode = require('./handlers/qrcode');
const installer = require('./handlers/installer');
const home = require('./handlers/home');
const jumping = require('./handlers/jumping');
const cadpreview = require('./handlers/cadpreview');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.options('*', cors());

const server = http.createServer(app);

app
    .get('/qrcode', getQRCode)
    .get('/installer/:package', installer)
    .get('/home/:view', home)
    .get('/jumping/', jumping)
    .get('/cadpreview', cadpreview)

server.timeout = 0;
server.listen(10080);