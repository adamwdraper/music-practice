{
    "title": "Lesson Title",
    "text": "something",
    "exercises": [
        {
            "id": 1,
            "title": "32nd notes",
            "notes": [
                "optional note from the author about this exercise",
                "another note"
            ],
            "tags": [],
            "tempo": 80,
            "beats": 4,
            "notation": function (canvas) {
                var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS),
                    ctx = renderer.getContext(),
                    stave = new Vex.Flow.Stave(10, 0, 580);
                
                stave.addTimeSignature("4/4").setContext(ctx).draw();

                // Create the notes
                var notes = [
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" })
                ];

                var notes2 = [
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" })
                ];

                var notes3 = [
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" })
                ];

                var notes4 = [
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" }),
                    new Vex.Flow.StaveNote({ keys: ["c/5"], duration: "32" })
                ];

                var voice = new Vex.Flow.Voice({
                    num_beats: 4,
                    beat_value: 4,
                    resolution: Vex.Flow.RESOLUTION
                });

                var beam = new Vex.Flow.Beam(notes);
                var beam2 = new Vex.Flow.Beam(notes2);
                var beam3 = new Vex.Flow.Beam(notes3);
                var beam4 = new Vex.Flow.Beam(notes4);

                // Add notes to voice
                voice.addTickables(notes.concat(notes2).concat(notes3).concat(notes4));

                // Format and justify the notes to 540 pixels
                var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 540);

                // Render voice
                voice.draw(ctx, stave);

                // Render beams
                beam.setContext(ctx).draw();
                beam2.setContext(ctx).draw();
                beam3.setContext(ctx).draw();
                beam4.setContext(ctx).draw();
            },
            "time": {
                "total": 345
            },
            "history": [
                {
                    "date": "",
                    "tempo": 90,
                    "time": 200
                },
                {
                    "date": "",
                    "tempo": 90,
                    "time": 145
                }
            ]
        }
    ]
}