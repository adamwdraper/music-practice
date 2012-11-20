/**
@appular:2012-09-01 {plugin} toggles - renders set of elements that will toggle a value in the data collection
    @extends backbone.view
    @define plugins/toggles/plugin
*/
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Data',
    'text!plugins/toggles/templates/toggles.html'
], function($, _, Backbone, DataCollection, TogglesTemplate) {

    var Toggles = Backbone.View.extend({

        events: {
            'click .toggle': 'onClick'
        },

        initialize: function() {
            DataCollection.on('dataChanged', function(id) {
                if(id === this.options.data) {
                    this.render();
                }
            }, this);

            // if specific tagName is set use that otherwise try to figure one out
            if(!this.options.toggles.tagName) {
                if(this.options.tagName === 'ul') {
                    this.options.toggles.tagName = 'li';
                } else {
                    this.options.toggles.tagName = 'a';
                }
            }

            $(this.options.element).html($(this.el));
        },

        render: function() {
            var template = _.template(TogglesTemplate, {
                tagName: this.options.toggles.tagName,
                className: this.options.toggles.className,
                toggles: this.options.toggles.toggles,
                active: DataCollection.get(this.options.data).get('value')
            });
            $(this.el).html(template);

            return this;
        },

        onClick: function(e) {
            var value = $(e.currentTarget).attr('data-value');
            DataCollection.get(this.options.data).set({value:value});
        }
    });

    return Toggles;
});