/**
@appular:2012-09-01 {plugin} form - handles form submission and validation
    @extends backbone.view
    @define plugins/form/plugin
*/
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'plugins/form/views/field'
], function($, _, Backbone, Field) {

    var FormView = Backbone.View.extend({

        tagName: 'form',

        // validation errors
        errors: [],

        fieldViews: [],

        // the submit button
        submitter: {},

        events: {
            'submit': 'submitted'
        },

        /**
        @doc:2012-09-21 {function} initialize
            @param {object} options
                @property {array} options.[fields] - form fields
                @method {function} options.[valid] - callback function for successful validation
                    @param {object} options.valid.event - jquery event object for form submit
                @method {function} options.[error] - callback function for successful validation
                    @param {array} options.error.errors - an array of validation errors
        */
        initialize: function() {
            _.bindAll(this);
            
            this.fields = this.options.fields || [];
            this.valid = this.options.valid || null;
            this.error = this.options.error || null;
        },

        render: function() {

            this.fieldViews = [];
                
            // loop through fields to create them as views
            _.each(this.fields, function(field, index) {

                var fieldView = {};
                
                if (_.isUndefined(field.el)) { // we need to generate the html


                    if (field.type === 'textarea') {
                        field.tagName = 'textarea';
                    } else {
                        field.tagName = 'input';
                    }

                    field.attributes = {
                        'name': field.name || 'field-' + (index + 1),
                        'type': field.type || 'input',
                        'placeholder': field.placeholder || '',
                        'value': field.value || '',
                        'rel': field.rel || ''
                    };
                    
                    fieldView = new Field(field);
                    
                    $(this.el).append(fieldView.el);
                    fieldView.addLabel();

                    this.fieldViews.push(fieldView);

                    // save submit element for later
                    if (field.type === 'submit') {
                        this.submitter = fieldView;
                    }

                } else { // html already exists

                    fieldView = new Field(field);

                    this.fieldViews.push(fieldView);

                    // save submit element for later
                    if ($(fieldView.$el).attr('type') === 'submit') {
                        this.submitter = fieldView;
                    }
                }

            }, this);
            
            return this;
        },

        /**
        @doc:2012-09-21 {function} serialized
            @param {boolean} [asObject]=false - if true, an object will be returned
            @return {string||object} serialized - returns serialized data of the form fields
        */
        serialized: function(asObject) {
            if (asObject) {
                return $(this.el).serializeObject();
            } else {
                return $(this.el).serialize();
            }
        },

        submitted: function(e) {
            // disable submit button
            this.disableSubmit();

            // validate
            if (!this.validate()) {
                // validation failed
                // if error callback call it
                if (this.error) {
                    this.error(this.errors);
                }
            } else if (this.valid) {
                this.valid(e);
            }
            return false;
        },

        validate: function() {
            this.errors = [];
            // run validation on each fieldView
            _.each(this.fieldViews, function(fieldView) {
                if (!_.isEmpty(fieldView.validators)) {
                    this.validateField(fieldView);
                }
            }, this);

            return _.isEmpty(this.errors) ? true : false;
        },

        validateField: function(fieldView) {
            _.each(fieldView.validators, function(validator) {
                if (_.isFunction(validator.custom)) {
                    // run custom validator
                    validator.custom(fieldView);
                } else {
                    // call certain validation function which will add to this.errors array
                    this['validator' + validator.type.charAt(0).toUpperCase() + validator.type.slice(1)](fieldView, validator);
                }
            }, this);
        },

        validatorRegExp: function (fieldView, validator) {
            var value = $(fieldView.el).val();

            // check if empty don't validate
            if(value) {
                if (!value.match(validator.regExp)) {
                    
                    this.errors.push({
                        field: fieldView.$el,
                        validator: 'RegExp',
                        message: 'Not valid'
                    });
                }
            }
        },

        validatorRequired: function(fieldView, validator) {

            var value = $(fieldView.el).val();
            
            // check if empty
            if (value === null || value === undefined || value === '') {

                this.errors.push({
                    field: fieldView.$el,
                    validator: 'Required',
                    message: 'Required'
                });

            }

        },

        validatorNumber: function(fieldView, validator) {
            var value = Number($(fieldView.el).val()),
                min = validator.min,
                max = validator.max,
                valid = false,
                message = '';

            // check if empty don't validate
            if(value || value === 0) {
                if (_.isNumber(value) && !_.isNaN(value)) {
                    if (min && max) {
                        if (value >= min && value <= max) {
                            valid = true;
                        } else {
                            message = 'Number must be between ' + min + ' and ' + max;
                        }
                    } else if (min && !max) {
                        if (value >= min) {
                            valid = true;
                        } else {
                            message = 'Number be at least ' + min;
                        }
                    } else if (!min && max) {
                        if (value <= max) {
                            valid = true;
                        } else {
                            message = 'Number be less than ' + max;
                        }
                    } else {
                        valid = true;
                    }
                } else {
                    message = 'Value is not a number';
                }

                if (!valid) {
                    this.errors.push({
                        field: fieldView.$el,
                        validator: 'Number',
                        message: message
                    });
                }
            }
        },

        validatorUrl: function(fieldView, validator) {
            var value = $(fieldView.el).val();
            
            // check if empty don't validate
            if(value) {
                // check for url match
                if (!value.match(/^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i)) {
                    
                    this.errors.push({
                        field: fieldView.$el,
                        validator: 'Url',
                        message: 'Invalid Url'
                    });

                }
            }

        },

        validatorEmail: function(fieldView, validator) {
            var value = $(fieldView.el).val();
            
            // check if empty don't validate
            if(value) {
                if (!value.match(/^[\w\-]{1,}([\w\-\+.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/)) {
                    
                    this.errors.push({
                        field: fieldView.$el,
                        validator: 'Email',
                        message: 'Invalid email address'
                    });

                }
            }
        },

        validatorMatch: function(fieldView, validator) {
            var value = $(fieldView.el).val(),
                valueMatch = $('#' + validator.field).val();

            // check if empty
            if (value !== valueMatch) {
                this.errors.push({
                    field: fieldView.$el,
                    validator: 'Match',
                    message: 'Must match field "' + validator.field + '"'
                });

            }

        },

        validatorLength: function(fieldView, validator) {
            var value = $(fieldView.el).val(),
                length = value.length,
                min = validator.min,
                max = validator.max,
                valid = false,
                message = '';

            // check if empty don't validate
            if(value) {
                if (min && max) {
                    if (length >= min && length <= max) {
                        valid = true;
                    } else {
                        message = 'Must be between ' + min + ' and ' + max + ' characters';
                    }
                } else if (min && !max) {
                    if (length >= min) {
                        valid = true;
                    } else {
                        message = 'Must be at least ' + min + ' characters';
                    }
                } else if (!min && max) {
                    if (length <= max) {
                        valid = true;
                    } else {
                        message = 'Must be less than ' + max + ' characters';
                    }
                }

                if (!valid) {
                    this.errors.push({
                        field: fieldView.$el,
                        validator: 'Length',
                        message: message
                    });
                }
            }
        },

        /**
        @doc:2012-09-21 {function} addInput - adds a single input to the form
            @param {object} options - if true, an object will be returned
                @property {string} options.[id]
                @property {string} options.[name]
                @property {string} options.[type]=input
                @property {string} options.[placeholder]
                @property {string} options.[value]
                @property {string} options.[rel]
        */
        addInput: function(options) {
            var field = {};
            field.tagName = 'input';
            field.added = true;
            field.attributes = {
                'id': options.id || 'field-' + (this.fieldViews.length + 1),
                'name': options.name || 'field-' + (this.fieldViews.length + 1),
                'type': options.type || 'input',
                'placeholder': options.placeholder || '',
                'value': options.value || '',
                'rel': options.rel || ''
            };
            
            var fieldView = new Field(field);
            $(this.el).append(fieldView.el);

            this.fieldViews.push(fieldView);
        },

        /**
        @doc:2012-09-21 {function} removeInput - removes a single input from the form
            @param {element} element - the dom element to remove from the form
        */
        removeInput: function(el) {
            _.each(this.fieldViews, function(fieldView, index) {
                if (el === fieldView.el) {
                    fieldView.undelegateEvents();
                    fieldView.remove();
                    
                    this.fieldViews.splice(index, 1);
                }
            }, this);
        },

        /**
        @doc:2012-09-21 {function} disableSubmit - disables form submit
        */
        disableSubmit: function() {
            this.submitter.setAttribute('disabled', 'disabled');
        },

        /**
        @doc:2012-09-21 {function} enableSubmit - enables form submit
        */
        enableSubmit: function() {
            this.submitter.setAttribute('disabled', '');
        },
        
        /**
        @doc:2012-09-21 {function} reset - resets all fields to original value
        */
        reset: function() {
            // loop through each field
            _.each(this.fieldViews, function(fieldView) {
                
                // remove it entirely if it was added
                if (fieldView.options.added) {
                    fieldView.undelegateEvents();
                    fieldView.remove();
                }

                // reset field
                fieldView.reset();

            });

            // enable submit
            this.enableSubmit();
        },

        /**
        @doc:2012-09-21 {function} destroy - removes form and listeners from dom
        */
        destroy: function(){
            // remove all field views from dom
            _.each(this.fieldViews, function(fieldView) {
                fieldView.undelegateEvents();
                fieldView.remove();
            });

            this.fieldViews = [];
            this.fields = [];
            //COMPLETELY UNBIND THE VIEW
            this.undelegateEvents();
            this.remove();
        }

    });

    return FormView;

});