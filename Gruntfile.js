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


        // A banner to use on all script files.
        banner: '/*!\n' +
                ' * <%= pkg.title %> v<%= pkg.version %>, <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * By <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
                ' * Hosted on <%= pkg.homepage %>\n' +
                ' * Licensed under MIT ("expat" flavour) license.\n' +
                ' */\n\n',


        // Concatenate the files and add the banner.
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            scripts: {
                src: '_source/*.js',
                dest: 'build/pickadate.js'
            }
        },


        // Lint the build files.
        jshint: {
            files: [ '_source/pickadate.js' ]
        },


        // Unit test the build files.
        qunit: {
            all: [ '_tests/qunit.htm' ]
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
    grunt.loadNpmTasks( 'grunt-contrib-qunit' )


    // Register the default tasks.
    grunt.registerTask( 'default', [ 'concat' ] )
    grunt.registerTask( 'travis', [ /*'jshint',*/ 'qunit' ] )


    // Copy the package settings into a jquery package.
    grunt.file.copy( 'package.json', 'pickadate.jquery.json' )

} //module.exports


