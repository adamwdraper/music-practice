define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Data',
    'Router',
    'apps/exercise/views/app'
], function ($, _, Backbone, Data, Router, AppView) {
    var App = {
        initialize: function(element) {
            Data.add([
                // view
                {
                    id: 'exercise',
                    value: 1
                }
            ]);
            AppView.setElement(element);
            Router.initialize();
        }
    };

    return App;
});