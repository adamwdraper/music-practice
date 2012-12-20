/**
@appular {app} app - main app view to render templates
@parent
@extends backbone.view
*/
define([
    'jquery',
    'underscore',
    'backbone',
    'data',
    'text!apps/_boilerplate/templates/app.html'
], function($, _, Backbone, Data, AppTemplate) {

    var AppView = Backbone.View.extend({

        events: {},

        initialize: function() {
            // Calls render when data collection is finished loading url vars
            Data.on('initialized', this.render, this);
        },

        render: function(){
            var template = _.template(AppTemplate, {});
            $(this.el).html(template);

            return this;
        }

    });

    return new AppView;
});