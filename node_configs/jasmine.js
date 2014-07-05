/*jshint node: true*/

'use strict';

module.exports = {
    src: [
        'lib/shadow.js',
        'lib/ui-picker.js',
        'lib/ui-pickadate.js'
    ],
    options: {
        summary: true,
        specs: 'tests/spec/**/*.js',
        vendor: [
            'tests/jquery/jquery.1.7.0.js'
        ]
    }
}
