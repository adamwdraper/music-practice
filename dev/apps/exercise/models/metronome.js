define([
    'jQuery',
    'Underscore',
    'Backbone'
], function($, _, Backbone) {
    var MetronomeModel = Backbone.Model.extend({
        
        defaults: {
            tempo: 60,
            tempoMax: 200,
            tempoMin: 20,
            beats: 4,
            currentBeat: 1,
            timeoutTime: {},
            isOn: false,
            timeout: {},
            taps: [],
            isMuted: false,
            timestamp: new Date().getTime(),
            button: 'Start',
            beep: $('#beep')[0],
            click: $('#click')[0]
        },
        
        initialize: function(){
            _.bindAll(this);

            this.on('change:tempo', this.updateTimeoutTime);

            this.set({
                'timeoutTime': Math.round(60000/this.get('tempo')),
                'currentBeat': this.get('beats')
            });
        },
        
        toggleState: function() {
            if(this.get('isOn')) {
                // stop metronome
                this.stop();
                this.set({
                    'isOn': false,
                    'button': 'Start'
                });
            } else {
                // start metronome
                this.play();
                this.set({
                    'isOn': true,
                    'button': 'Stop'
                });
            }
        },
        
        updateTimeoutTime: function() {
            this.set('timeoutTime', Math.round(60000/this.get('tempo')));
        },
        
        play: function() {
            var now = (new Date()).getTime(),
                milliseconds = now - this.get('timestamp');

            if (milliseconds >= this.get('timeoutTime')) {
                console.log(milliseconds);
                this.set('timestamp', now);
                this.set('timeout', setTimeout(this.play, this.get('timeoutTime')));

                if(this.get('currentBeat') >= this.get('beats')) {
                    this.set('currentBeat', 1);
                    this.trigger('firstBeat');
                } else {
                    this.set('currentBeat', this.get('currentBeat') + 1);
                }
                if(!this.get('isMuted')) {
                    if(this.get('currentBeat') === 1 && this.get('beats') > 1) {
                        this.get('beep').play();
                    } else {
                        this.get('click').play();
                    }
                }
            } else {
                // too short
                this.timeout = setTimeout(this.play, this.get('timeoutTime') - milliseconds);
            }

        },
        
        stop: function() {
            clearTimeout(this.get('timeout'));
            this.set('currentBeat', this.get('beats'));
            this.trigger('stopped');
        }
        
    });
    return MetronomeModel;

});
