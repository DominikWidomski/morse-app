const socket = io();
socket.on('setup', function() {
	console.log(arguments);
});

socket.emit('registerUserView', {
	username: 'Dom Client'
});

let intervalId;

socket.on('signalStart', function(e) {
	intervalId = setInterval(function() {
		console.info("Incoming Signal");
	}, 1000);
});

socket.on('signalStop', function(e) {
	console.info("Signal Stopped!!!");
	clearTimeout(intervalId)
});

let btn = document.querySelector('.js-ping');

function emitButtonDown() {
	console.warn("Emitting Click Event");
	socket.emit('emitterStart');
}

function emitButtonUp() {
	console.warn("Emitting Click Event");
	socket.emit('emitterStop');
}

['touchstart', 'mousedown'].forEach(function(eventType) {
	btn.addEventListener(eventType, emitButtonDown);
});

['touchend', 'mouseup'].forEach(function(eventType) {
	btn.addEventListener(eventType, emitButtonUp);
});
