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


        // Copy and process files.
        copy: {

            // Generate the site templates.
            site: {
                options: {
                    processContent: function( content ) {
                        return grunt.template.process( content, { delimiters: 'curly' } )
                    }
                },
                files: [
                    {
                        'index.htm': '_site/index.htm'
                    }
                ]
            },


            // Copy the package settings into a jquery package.
            pkg: {
                src: 'package.json',
                dest: 'pickadate.jquery.json'
            }
        },


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
                dest: 'lib/pickadate.js'
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
            site: {
                files: [ '_site/*.htm' ],
                tasks: [ 'site' ]
            },
            scripts: {
                files: [ '_source/*.js' ],
                tasks: [ 'default' ]
            }
        }
    }) //grunt.initConfig


    // Load the NPM tasks.
    grunt.loadNpmTasks( 'grunt-contrib-concat' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-jshint' )
    grunt.loadNpmTasks( 'grunt-contrib-qunit' )
    grunt.loadNpmTasks( 'grunt-contrib-copy' )

    // Add the "curly" delimiters.
    grunt.template.addDelimiters( 'curly', '{%', '%}' )

    // Register the default tasks.
    grunt.registerTask( 'default', [ 'concat' ] )
    grunt.registerTask( 'site', [ 'copy:site' ] )
    grunt.registerTask( 'travis', [ /*'jshint',*/ 'qunit' ] )

} //module.exports


