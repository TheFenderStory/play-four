'use strict';
/**
 * room
 * @author Jared Grady
 * @license MIT license
 */
const shortid = require('shortid');

/**
 * Room
 * Class representing a room.
 */
module.exports = class Room {
	constructor(player1, player2) {
		this.id = shortid.generate();
		this.player1 = null;
		this.player2 = null;
		this.chat = [];
		this.turn = "r";
		this.gameboard = this.initBoard();
	}

	getId() {
		return this.id;
	}

	getPlayer1() {
		return this.player1;
	}

	getPlayer2() {
		return this.player2;
	}

	getChat() {
		return this.chat;
	}

	getGameBoard() {
		return this.gameboard;
	}

	addMessage(user, message) {
		this.chat.push([user, message]);
	}

	initBoard() {
		let board = [];
		for (let i = 0; i < 7; i++) {
			board[i] = [];
		}
		return board;
	}

	addPiece(col, side) {
		if (this.gameboard[col].length === 6) {
			return;
		} else {
			this.gameboard[col].push(side);
			if (this.checkWinCondition(this.gameboard[col].length - 1, col, side)) {
				console.log(this.gameboard);
				console.log("win");
			}
			this.toggleTurn();
			return this.gameboard[col].length;
		}
	}

	toggleTurn() {
		if (this.turn === "r") {
			this.turn = "b";
		} else {
			this.turn = "r";
		}
	}

	checkWinCondition(row, col, side) {
		// Check Columns
		let counter = 0;
		let i;
		for (i = 0; i < 6; i++) {
			if (this.gameboard[col][i] === side) {
				counter++;
				if (counter === 4) return true;
			} else {
				counter = 0;
			}
		}

		// check rows
		counter = 0;
		for (i = 0; i < 7; i++) {
			if (this.gameboard[i][row] === side) {
				counter++;
				if (counter === 4) return true;
			} else {
				counter = 0;
			}
		}
		return false;
	}
};
