/*jshint node: true*/

'use strict';

module.exports = {
    options: {
        style: 'expanded'
    },
    lib: {
        expand: true,
        cwd: 'lib/less',
        src: [ '*.less', '!_*.less' ],
        dest: 'lib/css',
        ext: '.css'
    }
}
