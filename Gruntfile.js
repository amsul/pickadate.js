
/*!
 * This Gruntfile is used to build the project files.
 */

/*jshint
    node: true
 */


module.exports = function( grunt ) {

    // Read the package manifest.
    var packageJSON = grunt.file.readJSON( 'package.json' )


    // Add the “curly” template delimiters.
    grunt.template.addDelimiters( 'curly', '{%', '%}' )


    // Load the NPM tasks.
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-jshint' )
    grunt.loadNpmTasks( 'grunt-contrib-qunit' )
    grunt.loadNpmTasks( 'grunt-contrib-copy' )
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
            docs: {
                src: '_docs',
                dest: '.'
            },
            demo: {
                images: 'demo/images',
                scripts: 'demo/scripts',
                styles: {
                    src: 'demo/styles/less',
                    dest: 'demo/styles/css'
                }
            },
        },


        // Generate static HTML templates.
        htmlify: {
            docs: {
                expand: true,
                cwd: '<%= dirs.docs.src %>',
                src: [ '/!(base|hero)*.htm' ],
                dest: '',
                base: '/base.htm'
            }
        },


        // Compile LESS into CSS.
        less: {
            options: {
                style: 'expanded'
            },
            demo: {
                files: {
                    '<%= dirs.demo.styles.dest %>/main.css': '<%= dirs.demo.styles.src %>/base.less'
                }
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
            demo: [ '<%= dirs.demo.scripts %>/demo.js' ],
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
            demo: {
                src: '<%= dirs.demo.styles.dest %>/**/*.css'
            }
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
            document: {
                files: [
                    '<%= dirs.docs.src %>/**/*.htm',
                    '<%= dirs.demo.styles.src %>/**/*.less',
                ],
                tasks: [ 'document-once' ]
            },
        },


        // Any extra data needed in rendering static files.
        meta: {

            // The sanitized github repo url.
            gitrepo_url: packageJSON.repository.url.replace( /.git$/, '' ),

            // Get the min & gzip size of a text file.
            fileSize: function( content ) {
                return {
                    min: content.length || 0,
                    gzip: content ? require( 'zlib-browserify' ).gzipSync( content ).length : 0
                }
            }
        }
    }) //grunt.initConfig


    // Register the tasks.
    grunt.registerTask( 'default', [ 'develop' ] )

    grunt.registerTask( 'develop', [ 'develop-once', 'watch:develop' ] )
    grunt.registerTask( 'develop-once', [ 'less:themes', 'autoprefixer:themes' ] )

    grunt.registerTask( 'document', [ 'document-once', 'watch:document' ] )
    grunt.registerTask( 'document-once', [ 'less:demo', 'autoprefixer:demo', 'package' ] )

    grunt.registerTask( 'package', [ 'uglify', 'cssmin', 'htmlify' ] )

    grunt.registerTask( 'test', [ 'jshint', 'qunit' ] )

    grunt.registerTask( 'build', [ 'develop-once', 'document-once', 'package', 'test' ] )



    // Create and register the task to build out the static HTML files.
    grunt.registerMultiTask( 'htmlify', 'Recursively build static HTML files', function() {

        var task = this,
            // options = task.options(),

            // Process the base file using the source file content.
            processFile = function( fileSource ) {

                var processedContent = ''/*,
                    fileNameMatch = fileSource.match( /([\w-]+)(\.htm)$/ )*/

                // Recursively process the base template using the file source content.
                grunt.verbose.writeln( 'Processing ' + fileSource )
                processedContent = grunt.template.process( grunt.file.read( task.data.cwd + task.data.base ), {
                    delimiters: 'curly',
                    data: {
                        pkg: packageJSON,
                        page: fileSource.match( /[\w-]+(?=\.htm$)/ )[ 0 ],
                        content: grunt.file.read( fileSource ),
                        meta: grunt.config.data.meta,
                        dirs: grunt.config.data.dirs
                    }
                })

                // Write the destination file by cleaning the file name.
                grunt.log.writeln( 'Writing ' + fileSource.cyan )
                grunt.file.write( task.data.dest + fileSource.match( /[\w-]+\.htm$/ )[ 0 ], processedContent )
            }


        // Map through the task directory and process the HTML files.
        grunt.log.writeln( 'Expanding ' + task.data.cwd.cyan )
        grunt.file.expand( task.data.cwd + task.data.src ).map( processFile )
    })

} //module.exports


