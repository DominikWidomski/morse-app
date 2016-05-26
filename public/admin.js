const socket = io('/admin');

angular.module('adminApp', [])
	.controller('UsersController', function($scope) {
		window.usersScope = $scope;

		$scope.users = [];

		socket.on('setup', (usersData) => {
			console.log("USER CNTRL", usersData);
			$scope.users = usersData.users;
			$scope.$apply();
		});

		socket.on('newUserView', user => {
			console.log("NEW USER VIEW", user);
			$scope.users[user.id] = user;
			$scope.$apply();
		});
	})

	.controller('AdminController', function($scope) {
		window.adminScope = $scope;

		$scope.users = [];

		socket.on('setup', (usersData) => {
			console.log("ADMIN CNTRL");
			$scope.users = usersData.adminUsers;
			$scope.$apply();
		});

		socket.on('newAdminView', user => {
			$scope.users[user.id] = user;
			$scope.$apply();
		});
	});