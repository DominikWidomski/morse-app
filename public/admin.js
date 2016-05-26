const socket = io('/admin');
socket.on('setup', function() {
	console.log(arguments);
});

socket.emit('registerAdminView', {
	username: 'Dom Admin'
});

socket.on('usersInfo', data => {
	console.log("USERS", data);
});

socket.on('newUserView', data => {
	console.log("NEW USER VIEW", data);
});