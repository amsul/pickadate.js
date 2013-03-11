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


        // Read the package manifest
        pkg: grunt.file.readJSON( 'package.json' ),


        // Concatenate the JS files and add a banner
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
                dest: 'build/pickadate.js'
            }
        },


        // Watch the project JS and SCSS files
        watch: {
            files: [ '_source/*.js' ],
            tasks: [ 'default' ]
        }
    }) //grunt.initConfig


    // Load the NPM tasks
    grunt.loadNpmTasks( 'grunt-contrib-concat' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )


    // Register the default tasks
    grunt.registerTask( 'default', [ 'concat' ] )

} //module.exports


