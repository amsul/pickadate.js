/*jshint node: true*/

'use strict';

module.exports = function(grunt) {
    grunt.registerTask('default', ['less', 'autoprefixer', 'uglify'])
    grunt.registerTask('test', ['jshint', 'jasmine'])
}
