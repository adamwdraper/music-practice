({
    dir: '../build',
    paths: {
        'jQueryLib': 'empty:',
        'jQuery': 'libraries/jquery/jquery',
        'jQueryFunctions': 'libraries/jquery/functions',
        'Underscore': 'libraries/underscore/underscore',
        'Backbone': 'libraries/backbone/backbone',
        'domReady': 'libraries/require/plugins/domReady',
        'json': 'libraries/require/plugins/json',
        'async': 'libraries/require/plugins/async',
        'text': 'libraries/require/plugins/text',
        'Loader': 'utilities/loader/utility',
        'Data': 'utilities/data/utility',
        'Router': 'utilities/router/utility',
        'Cookies': 'utilities/cookies/utility',
        'Error': 'utilities/error/utility',
        'Device': 'utilities/device/utility',
        'Notify': 'utilities/notify/utility'
    },
    shim: {
        'Backbone': {
            deps: ['Underscore', 'jQuery']
        }
    },
    fileExclusionRegExp: /(require.js)/,
    modules: [
        {
            name: 'apps/common/app'
        },
        {
            name: 'apps/demo/app',
            exclude: [
                'apps/common/app'
            ]
        }
    ],
    removeCombined: true
})