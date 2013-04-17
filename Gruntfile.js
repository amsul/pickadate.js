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

            // Use curly braces to process these files.
            options: {
                processContent: function( content ) {
                    return grunt.template.process( content, { delimiters: 'curly' } )
                }
            },

            // Generate the site templates.
            site: {
                files: {
                    'index.htm': '_site/index.htm'
                }
            },

            // Copy the package settings into a jquery package.
            pkg: {
                files: {
                    'pickadate.jquery.json': 'package.json'
                }
            }
        },


        // Convert any Sass files into CSS.
        sass: {
            options: {
                style: 'expanded'
            },
            site: {
                files: {
                    '_media/styles.css': '_site/styles/main.scss'
                }
            }
        },


        // Concatenate the files and add the banner.
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
                files: {
                    'lib/pickadate.js': '_source/*.js'
                }
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
                files: [ '_site/*.htm', '_site/**/*.scss' ],
                tasks: [ 'site' ]
            },
            scripts: {
                files: [ '_source/*.js' ],
                tasks: [ 'default' ]
            }
        }
    }) //grunt.initConfig


    // Add the "curly" delimiters.
    grunt.template.addDelimiters( 'curly', '{%', '%}' )

    // Load the NPM tasks.
    grunt.loadNpmTasks( 'grunt-contrib-concat' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-jshint' )
    grunt.loadNpmTasks( 'grunt-contrib-qunit' )
    grunt.loadNpmTasks( 'grunt-contrib-copy' )
    grunt.loadNpmTasks( 'grunt-contrib-sass' )

    // Register the default tasks.
    grunt.registerTask( 'default', [ 'concat:scripts' ] )
    grunt.registerTask( 'site', [ 'copy:site', 'sass:site' ] )
    grunt.registerTask( 'travis', [ /*'jshint',*/ 'qunit' ] )

} //module.exports


