// Generate with MATHEMATICS
// It's a log scale I think
const NOTES = {
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

/*
 * creates an oscillator controller from a slider
 *
 * @param context audio context
 */
function AudioController( context )
{
	this.context = context;

	this.play = false;
	this.started = false;

	this.oscillator = this.context.createOscillator();
	this.tuner = this.oscillator.detune;
	this.oscillator.type = 'sine';
}

AudioController.prototype.start = function(note = "A4") {
	if( !this.play )
	{
		this.oscillator.frequency.value = NOTES[note];
		this.oscillator.connect(this.context.destination);

		if( !this.started ) {
			this.started = true;
			this.oscillator.start();
			this.play = true;
		}

		if(this.bangTimeout) {
			window.clearTimeout(this.bangTimeout);
		}
	}
}

AudioController.prototype.stop = function() {
	this.oscillator.disconnect(this.context.destination);
	this.play = false;
}

AudioController.prototype.ping = function(note = "A4") {
	if( !this.play )
	{
		this.start();

		this.bangTimeout = window.setTimeout(() => {
			// console.log('disconnect');
			this.stop();
		}, 1000);
	}
}