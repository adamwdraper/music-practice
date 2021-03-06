// Filename: components/timeline/module
define([
    'jquery',
    'underscore',
    'backbone',
    'data',
    'text!components/_boilerplate/templates/module.html'
], function($, _, Backbone, DataCollection, Template) {

    var ModuleView = Backbone.View.extend({

        events: {
        },

        initialize: function() {
        },

        render: function() {
            var timeline = _.template(Template, {});
            $(this.el).html(timeline);
        }

    });

    return new ModuleView;
});