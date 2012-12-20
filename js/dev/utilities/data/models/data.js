/**
@appular {model} data - model for data collection
    @extends backbone.model
    @parent {utility} data
*/
define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var DataModel = Backbone.Model.extend({

        defaults: {
            id: '',
            value: '',
            alias: '',
            addToHistory: true,
            addToUrl: true,
            getFromCookie: false,
            isArray: false
        },

        initialize: function(){
        }

    });

    return DataModel;

});