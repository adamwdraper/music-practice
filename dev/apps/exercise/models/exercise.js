define([
    'Underscore',
    'Backbone',
    'Numeral',
    'text!apps/exercise/templates/exercise-notes.html'
], function(_, Backbone, Numeral, NotesTemplate) {
    var ExcersiseModel = Backbone.Model.extend({

        defaults: {},

        initialize: function () {
            _.bindAll(this);
        },

        formattedNotes: function () {
            var notes = _.template(NotesTemplate, {
                notes: this.get('notes')
            });
            return notes;
        }

    });

    return ExcersiseModel;

});