/*
 * Dev Config Settings
 */
requirejs.config({
    baseUrl: '/js/dev',
    paths: {
        'jqueryLib': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
            'libraries/jquery/jquery-1.8.3'
        ],
        'jquery': 'libraries/jquery/jquery',
        'jqueryFunctions': 'libraries/jquery/functions',
        'underscoreLib': 'libraries/underscore/underscore-1.4.3',
        'underscore': 'libraries/underscore/underscore',
        'backboneLib': 'libraries/backbone/backbone-0.9.2',
        'backbone': 'libraries/backbone/backbone',
        'backboneModelBinder': 'libraries/backbone/model-binder',
        'numeral': 'libraries/numeral/numeral',
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
    }
});