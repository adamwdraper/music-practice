// Filename: apps/_boilerplate/views/app
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Loader',
    'Data',
    'text!apps/_boilerplate/templates/app.html'
], function($, _, Backbone, Loader, DataCollection, AppTemplate) {

    var AppView = Backbone.View.extend({

        events: {},

        initialize: function() {
            // Calls render when data collection
            DataCollection.on('initialized', this.render, this);

            // load app css
            Loader.loadCss(['apps/_boilerplate']);
        },

        render: function(){
            var template = _.template(AppTemplate, {});
            $(this.el).html(template);

            return this;
        }

    });

    return new AppView;
});