/*
 * creates an oscillator controller from a slider
 *
 * @param context audio context
 * @param element related DOM element
 */
function AudioController( context, element )
{
	this.context = context;
	this.element = element;

	// this.tracking = false;
	this.play = false;
	this.started = false;

	this.oscillator = this.context.createOscillator();
	this.tuner = this.oscillator.detune;

	this.element.addEventListener('click', this.ping.bind(this));
}

AudioController.prototype.ping = function() {
	if( !this.play )
	{
		console.log('connect');
		this.oscillator.connect(this.context.destination);

		if( !this.started ) {
			console.log('start');
			this.started = true;
			this.oscillator.start();
			this.play = true;
		}

		if(this.bangTimeout) {
			window.clearTimeout(this.bangTimeout);
		}

		this.bangTimeout = window.setTimeout(() => {
			console.log('disconnect');
			this.oscillator.disconnect(this.context.destination);
			this.play = false;
		}, 500);
	}
}