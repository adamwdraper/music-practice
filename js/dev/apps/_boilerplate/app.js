/**
@appular {app} _boilerplate - quick boilerplate app to show structure and use of data collection
*/
define([
    'jquery',
    'underscore',
    'backbone',
    'data',
    'router',
    'apps/_boilerplate/views/app'
], function ($, _, Backbone, Data, Router, AppView) {
    var App = {
        initialize: function(element) {
            // Data.add([]);
            
            AppView.setElement(element);
            Router.initialize();
        }
    };

    return App;
});