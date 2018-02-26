'use strict';
/**
 * sockets
 * @author Jared Grady
 * @license MIT license
 */

const parser = require('./chat-parser');
const shortid = require('shortid');

/**
 * escapeHTML
 * Prevents input from being parsed as HTML.
 * @param {String} str
 */
const escapeHTML = function (str) {
	if (!str) return '';
	return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\//g, '&#x2f;');
};

/**
 * parseName
 * Cleans up usernames and checks for validity.
 * @param {String} name
 */
const parseName = function (name) {
	let cleanName = escapeHTML(name).trim();
	if (!cleanName || cleanName.length < 1) return("Pikachu");
	if (cleanName.length > 19) return (cleanName.substr(0, 19));
	return cleanName;
};


module.exports = function (io) {
	io.on("connection", socket => {
		socket.name = "Player " + shortid.generate();

		socket.on('load', room => {
			socket.join(room);
			socket.room = room;

			if (!rooms.get(room).player1) {
				rooms.get(room).player1 = socket.id;
			} else if (!rooms.get(room).player2) {
				rooms.get(room).player2 = socket.id;
			}
			socket.emit('load room', rooms.get(room).getChat(), rooms.get(room).getGameBoard());
			io.sockets.in(room).emit('server message', socket.name + ' has joined.');
			rooms.get(room).addMessage(null, socket.name + ' has joined.');
		});

		socket.on('chat message', message => {
			if (typeof message !== 'string' || message.length < 1) return;
			let parsedMessage = parser.parseMessage(message);
			io.sockets.in(socket.room).emit('chat message', socket.name, parsedMessage);
			rooms.get(socket.room).addMessage(socket.name, parsedMessage);
		});

		socket.on('choose name', (name) => {
			name = parseName(name);
			let oldName = socket.name;
			socket.name = name;
			//socket.emit('name change');
			let msg = oldName + ' is now known as ' + name + '.';
			io.sockets.in(socket.room).emit('server message', msg);
			//Rooms.updateChat(socket.room, false, false, msg);
		});

		socket.on('drop piece', col => {
			let room = rooms.get(socket.room);
			let side;

			if (socket.id === room.getPlayer1()) {
				side = "r";
				if (room.turn !== side) return;
			} else if (socket.id === room.getPlayer2()) {
				side = "b";
				if (room.turn !== side) return;
			} else {
				return;
			}
			let row = room.addPiece(col, side);
			if (!row) return;
			io.sockets.in(socket.room).emit('drop piece', col, row - 1, side);
		});

		socket.on('disconnect', () => {
			io.sockets.in(socket.room).emit('server message', socket.name + ' has left.');
			//rooms.get(socket.room).addMessage(null, socket.name + ' has joined.');
		});
	});
};
