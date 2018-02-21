'use strict';

const express = require('express');
const Room = require('./room.js');

const Router = module.exports = express.Router();

Router.route('/').get((req, res) => {
	res.render('index');
});

Router.route('/create').get((req, res) => {
	let room = new Room();
	rooms.add(room);
	res.redirect('/room/' + room.getId());
});

Router.route('/room/:id').get((req, res) => {
	console.log(req.path.substring(req.path.length - 9));
	if (rooms.hasRoom(req.path.substring(req.path.length - 9))) {
		res.render('game');
	} else {
		res.status(404).send('The requested room was not found!');
	}
});

/*
Router.route('/view/:id').get((req, res) => {
	if (Rooms.get(req.path.substring(6)), true) {  // eslint-disable-line
		res.send('This will be the landing page for the viewer.');
	} else {
		res.status(404).send('The requested room was not found!');
	}
});
*/
