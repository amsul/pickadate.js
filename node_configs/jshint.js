/*jshint node: true*/

'use strict';

module.exports = {
    options: {
        jshintrc: '.jshintrc'
    },
    dev: [
        'Gruntfile.js',
        'node_configs/*.js',
        'node_tasks/*.js'
    ],
    lib: [
        'lib/shadow.js',
        'lib/ui-picker.js',
        'lib/ui-pickadate.js'
    ],
    tests: ['tests/spec/**/*.js']
}
