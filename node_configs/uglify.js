/*jshint node: true*/

'use strict';

module.exports = {
    options: {
        preserveComments: 'some'
    },
    lib: {
        files: {
            'lib/shadow.min.js': 'lib/shadow.js',
            'lib/ui-picker.min.js': 'lib/ui-picker.js',
            'lib/ui-pickadate.min.js': 'lib/ui-pickadate.js'
        }
    }
}
