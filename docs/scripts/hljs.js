define(function(require) {

    'use strict';

    var hljs = require('highlight#source')

    require([
        'highlight-javascript',
        'highlight-json',
        'highlight-css',
        'highlight-scss',
        'highlight-xml',
        'highlight-handlebars'
    ])

    return hljs
});