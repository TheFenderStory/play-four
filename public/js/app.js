var socket = io();

function autoScroll() {
	$('#messages').scrollTop(10 * 40 ^ 100000000000); // #legendary
}

/* General Socket events */

socket.on('chat message', (by, msg) => {
	$('#messages').append('<li><strong> ' + by + ':</strong><span class="inline-message"> ' + msg + '</span></li>');
	autoScroll();
});

socket.on('server message', (message) => {
    $('#messages').append('<li class="server">' + message + '</li>');
    autoScroll();
});

socket.on('load room', function(chat, board) {
	for (let i = 0; i < chat.length; i++) {
		if (!chat[i][0]) {
			$('#messages').append('<li class="server">' + chat[i][1] + '</li>');
		} else {
			$('#messages').append('<li><strong>' + chat[i][0] + ':</strong><span class="inline-message"> ' + chat[i][1] + '</span></li>');
		}
	}
	autoScroll();

	for (var y = 0; y < board.length; y++) {
		for (var x = 0; x < board[y].length; x++) {
			gameboard.addPiece(y, x, board[y][x]);
		}
	}
});

/* Event Handlers */

// Load data
$(document).ready(function() {
	let path = window.location.pathname;
	socket.emit('load', path.substring(path.lastIndexOf('/') + 1));
});

// Add Chat messages
$('#chat').submit(function() {
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	autoScroll();
	return false;
});

// Warn before leaving
window.addEventListener("beforeunload", function (e) {
	var confirmationMessage = 'Are you sure you want to exit? You will forfeit the match.';

	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});
