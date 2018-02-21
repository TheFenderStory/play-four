'use strict';
/**
 * server
 * @author Jared Grady
 * @license MIT license
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const compression = require('compression');
const helmet = require('helmet');
const chalk = require('chalk');
const winston = require('winston');
const RoomList = require('./src/roomlist.js');
const port = process.env.PORT || 3000;

/* Set up express middleware before launch */
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.use(compression());
app.use(helmet({noSniff: false}));
app.use(express.static(__dirname + '/public'));

/* Set up our routes */
app.use('/', require('./src/router'));

/* Set up our sockets */
const io = require('socket.io')(http);
require('./src/sockets')(io);

/* Set up our globals */
global.rooms = new RoomList();

/* Finally, start listening */
http.listen(port, error => {
	if (error) winston.error(error);
	winston.info("Now listening on port " + chalk.green(port));
});
