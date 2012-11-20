/**
@appular {view} field - view that represents each form field
    @parent {plugin} form
    @extends backbone.view
*/
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!plugins/form/templates/label.html'
], function($, _, Backbone, LabelTemplate) {

    var FieldView = Backbone.View.extend({

        attributes: {},

        initialize: function() {
            this.validators = this.options.validators || [];

            this.initialValue = this.options.value || $(this.el).val();

            if (this.options.label) {
                this.label = this.options.label;
            }

            if (this.options.events) {
                this.delegateEvents(this.options.events);
            }
        },

        addLabel: function() {

            if (this.label) {
                var template;

                if (_.isObject(this.label)) {
                    template = _.template(LabelTemplate, {
                        name: this.options.name,
                        label: this.label.text
                    });

                    if (this.label.placement === 'after') {
                        $(this.el).after(template);
                    } else {
                        $(this.el).before(template);
                    }
                } else {
                    template = _.template(LabelTemplate, {
                        name: this.options.name,
                        label: this.label
                    });

                    $(this.el).before(template);
                }

            }
        },

        setAttribute: function(attribute, value) {

            this.attributes[attribute] = value;

            if (!_.isEmpty(value)) {
                $(this.el).attr(attribute, value);
            } else {
                $(this.el).removeAttr(attribute);
            }

        },

        reset: function() {
            this.setAttribute('value', this.initialValue);
        }

    });

    return FieldView;

});