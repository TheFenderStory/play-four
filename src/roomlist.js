'use strict';
/**
 * rooms
 * @author Jared Grady
 * @license MIT license
 */

/**
 * Roomlist
 * Class representing a the list of rooms.
 */
module.exports = class RoomList {
	constructor() {
		this.list = {};
	}

	get(id) {
		if (!this.hasRoom(id)) {
			return;
		}
		return this.list[id];
	}

	add(room) {
		this.list[room.getId()] = room;
	}

	hasRoom(id) {
		return id in this.list;
	}
};
