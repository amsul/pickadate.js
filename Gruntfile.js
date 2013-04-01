/*!
 * This Gruntfile is used to build the scripts.
 */

/*jshint
    asi: true
 */
/*global
    module: true
 */


module.exports = function( grunt ) {

    // Initial grunt configurations
    grunt.initConfig({


        // Read the package manifest.
        pkg: grunt.file.readJSON( 'package.json' ),


        // Concatenate the files and add banners.
        concat: {
            options: {
                banner: '/*!\n' +
                        ' * <%= pkg.title %> v<%= pkg.version %>, <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        ' * By <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
                        ' * Hosted on <%= pkg.homepage %>\n' +
                        ' * Licensed under MIT ("expat" flavour) license.\n' +
                        ' */\n\n'
            },
            scripts: {
                src: '_source/*.js',
                dest: 'pickadate.js'
            }
        },


        // Lint the build files.
        jshint: {
            files: [ '_source/pickadate.js' ]
        },


        // Watch the project files.
        watch: {
            files: [ '_source/*.js' ],
            tasks: [ 'default' ]
        }
    }) //grunt.initConfig


    // Load the NPM tasks.
    grunt.loadNpmTasks( 'grunt-contrib-concat' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-jshint' )


    // Register the default tasks.
    grunt.registerTask( 'default', [ 'concat', 'jshint' ] )
    grunt.registerTask( 'travis', [ 'jshint' ] )


    // Copy the package settings into a jquery package.
    grunt.file.copy( 'package.json', 'pickadate.jquery.json' )

} //module.exports


