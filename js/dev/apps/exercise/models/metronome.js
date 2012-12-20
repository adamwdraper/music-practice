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
                        this.get('beep').play();
                    } else {
                        this.get('click').play();
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
