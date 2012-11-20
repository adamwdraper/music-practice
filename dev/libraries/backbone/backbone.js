// Filename: libraries/backbone/backbone
define([
    'libraries/backbone/backbone-0.9.2-min'
], function(){
    _.noConflict();
    $.noConflict(true);
    return Backbone.noConflict();
});