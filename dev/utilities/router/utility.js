// Filename: utilities/router/module
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Data'
], function($, _, Backbone, DataCollection){
    var AppRouter = Backbone.Router.extend({

        // Settings to change the appearance of hash
        settings: {
            hash: {
                useBang: false,
                dataSeparator: '/',
                keyValSeparator: ':'
            },
            // where the router will read the initial data from.  options: hash or query
            loadFrom: 'hash'
        },

        initialize: function(options) {
            $.extend(this.settings, options);

            // Update the url hash whenever a data changes
            DataCollection.on('dataChanged', function(id) {
                this.navigateHash(!DataCollection.get(id).get('addToHistory'));
            }, this);
        },

        routes: {
            '*data': 'appAction'
        },

        appAction: function(data) {

            if(this.settings.loadFrom === 'query') {

                var query = window.location.search.substr(1),
                    dataSplit = query.split('&'),
                    dataArray = [];

                if(dataSplit[0] !== '') {
                _.each(dataSplit, function(data, index) {
                    if(data.indexOf('=') > -1) {
                        dataArray.push(data.split('='));
                    }
                });
                }

                DataCollection.load(dataArray);

            } else {
                // Process any data that are present on initial page load
                if(data.length > 0) {

                    var self = this;

                    if(this.settings.hash.useBang) {
                        if(data.charAt(0) === '!'){
                            data = data.substr(1);
                        }
                    }

                    var dataSplit = data.split(this.settings.hash.dataSeparator),
                        dataArray = [];

                    _.each(dataSplit, function(data, index) {
                        dataArray.push(data.split(self.settings.hash.keyValSeparator));
                    });

                    DataCollection.load(dataArray);

                } else {

                    DataCollection.trigger('initialized');

                }
            }
        },

        navigateHash: function(replace) {
            // Generate and navigate to new hash
            var hashArray = [],
                hash = '',
                value;

            _.each(DataCollection.models, function(model, index) {

                if(model.get('addToUrl')) {
                    // get value
                    value = model.get('value');
                
                    // join arrays with commas for url
                    if(model.get('isArray') && !_.isEmpty(value)) {
                        value = value.join(',');
                    }

                    if(value !== '') {
                        
                        // use alias if it is defined
                        if(model.get('alias') !== '') {
                            hashArray.push(model.get('alias') + this.settings.hash.keyValSeparator + encodeURIComponent(value).replace(/%2C/gi, ','));
                        } else {
                            hashArray.push(model.get('id') + this.settings.hash.keyValSeparator + encodeURIComponent(value).replace(/%2C/gi, ','));
                        }
                        
                    }
                }
            }, this);

            // Add bang to hash if enabled
            if(this.settings.hash.useBang) {
                hash += '!';
            }

            hash += hashArray.join(this.settings.hash.dataSeparator);

            this.navigate(hash, {trigger: false, replace: replace});
        }

    });

    var initialize = function(options){
        var appRouter = new AppRouter(options);
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});