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
		audioController.ping("C4");
	};

	intervalIdBroadcast = setInterval(handleIncoming, 1000);
	handleIncoming();
});

socket.on('signalStopBroadcast', function(e) {
	console.info("%cINCOMING Broadcast Stopped!!!", broadcastStyle);
	clearTimeout(intervalIdBroadcast);
});
