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

function init() {
	audioContext = getAudioContext();

	let btn = document.querySelector('.js-ping');

	audioController = new AudioController(audioContext, btn);

	function emitButtonDown() {
		console.warn("%cSTART Emitting", outgoingStyle);
		socket.emit('emitterStart');
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

const socket = io();
socket.on('setup', function() {
	console.log(arguments);
});

socket.emit('registerUserView', {
	username: 'Dom Client'
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

socket.on('signalStartBroadcast', function(e) {
	var handleIncoming = function() {
		console.info("%cINCOMING Broadcast", broadcastStyle);
		if(volume) {
			audioController.ping(selectedNote);
		}
	};

	intervalIdBroadcast = setInterval(handleIncoming, 1000);
	handleIncoming();
});

socket.on('signalStopBroadcast', function(e) {
	console.info("%cINCOMING Broadcast Stopped!!!", broadcastStyle);
	clearTimeout(intervalIdBroadcast);
});

// NOTES SELECTOR
let selectedNote = "C4";
let volume = true;

angular.module('userModule', [])
	.controller('notesController', function($scope) {
		$scope.selectedNote = selectedNote;

		$scope.volume = volume;

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
	});
