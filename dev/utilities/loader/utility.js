/**
@appular {utility} loader - load files on demand
@extends backbone.view
@define Loader
*/
define([
    'jQuery',
    'Underscore',
    'Backbone'
], function ($, _, Backbone) {
    var Loader = {
        
        /**
        @doc {function} loadCss - loads css into head of file
            @param {array} paths - an arra of paths to css files without the .css extensions
        */
        loadCss: function(paths) {
            // Add each link tag to head
            _.each(paths, function(path, i) {
                // Todo strip '.css' if it exists

                $('<link href="' + path + '.css" rel="stylesheet" type="text/css" />').appendTo('head');
            });
        }
    };

    return Loader;
});