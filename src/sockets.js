'use strict';
/**
 * sockets
 * @author Jared Grady
 * @license MIT license
 */

const parser = require('./chat-parser');
const shortid = require('shortid');

module.exports = function (io) {
	io.on("connection", socket => {
		socket.shortid = shortid.generate();
		socket.name = "Player " + socket.shortid;

		socket.on('load', room => {
			socket.join(room);
			socket.room = room;

			if (!rooms.get(room).player1) {
				rooms.get(room).player1 = socket.shortid;
			} else if (!rooms.get(room).player2) {
				rooms.get(room).player2 = socket.shortid;
			}

			io.sockets.in(room).emit('server message', socket.name + ' has joined.');
			rooms.get(room).addMessage(null, socket.name + ' has joined.');
		});

		socket.on('chat message', message => {
			if (typeof message !== 'string' || message.length < 1) return;
			let parsedMessage = parser.parseMessage(message);
			io.sockets.in(socket.room).emit('chat message', socket.name, parsedMessage);
			rooms.get(socket.room).addMessage(socket.name, parsedMessage);
		});

		socket.on('drop piece', col => {
			let room = rooms.get(socket.room);
			let side;

			if (socket.shortid === room.getPlayer1()) {
				side = "r";
				if (room.turn !== side) return;
			} else if (socket.shortid === room.getPlayer2()) {
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
