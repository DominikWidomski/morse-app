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

angular.module('adminApp', [])
	.controller('UsersController', function($scope) {
		$scope.users = [
			{
				username: 'dom',
			},
			{
				username: 'kacper',
			}
		];


		$scope.addNewUser = function() {
			$scope.users.push({
				username: $scope.newUserName
			});

			$scope.newUserName = "";
		}
	});