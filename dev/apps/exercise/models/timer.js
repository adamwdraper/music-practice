define([
    'Underscore',
    'Backbone'
], function(_, Backbone, Numeral) {
    var TimerModel = Backbone.Model.extend({
        
        defaults: {
            split: 0,
            total: 0,
            isOn: false,
            interval: {}
        },
        
        initialize: function () {
            _.bindAll(this);
        },

        toggleState: function () {
            if (this.get('isOn')) {
                this.stop();
            } else {
                this.start();
            }
        },
        
        start: function () {
            this.set({
                split: 0,
                isOn: true
            });
            this.set('interval', setInterval(this.addTime, 1000));
        },
        
        stop: function () {
            clearInterval(this.get('interval'));
            this.set('isOn', false);
        },

        reset: function () {
            this.set(this.defaults);
        },
        
        addTime: function () {
            this.set('split', this.get('split') + 1);
            this.set('total', this.get('total') + 1);
        }
        
    });

    return TimerModel;

});
