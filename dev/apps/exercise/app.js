define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Data',
    'Router',
    'apps/exercise/views/app'
], function ($, _, Backbone, DataCollection, Router, AppView) {
    var App = {
        initialize: function(element) {
            DataCollection.add([
                // view
                {
                    id: 'v',
                    value: 1
                }
            ]);
            AppView.setElement(element);
            Router.initialize();
        }
    };

    return App;
});