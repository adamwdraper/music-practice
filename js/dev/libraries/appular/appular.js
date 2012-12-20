// Appular
// version : 0.0.1
// author : Adam Draper
// license : MIT
// https://github.com/adamwdraper/Appular

var Appular = {
    initialize: function(app, element) {
        require([
            'domReady!',
            'jquery',
            'jqueryFunctions',
            'underscore',
            'backbone',
            'apps/' + app + '/app'
        ], function(doc, $, jqueryFunctions, _, Backbone, App) {
            App.initialize(element);
        });
    }
};