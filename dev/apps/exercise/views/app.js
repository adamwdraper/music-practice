/**
@appular {app} demo.views.app - main app view to render templates
@extends backbone.view
*/
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'BackboneModelBinder',
    'Data',
    'Numeral',
    'apps/exercise/models/lesson',
    'apps/exercise/models/exercise',
    'apps/exercise/models/timer',
    'apps/exercise/models/metronome',
    'text!apps/exercise/templates/app.html'
], function($, _, Backbone, ModelBinder, Data, Numeral, Lesson, Exercise, Timer, Metronome, AppTemplate) {

    var AppView = Backbone.View.extend({

        events: {
            'click #start-stop': 'toggleStates'
        },

        initialize: function() {
            _.bindAll(this);

            // Calls render when data collection is finished loading url vars
            Data.on('initialized', this.render, this);
        },

        render: function(){
            var template = _.template(AppTemplate, {});
            $(this.el).html(template);


            this.lesson = new Lesson({
                title: 'Lesson Title',
                text: 'something',
                exercises: [
                    {
                        title: 'Exercise 1)',
                        notes: [
                            'optional note from the author about this exercise',
                            'another note'
                        ],
                        tags: [],
                        tempo: 80,
                        beats: 4,
                        notation: 'test.png',
                        time: {
                            total: 345
                        },
                        history: [
                            {
                                date: '',
                                tempo: 90,
                                time: 200
                            },
                            {
                                date: '',
                                tempo: 90,
                                time: 145
                            }
                        ]
                    }
                ]
            });

            // create exercise and bindings
            this.exercise = new Exercise(this.lesson.get('exercises')[0]);

            var exerciseBindings = {
                title: '[data-bind=title]',
                notes: {
                    selector: '[data-bind=notes]',
                    converter: this.exercise.formattedNotes,
                    elAttribute: 'html'
                },
                notation: {
                    selector: '[data-bind=notation-image]',
                    converter: function (dir, value, name, model) {
                        return '<img src="img/' + value + '" />';
                    },
                    elAttribute: 'html'
                }
            };

            this.exerciseModelBinder = new ModelBinder();
            this.exerciseModelBinder.bind(this.exercise, this.el, exerciseBindings);
            
            // create timer and bindings
            this.timer = new Timer(this.exercise.get('time'));

            var timerBindings = {
                split: {
                    selector: '[data-bind=split-time]',
                    converter: function (dir, value, name, model) {
                        return Numeral(value).format('0:00:00');
                    }
                },
                total: {
                    selector: '[data-bind=total-time]',
                    converter: function (dir, value, name, model) {
                        return Numeral(value).format('0:00:00');
                    }
                }
            };

            this.timerModelBinder = new ModelBinder();
            this.timerModelBinder.bind(this.timer, this.el, timerBindings);

            // create metronome and bindings
            this.metronome = new Metronome({
                tempo: this.exercise.get('tempo'),
                beats: this.exercise.get('beats')
            });

            this.metronome.on('firstBeat', this.animateMarker);
            this.metronome.on('stopped', this.stopAnimateMarker);

            var metronomeBindings = {
                tempo: '[data-bind=tempo]',
                currentBeat: {
                    selector: '[data-bind=beats]',
                    converter: function (dir, value, name, model) {
                        // update style on visual progress bar
                        $('#progress').css('width', Numeral(value / model.get('beats')).format('0.0%'));

                        return value;
                    }
                },
                button: '[data-bind=start-stop]'
            };

            this.metronomeModelBinder = new ModelBinder();
            this.metronomeModelBinder.bind(this.metronome, this.el, metronomeBindings);

            return this;
        },

        toggleStates: function () {
            this.timer.toggleState();
            this.metronome.toggleState();
        },

        animateMarker: function () {
            $('#marker').stop().css('left', '22px');

            $('#marker').show().animate({
                'left': '349px'
            }, (this.metronome.get('timeoutTime') * this.metronome.get('beats')), 'linear');
        },

        stopAnimateMarker: function () {
            $('#marker').stop().hide().css('left', '22px');
        }

    });

    return new AppView;
});