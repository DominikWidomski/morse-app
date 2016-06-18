let audioContext;
window.addEventListener('load', init, false);

function getAudioContext() {
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		return new AudioContext();
	}
	catch(e)
	{
		alert('Web Audio API is not supported in this browser');
		return false;
	}
}

let audioController;
let selectedNote = "C4";
let volume = true;

function init() {
	audioContext = getAudioContext();

	let btn = document.querySelector('.js-ping');

	audioController = new AudioController(audioContext, btn);

	function emitButtonDown() {
		console.warn("%cSTART Emitting", outgoingStyle);
		socket.emit('emitterStart', {
			note: selectedNote
		});
	}

	function emitButtonUp() {
		console.warn("%cSTOP Emitting", outgoingStyle);
		socket.emit('emitterStop');
	}

	// ACTIVATE
	['touchstart', 'mousedown'].forEach(function(eventType) {
		btn.addEventListener(eventType, emitButtonDown);
	});

	// DEACTIVATE
	['touchend', 'mouseup'].forEach(function(eventType) {
		btn.addEventListener(eventType, emitButtonUp);
	});
}

var users = {};

const socket = io();
socket.on('setup', function(srvr_users) {
	console.log("RECEIVED SETUP PAYLOAD");
	console.log(srvr_users);

	// Reset Users
	users = srvr_users;

	for(userSocketId in users) {
		users[userSocketId].audio = new AudioController(audioContext);
	}
});

socket.emit('registerUserView', {
	username: window.localStorage.getItem('username')
});

socket.on('userJoined', function(user) {
	console.log("NEW USER JOINED");
	users[user.id] = user;

	users[user.id].audio = new AudioController(audioContext);
});

socket.on('userLeft', function(userSocketId) {
	delete users[userSocketId];
});

let incomingStyle = 'color: red';
let outgoingStyle = 'color: blue';
let broadcastStyle = 'color: green';

let intervalId;
let intervalIdBroadcast;

socket.on('signalStart', function(e) {
	intervalId = setInterval(function() {
		console.info("%cINCOMING Signal", incomingStyle);
	}, 1000);
});

socket.on('signalStop', function(e) {
	console.info("%cINCOMING Signal Stopped!!!", incomingStyle);
	clearTimeout(intervalId);
});

socket.on('signalStartBroadcast', function(data) {
	if(volume) {
		console.log("START", data);
		let audio = users[data.userSocketId].audio;
		audio.start(data.note);
	} else {
		console.info("Volume Down!");
	}
});

socket.on('signalStopBroadcast', function(data) {
	// console.info("%cINCOMING Broadcast Stopped!!!", broadcastStyle);
	console.log("STOP", data);
	clearTimeout(intervalIdBroadcast);
	let audio = users[data.userSocketId].audio;
	audio.stop();
});

// NOTES SELECTOR
angular.module('userModule', [])
	.controller('notesController', function() {
		console.log(arguments);
		$scope.selectedNote = selectedNote;

		$scope.volume = volume;

		$scope.username = window.localStorage.getItem('username') || 'default';

		$scope.notes = {
			"C4" : 261.63,
		 	"C#4": 277.18,
		 	"Db4": 277.18,
			"D4": 293.66,
		 	"D#4": 311.13,
		 	"Eb4": 311.13,
			"E4": 329.63,
			"F4": 349.23,
		 	"F#4": 369.99,
		 	"Gb4": 369.99,
			"G4": 392.00,
			"G#4": 415.30,
			"Ab4": 415.30,
			"A4": 440.00,
			"A#4": 466.16,
			"Bb4": 466.16,
			"B4": 493.88,
			"C5": 523.25
		};

		$scope.selectNote = function(note) {
			$scope.selectedNote = selectedNote = note;
		}

		$scope.toggleVolume = function() {
			$scope.volume = volume = !$scope.volume;
		}

		$scope.submitUsername = function() {
			const username = $scope.username;
			socket.emit('submitUsername', username);
			window.localStorage.setItem('username', username);
		}
	});
