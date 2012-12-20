// Filename: utilities/error/utility.js
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var ErrorHandler = Backbone.View.extend ({

        initialize: function() {
            // this.listen();
        },

        report: function(message) {
            var e = {
                message: message
            };

            // @@ Post data somewhere
        }

    });

    return new ErrorHandler;
});