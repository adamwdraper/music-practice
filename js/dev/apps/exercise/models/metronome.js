define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var MetronomeModel = Backbone.Model.extend({
        
        defaults: {
            tempo: 60,
            tempoMax: 200,
            tempoMin: 20,
            beats: 4,
            currentBeat: 1,
            bars: 1,
            currentBar: 1,
            timeoutTime: {},
            isOn: false,
            timeout: {},
            taps: [],
            isMuted: false,
            timestamp: new Date().getTime(),
            button: 'Start'
        },
        
        initialize: function(){
            _.bindAll(this);

            this.on('change:tempo', this.updateTimeoutTime);

            this.set({
                'timeoutTime': Math.round(60000/this.get('tempo')),
                'currentBeat': this.get('beats')
            });

            // Try/Catch incase it doesn't exist (FF/IE)
            try {
                this.audioContext = new webkitAudioContext();
                this.soundBuffers = {};
                this.loadSound('beep', 'audio/beep.wav');
                this.loadSound('click', 'audio/click.wav');
            } catch(e) {
                alert('Web Audio API is not supported in this browser');
            }

        },

        onError: function () {

        },

        loadSound: function (name, url) {
            var request = new XMLHttpRequest(),
                self = this;

            request.open('GET', url, true);

            // Web Audio is binary (not text) - we need an arraybuffer
            request.responseType = 'arraybuffer';

            // Decode asynchronously
            request.onload = function() {
                self.audioContext.decodeAudioData(request.response, function (buffer) {
                    self.soundBuffers[name] = buffer;
                }, self.onError);
            };

            request.send();
        },

        playSound: function (name) {
            if (this.audioContext) {
                // creates a sound source
                var soundSource = this.audioContext.createBufferSource();
                // tell the source which sound to play
                soundSource.buffer = this.soundBuffers[name];
                // connect the source to the context's destination
                soundSource.connect(this.audioContext.destination);
                // play the source now
                soundSource.noteOn(0);
            }
        },
        
        toggleState: function() {
            if(this.get('isOn')) {
                // stop metronome
                this.stop();

            } else {
                // start metronome
                this.start();
            }
        },
        
        updateTimeoutTime: function() {
            this.set('timeoutTime', Math.round(60000/this.get('tempo')));
        },
        
        start: function() {
            this.set({
                'isOn': true,
                'button': 'Stop'
            });

            this.click();

            this.trigger('started');
        },

        click: function () {
            var now = (new Date()).getTime(),
                milliseconds = now - this.get('timestamp');

            if (milliseconds >= this.get('timeoutTime')) {
                console.log(milliseconds);
                this.set('timestamp', now);
                this.set('timeout', setTimeout(this.click, this.get('timeoutTime')));

                if(this.get('currentBeat') >= this.get('beats')) {
                    this.set('currentBeat', 1);
                    this.trigger('firstBeat');

                    if(this.get('currentBar') >= this.get('bars')) {
                        this.set('currentBar', 1);
                    } else {
                        this.set('currentBar', this.get('currentBar') + 1);
                    }
                } else {
                    this.set('currentBeat', this.get('currentBeat') + 1);
                }

                if(!this.get('isMuted')) {
                    if(this.get('currentBeat') === 1 && this.get('beats') > 1) {
                        this.playSound('beep');
                    } else {
                        this.playSound('click');
                    }
                }
            } else {
                // too short
                this.timeout = setTimeout(this.click, this.get('timeoutTime') - milliseconds);
            }
        },
        
        stop: function() {
            clearTimeout(this.get('timeout'));
            this.set({
                isOn: false,
                button: 'Start',
                currentBeat: this.get('beats'),
                currentBar: 1
            });
            this.trigger('stopped');
        },

        isOn: function () {
            return this.get('isOn');
        }
        
    });
    return MetronomeModel;

});
