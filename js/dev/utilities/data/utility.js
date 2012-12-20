/**
@appular {utility} data - designed to store variables for apps that multiple modules may need access too. works closely with the router to keep the url updated as well.
    @extends backbone.collection
    @define Data
*/
define([
    'jquery',
    'underscore',
    'backbone',
    'utilities/data/models/data',
    'cookies'
], function($, _, Backbone, DataModel, Cookies){
    var DataCollection = Backbone.Collection.extend({

        model: DataModel,

        lastChanged: '',

        initialize: function() {
            _.bindAll(this);

            /**
            @doc {event} dataChanged - fires when any data is changed after initial load.
                @param {string} id - the id of the data collection model that changed
            */
            this.on('add', function(model) {
                model.on('change', function() {
                    this.lastChanged = model.get('id');
                    this.trigger('dataChanged', model.get('id'));
                }, this);
            }, this);
        },

        // Sets data based on url data on initial load (ignores any parameters that are not defined in initialize above)
        load: function(data) {
            var dataInitialized = _.after(data.length, this.finalizeLoad);

            _.each(data, function(dataArray, index) {
                var model = this.get(dataArray[0]);

                if(!model) {
                    model = _.find(this.models, function(model){ return model.get('alias') === dataArray[0]; });
                }
                
                if(model) {
                    model.set({value: decodeURIComponent(dataArray[1])}, {silent: true});
                }

                dataInitialized();
            }, this);
        },

        finalizeLoad: function(data) {
            var triggerInitialized = _.after(this.length, this.triggerInitialized);
            
            _.each(this.models, function(model, index) {
                if(model.get('getFromCookie')) {
                    var cookieName = null;

                    if(model.get('alias') !== '') {
                        cookieName = model.get('alias');
                    } else {
                        cookieName = model.get('id');
                    }

                    model.set({value: Cookies.get(cookieName)});
                }

                if(model.get('isArray') && _.isString(model.get('value'))) {
                    var value = model.get('value');
                    model.set('value', value.split(','));
                }

                triggerInitialized();
            }, this);
        },

        /**
        @doc {event} initialized - fires when all data has been loaded
        */
        triggerInitialized: function() {
            this.trigger('initialized');
        }
    });

    return new DataCollection;
});