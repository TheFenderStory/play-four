/* Game Socket Events */
socket.on('drop piece', (col, row, side) => {
	console.log(col, row, side);
	gameboard.addPiece(col, row, side);
});

var gameboard = {
	game: document.getElementById("game-board"),
	start: function() {
		this.game.height = 600;
		this.game.width = 1069;
		this.context = this.game.getContext("2d");

		this.game.addEventListener('click', function (e) {
			if (e.pageX >= 160 && e.pageX <= 840) {
				socket.emit('drop piece', Math.floor((e.pageX - 60) / 100) - 1);
			}
		});
	},

	makeHoles: function() {
		for (var y = 0; y < 6; y++) {
			for (var x = 0; x < 7; x++) {
				this.context.beginPath();
				this.context.arc(200 + (100 * x), 70 + (90 * y), 40, 0, 2 * Math.PI);
				this.context.fillStyle = "white";
				this.context.fill();
				this.context.stroke();
			}
		}
	},

	addPiece: function(col, row, side) {
		this.context.beginPath();
		console.log("Row: " + (70 + (90 * row)));
		this.context.arc(200 + (100 * col), 520 + (-90 * row), 40, 0, 2 * Math.PI);
		if (side == "r") {
			this.context.fillStyle = "red";
		} else {
			this.context.fillStyle = "black";
		}
		this.context.fill();
		this.context.stroke();
	}
}

function game() {
	gameboard.start();
	gameboard.makeHoles();
}

game();
