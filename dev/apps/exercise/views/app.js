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
    'apps/exercise/collections/exercises',
    'libraries/jquery/plugins/input-grid',
    'text!apps/exercise/data/lesson.json',
    'text!apps/exercise/templates/app.html',
    'text!apps/exercise/templates/exercise-select.html',
    'text!apps/exercise/templates/exercise-info.html',
    'text!apps/exercise/templates/exercise-controls.html',
    'text!apps/exercise/templates/exercise-notation.html',
    'text!apps/exercise/templates/exercise-notation-canvas.html'
], function($, _, Backbone, ModelBinder, Data, Numeral, Lesson, Exercise, Timer, Metronome, ExercisesCollection, InputGrid, LessonJson, AppTemplate, ExerciseSelectTemplate, ExerciseInfoTemplate, ExerciseControlsTemplate, ExerciseNotationTemplate, ExerciseNotationCanvasTemplate) {

    var AppView = Backbone.View.extend({

        events: {
            'click #start-stop': 'toggleStates',
            'change #exercise-select select': 'changeExercise'
        },

        initialize: function() {
            _.bindAll(this);

            var self = this;

            // Calls render when data collection is finished loading url vars
            Data.on('initialized', this.render, this);

            Data.on('dataChanged', function (id) {
                if (id === 'exercise') {
                    self.loadExercise();
                }
            });
        },

        render: function () {
            var self = this,
                template = _.template(AppTemplate, {});
            
            $(this.el).html(template);

            this.lesson = new Lesson($.parseJSON(LessonJson));

            ExercisesCollection.add(this.lesson.get('exercises'));

            var selectTemplate = _.template(ExerciseSelectTemplate, {
                exercises: ExercisesCollection,
                selected: Data.get('exercise').get('value')
            });
            $('#exercise-select').html(selectTemplate);

            var exerciseControlsTemplate = _.template(ExerciseControlsTemplate, {});
            $('#exercise-controls').html(exerciseControlsTemplate);

            var exerciseNotationTemplate = _.template(ExerciseNotationTemplate, {});
            $('#exercise-notation').html(exerciseNotationTemplate);

            this.timer = new Timer();
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
            this.metronome = new Metronome();

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

            $('#grid').inputGrid({
                x: {
                    value: this.metronome.get('tempoMin'),
                    min: this.metronome.get('tempoMin'),
                    max: this.metronome.get('tempoMax')
                },
                y: {
                    value: 1,
                    min: 1,
                    max: 1
                }
            })
            .on('change', function() {
                $('[data-bind="tempo"]').text($(this).inputGrid('value').x);
            })
            .on('release', function() {
                var wasOn = false;

                if (self.metronome.isOn()) {
                    wasOn = true;
                    self.metronome.toggleState();
                }

                self.metronome.set('tempo', $(this).inputGrid('value').x);

                if (wasOn) {
                    self.metronome.toggleState();
                }
            });

            this.loadExercise();

            return this;
        },

        changeExercise: function (event) {
            this.metronome.stop();
            this.timer.stop();

            Data.get('exercise').set('value', $('#exercise-select select').val());
        },

        loadExercise: function () {
            this.exercise = ExercisesCollection.get(Data.get('exercise').get('value'));

            var exerciseInfoTemplate = _.template(ExerciseInfoTemplate, {
                exercise: this.exercise
            });
            $('#exercise-info').html(exerciseInfoTemplate);

            this.loadControls();
            
            this.loadNotes();
        },

        loadControls: function () {
            var self = this;

            this.timer.reset();

            // set initial time if history exists
            if (this.exercise.get('history').total) {
                this.timer.set('total', this.exercise.get('history').total);
            }

            var session,
                beats = this.exercise.get('notation').signature.beats,
                tempo = this.exercise.get('tempo');

            // set initial tempo if history exists
            if (this.exercise.get('history').sessions.length > 0) {
                // get last session
                session = this.exercise.get('history').sessions[this.exercise.get('history').sessions.length - 1];
                tempo = session.tempo;
            }

            this.metronome.set({
                beats: beats,
                currentBeat: beats,
                tempo: tempo
            });

            $('#grid').inputGrid('set', {
                x: tempo
            });
        },

        loadNotes: function () {
            // remove all canvases
            $('[rel="notation-canvas"]').remove();

            // set number of bars in metronome
            this.metronome.set('bars', this.exercise.get('notation').bars.length);

            // Create the notes
            // for each bar
            _.each(this.exercise.get('notation').bars, function (notes, index) {
                // add new canvas
                var exerciseNotationCanvasTemplate = _.template(ExerciseNotationCanvasTemplate, {});
                $('#canvases').append(ExerciseNotationCanvasTemplate);

                var canvas = $('[rel="notation-canvas"]')[index],
                    renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS),
                    context = renderer.getContext();

                var stave = new Vex.Flow.Stave(10, 0, 580),
                    beats = this.exercise.get('notation').signature.beats,
                    value = this.exercise.get('notation').signature.value,
                    vexBeams = [],
                    vexNotes = [],
                    allNotes = [];
                
                stave.addTimeSignature(beats + '/' + value).setContext(context).draw();

                // for each note
                _.each(notes, function (note, i) {
                    var vexStaves = {
                        beam: note.beam,
                        staves: []
                    };

                    _.each(note.staves, function (stave) {
                        vexStaves.staves.push(new Vex.Flow.StaveNote(stave));
                    });

                    vexNotes.push(vexStaves);
                    allNotes = allNotes.concat(vexStaves.staves);
                });

                var voice = new Vex.Flow.Voice({
                    num_beats: beats,
                    beat_value: value,
                    resolution: Vex.Flow.RESOLUTION
                });

                _.each(vexNotes, function (note) {
                    if (note.beam) {
                        vexBeams.push(new Vex.Flow.Beam(note.staves));
                    }
                });

                // Add notes to voice
                voice.addTickables(allNotes);

                // Format and justify the notes to 540 pixels
                var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 540);

                // Render voice
                voice.draw(context, stave);

                // Render beams
                _.each(vexBeams, function (beam) {
                    beam.setContext(context).draw();
                });
            }, this);
        },

        toggleStates: function () {
            this.timer.toggleState();
            this.metronome.toggleState();
        },

        animateMarker: function () {
            $('#marker').stop().css({
                left: '49px',
                top: $('[rel="notation-canvas"]:first').height() * (this.metronome.get('currentBar') - 1)
            });

            $('#marker').show().animate({
                'left': '588px'
            }, (this.metronome.get('timeoutTime') * this.metronome.get('beats')), 'linear');
        },

        stopAnimateMarker: function () {
            $('#marker').stop().hide().css({
                left: '49px',
                top: 0
            });
        }

    });

    return new AppView;
});