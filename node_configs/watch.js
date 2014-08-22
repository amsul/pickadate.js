/*jshint node: true*/

'use strict';

module.exports = {
    lib: {
        files: ['lib/**/*.js'],
        tasks: ['umd_wrapper', 'uglify', 'yuidoc']
    }
}