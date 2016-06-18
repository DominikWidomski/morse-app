const socket = io('/admin');

const app = angular.module('adminApp', [])
	.controller('UsersController', function($scope) {
		window.usersScope = $scope;

		$scope.users = [];

		socket.on('setup', (usersData) => {
			// console.log("USER CNTRL", usersData);
			$scope.users = window.users = usersData.users;
			$scope.userCount = Object.getOwnPropertyNames($scope.users).length;
			$scope.$apply();
		});

		socket.on('newUserView', user => {
			// console.log("NEW USER VIEW", user);
			$scope.users[user.id] = user;
			$scope.$apply();
		});
	})

	.controller('AdminController', function($scope) {
		window.adminScope = $scope;

		$scope.users = [];

		socket.on('setup', (usersData) => {
			// console.log("ADMIN CNTRL", usersData);
			$scope.users = usersData.adminUsers;
			$scope.$apply();
		});

		socket.on('newAdminView', user => {
			$scope.users[user.id] = user;
			$scope.$apply();
		});
	});


// Need to somehow require this directive into the app module
app.directive('userInfo', function() {
	return {
		restrict: 'E',
		scope: {
			socketId: '@',
			name: '@'
		},
		replace: true,
		template: '<div><b>{{socketId}}:</b> {{name}}</div>',
		link: function(scope, element, attrs) {

		},
		compile: function() {

		},
		controller: function($scope) {

		}
	}
});