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


angular.module('adminApp', [])
	.controller('UsersController', function($scope) {
		window.$scope = $scope;

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

		socket.on('usersInfo', data => {
			console.log("USERS", data);
			for(userId in data.users) {
				$scope.users.push({
					username: data.users[userId].username
				});
			}
			$scope.$apply();
		});

		socket.on('newUserView', data => {
			console.log("NEW USER VIEW", data);
			$scope.users.push(data);
			$scope.$apply();
		});
	});