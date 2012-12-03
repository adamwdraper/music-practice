define([
    'jQuery',
    'Underscore',
    'Backbone',
    'apps/exercise/models/exercise'
], function($, _, Backbone, ExerciseModel){
    var ExerciseCollection = Backbone.Collection.extend({

        model: ExerciseModel,

        initialize: function() {
            _.bindAll(this);
        }

    });

    return new ExerciseCollection;
});