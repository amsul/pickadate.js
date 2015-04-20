
/*!
 * This Gruntfile is used to build the project files.
 */

/*jshint
    node: true
 */


module.exports = function( grunt ) {

    // Read the package manifest.
    var packageJSON = grunt.file.readJSON( 'package.json' )


    // Load the NPM tasks.
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-jshint' )
    grunt.loadNpmTasks( 'grunt-contrib-qunit' )
    grunt.loadNpmTasks( 'grunt-contrib-less' )
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' )
    grunt.loadNpmTasks( 'grunt-contrib-uglify' )
    grunt.loadNpmTasks( 'grunt-autoprefixer' )


    // Setup the initial configurations.
    grunt.initConfig({


        // Add the package data.
        pkg: packageJSON,


        // Set up the directories.
        dirs: {
            tests: 'tests',
            lib: {
                src: 'lib',
                min: 'lib/compressed'
            },
            themes: {
                src: 'lib/themes-source',
                dest: 'lib/themes',
                min: 'lib/compressed/themes'
            },
            translations: {
                src: 'lib/translations',
                min: 'lib/compressed/translations'
            },
        },


        // Compile LESS into CSS.
        less: {
            options: {
                style: 'expanded'
            },
            themes: {
                files: {
                    '<%= dirs.themes.dest %>/default.css': [ '<%= dirs.themes.src %>/base.less', '<%= dirs.themes.src %>/default.less' ],
                    '<%= dirs.themes.dest %>/classic.css': [ '<%= dirs.themes.src %>/base.less', '<%= dirs.themes.src %>/classic.less' ],
                    '<%= dirs.themes.dest %>/default.date.css': [ '<%= dirs.themes.src %>/base.date.less', '<%= dirs.themes.src %>/default.date.less' ],
                    '<%= dirs.themes.dest %>/default.time.css': [ '<%= dirs.themes.src %>/base.time.less', '<%= dirs.themes.src %>/default.time.less' ],
                    '<%= dirs.themes.dest %>/classic.date.css': [ '<%= dirs.themes.src %>/base.date.less', '<%= dirs.themes.src %>/classic.date.less' ],
                    '<%= dirs.themes.dest %>/classic.time.css': [ '<%= dirs.themes.src %>/base.time.less', '<%= dirs.themes.src %>/classic.time.less' ],
                    '<%= dirs.themes.dest %>/rtl.css': [ '<%= dirs.themes.src %>/rtl.less' ]
                }
            }
        },


        // Lint the files.
        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: 'Gruntfile.js',
            lib: [
                '<%= dirs.tests %>/units/*.js',
                '<%= dirs.lib.src %>/**/*.js',

                // Ignore the legacy and minified files.
                '!<%= dirs.lib.src %>/legacy.js',
                '!<%= dirs.lib.src %>/compressed/**/*.js'
            ]
        },


        // Minify all the things!
        uglify: {
            options: {
                preserveComments: 'some'
            },
            lib: {
                files: [
                    {
                        expand : true,
                        cwd : '<%= dirs.lib.src %>',
                        src   : [ '**/*.js', '!compressed/**/*.js' ],
                        dest : '<%= dirs.lib.min %>'
                    }
                ]
            }
        },
        cssmin: {
            lib: {
                expand: true,
                cwd: '<%= dirs.themes.dest %>',
                src: [ '**/*.css', '!compressed/**/*.css' ],
                dest: '<%= dirs.themes.min %>'
            }
        },


        // Prefix the styles.
        autoprefixer: {
            options: {
                browsers: [ '> 5%', 'last 2 versions', 'ie 8', 'ie 9' ]
            },
            themes: {
                src: '<%= dirs.themes.dest %>/**/*.css'
            },
        },


        // Unit test the files.
        qunit: {
            lib: [ '<%= dirs.tests %>/units/all.htm' ]
        },


        // Watch the project files.
        watch: {
            develop: {
                files: [
                    '<%= dirs.themes.src %>/**/*.less'
                ],
                tasks: [ 'develop-once' ]
            },
        }

    }) //grunt.initConfig


    // Register the tasks.
    grunt.registerTask( 'default', [ 'develop' ] )

    grunt.registerTask( 'develop', [ 'develop-once', 'watch:develop' ] )
    grunt.registerTask( 'develop-once', [ 'less:themes', 'autoprefixer:themes' ] )

    grunt.registerTask( 'package', [ 'develop-once', 'uglify', 'cssmin' ] )

    grunt.registerTask( 'test', [ 'jshint', 'qunit' ] )

} //module.exports


