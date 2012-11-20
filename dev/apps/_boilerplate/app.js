// Filename: apps/_boilerplate/app
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Data',
    'Router',
    'apps/_boilerplate/views/app'
], function ($, _, Backbone, DataCollection, Router, AppView) {
    var App = {
        initialize: function(container) {
            DataCollection.add([
                // id
                {
                    id: 'id'
                }
            ]);
            AppView.setElement(container);
            Router.initialize();
        }
    };

    return App;
});