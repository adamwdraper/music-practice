define([
    'Underscore',
    'Backbone',
    'Numeral'
], function(_, Backbone, Numeral, NotesTemplate) {
    var ExcersiseModel = Backbone.Model.extend({

        defaults: {},

        initialize: function () {
            _.bindAll(this);
        }

    });

    return ExcersiseModel;

});