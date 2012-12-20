({
    baseUrl: '../../../dev',
    dir: '../../../build',
    paths: {
        'jqueryLib': 'empty:',
        'jquery': 'libraries/jquery/jquery',
        'jqueryFunctions': 'libraries/jquery/functions',
        'underscoreLib': 'libraries/underscore/underscore-1.4.3',
        'underscore': 'libraries/underscore/underscore',
        'backboneLib': 'libraries/backbone/backbone-0.9.2',
        'backbone': 'libraries/backbone/backbone',
        'domReady': 'libraries/require/plugins/domReady',
        'async': 'libraries/require/plugins/async',
        'json': 'libraries/require/plugins/json',
        'text': 'libraries/require/plugins/text',
        'data': 'utilities/data/utility',
        'router': 'utilities/router/utility',
        'cookies': 'utilities/cookies/utility',
        'error': 'utilities/error/utility',
        'device': 'utilities/device/utility',
        'notify': 'utilities/notify/utility'
    },
    modules: [
        {
            name: 'appular',
            include: [
                'libraries/require/require',
                'libraries/require/config-build',
                'libraries/appular/appular'
            ]
        },
        {
            name: 'apps/demo/app',
            exclude: [
                'appular'
            ]
        }
    ],
    removeCombined: true
})