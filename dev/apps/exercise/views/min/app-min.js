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

            var canvas = $('#notation-canvas')[0];
            var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

            var ctx = renderer.getContext();
            var stave = new Vex.Flow.Stave(10, 0, 500);
            stave.addClef('treble').setContext(ctx).draw();

            // Create the notes
              var notes = [
                // A quarter-note C.
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" })
                // A quarter-note D.
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" })

                // A quarter-note rest. Note that the key (b/4) specifies the vertical
                // position of the rest.
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" })
              ];

              var notes2 = [
                // A C-Major chord.
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" }),
                new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "32" })
              ];

            // Create a voice in 4/4
              var voice = new Vex.Flow.Voice({
                num_beats: 4,
                beat_value: 4,
                resolution: Vex.Flow.RESOLUTION
              });
              
              var beam = new Vex.Flow.Beam(notes2);
              
              // Add notes to voice
              // voice.addTickables(notes.concat(notes2));

              // Format and justify the notes to 500 pixels
              // var formatter = new Vex.Flow.Formatter().
              //   joinVoices([voice]).format([voice], 448);

              // // Render voice
              // voice.draw(ctx, stave);

              Vex.Flow.Formatter.FormatAndDraw(ctx, stave, (notes.concat(notes2)));
              
              
              
              beam.setContext(ctx).draw();

            return this;
        },

        toggleStates: function () {
            this.timer.toggleState();
            this.metronome.toggleState();
        },

        animateMarker: function () {
            $('#marker').stop().css('left', '59px');

            $('#marker').show().animate({
                'left': '386px'
            }, (this.metronome.get('timeoutTime') * this.metronome.get('beats')), 'linear');
        },

        stopAnimateMarker: function () {
            $('#marker').stop().hide().css('left', '59px');
        }

    });

    return new AppView;
});