/**
@appular {utility} notify - flash messaging for user feedback
@extends backbone.view
@define Notify
*/
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!utilities/notify/templates/utility.html'
], function($, _, Backbone, Template) {
    
    var Notify = Backbone.View.extend({
                
        events: {
            'click': 'close'
        },
        
        initialize: function() {
            // add notify if not in the dom
            var element = $('#notify')[0];
            if(_.isEmpty(element)) {
                var template = _.template(Template, {});
                $('body').prepend(template);
            }

            this.setElement('#notify');

            $(this.el).addClass('notify');
        },

        /**
        @doc {function} show - show a user a message
            @param {object} options
                @property {string} options.message
                @property {number} options.[time]=0 - time for message to remain open. if 0, the notice will remain open until the user closes it
                @property {number} options.[type] - type of css style class i.e. info, error, success, etc.
        */
        show: function(options) {
            var self = this;
            
            $(this.el).find('p').html(options.message);
            $(this.el).fadeIn('fast');

            if(options.time > 0) {
                setTimeout(function() {
                    self.hide();
                }, options.time);
            }

            $(this.el).attr('class', 'notify').addClass(options.type);
        },

        /**
        @doc {function} hide - hide the user message
        */
        hide: function() {
            if($(this.el).is(':visible')) {
                $(this.el).fadeOut('slow', function() {
                    $(this).find('p').html('');
                });
            }
        },

        close: function(e) {
            this.hide();
            e.preventDefault();
            return false;
        }

    });
    
    return new Notify;

});