/*jshint node: true*/

'use strict';

module.exports = function(grunt) {
    grunt.registerTask('default', ['less', 'autoprefixer', 'uglify'])
    grunt.registerTask('test', ['jshint', 'jasmine'])
    grunt.registerTask('release', function(version) {
        if ( !version ) {
            grunt.fail.fatal('A release version must be specified.')
        }
        ['package.json', 'bower.json', 'pickadate.jquery.json'].forEach(function(path) {
            var config = grunt.file.readJSON(path);
            config.version = version;
            grunt.file.write(path, JSON.stringify(config, null, '  '));
            grunt.log.ok('Updated ' + path + ' to version ' + version);
            if ( path == 'package.json' ) {
                grunt.config.set('pkg', config);
            }
        });
    })
}
