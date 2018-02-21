var socket = io();

function autoScroll() {
	$('#messages').scrollTop(10 * 40 ^ 100000000000); // #legendary
}

/* General Socket events */

socket.on('chat message', (by, msg) => {
	$('#messages').append('<li><strong> ' + by + ':</strong><span class="inline-message"> ' + msg + '</span></li>');
	autoScroll();
});

socket.on('drop piece', (col, row, side) => {
	console.log(col, row, side);
	gameboard.addPiece(col, row, side);
});

socket.on('load chat', function(array) {
	for (let i = 0; i < array.length; i++) {
		$('#messages').append('<li><strong>' + array[i][0] + ':</strong><span class="inline-message"> ' + array[i][1] + '</span></li>');
	}
	autoScroll();
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
