let socket = io();

socket.emit('new user', {
	username: 'Dom'
});

socket.on('user joined', function() {
	console.log(arguments);
});