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

            // Generate the site templates and copy the site images over.
            site: {
                options: {
                    processContentExclude: [ '**/*.{png,ico}' ],
                    processContent: function( content ) {
                        return grunt.template.process( content, { delimiters: 'curly' } )
                    }
                },
                files: [
                    { expand: true, cwd: '_source/site/', src: [ 'images/*.{png,ico}' ], dest: 'site/' },
                    { 'index.htm': '_source/index.htm' }
                ]
            },

            // Copy the translations over.
            lib: {
                files: {
                    'lib/translations/': '_source/lib/translations/'
                }
            },

            // Copy the package settings into a jquery package.
            pkg: {
                files: {
                    'pickadate.jquery.json': 'package.json'
                }
            }
        },


        // Convert Sass files into CSS.
        sass: {
            site: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'site/styles/main.css': '_source/site/styles/main.scss'
                }
            },
            lib: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'lib/themes/default.css': '_source/lib/themes/*.scss'
                }
            }
        },


        // Concatenate the files and add the banner.
        concat: {
            site: {
                files: {
                    'site/scripts/main.js': '_source/site/scripts/*.js'
                }
            },
            lib: {
                options: {
                    banner: '/*!\n' +
                            ' * <%= pkg.title %> v<%= pkg.version %>, <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                            ' * By <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
                            ' * Hosted on <%= pkg.homepage %>\n' +
                            ' * Licensed under MIT ("expat" flavour) license.\n' +
                            ' */\n\n'
                },
                files: {
                    'lib/pickadate.js': '_source/lib/*.js'
                }
            }
        },


        // Lint the files.
        jshint: {
            options: {
                asi: true
            },
            files: [ 'Gruntfile.js', '_source/lib/pickadate.js', '_source/lib/translations/*.js', '_dev/qunit/tests.js' ]
        },


        // Unit test the files.
        qunit: {
            all: [ '_dev/qunit/qunit.htm' ]
        },


        // Watch the project files.
        watch: {
            site: {
                files: [ '_source/site/**/*.htm', '_source/site/**/*.scss', '_source/site/**/*.js' ],
                tasks: [ 'site' ]
            },
            lib: {
                files: [ '_source/lib/**/*.js' ],
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

    // Register the tasks.
    grunt.registerTask( 'default', [ 'concat', 'copy', 'sass', 'jshint', 'qunit' ] )
    grunt.registerTask( 'build', [ 'concat:lib', 'copy:lib', 'sass:lib' ] )
    grunt.registerTask( 'site', [ 'concat:site', 'copy:site', 'sass:site' ] )
    grunt.registerTask( 'travis', [ 'jshint', 'qunit' ] )

} //module.exports


