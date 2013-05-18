
/*!
 * This Gruntfile is used to build the project files.
 */

/*jshint
    asi: true
 */
/*global
    module: true
 */


module.exports = function( grunt ) {

    // Read the package manifest.
    var packageJSON = grunt.file.readJSON( 'package.json' )


    // Add the “curly” template delimiters.
    grunt.template.addDelimiters( 'curly', '{%', '%}' )


    // Load the NPM tasks.
    grunt.loadNpmTasks( 'grunt-contrib-concat' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-jshint' )
    grunt.loadNpmTasks( 'grunt-contrib-qunit' )
    grunt.loadNpmTasks( 'grunt-contrib-copy' )
    grunt.loadNpmTasks( 'grunt-contrib-less' )
    grunt.loadNpmTasks( 'grunt-contrib-clean' )
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' )
    grunt.loadNpmTasks( 'grunt-contrib-uglify' )


    // Setup the initial configurations.
    grunt.initConfig({


        // Add the package data.
        pkg: packageJSON,


        // Set up the directories.
        dirs: {
            tests: 'tests',
            src: {
                raw: '_raw',
                demos: '_raw/demo',
                pickers: '_raw/lib',
                themes: '_raw/lib/themes',
                translations: '_raw/lib/translations'
            },
            dest: {
                demos: 'demo',
                pickers: 'lib',
                themes: 'lib/themes',
                translations: 'lib/translations'
            },
            min: {
                pickers: 'lib/compressed',
                themes: 'lib/compressed/themes',
                translations: 'lib/compressed/translations'
            }
        },


        // Clean the destination files and directories.
        clean: {
            demos: [ '<%= dirs.dest.demos %>', '*.htm' ],
            pickers: [ '<%= dirs.dest.pickers %>/*.js' ],
            themes: [ '<%= dirs.dest.themes %>' ],
            translations: [ '<%= dirs.dest.translations %>' ],
            pkg: [ '<%= dirs.dest.pickers %>', '<%= pkg.name %>.jquery.json', '*.md' ]
        },


        // Generate static HTML templates.
        htmlify: {
            demos: {
                expand: true,
                cwd: '<%= dirs.src.raw %>',
                src: [ '/!(base|hero)*.htm' ],
                dest: '',
                base: '/base.htm'
            }
        },


        // Copy over files to destination directions.
        copy: {
            demos: {
                expand: true,
                cwd: '<%= dirs.src.demos %>',
                src: [ 'styles/.css', 'images/*.{png,ico}' ],
                dest: '<%= dirs.dest.demos %>'
            },
            translations: {
                expand: true,
                cwd: '<%= dirs.src.translations %>',
                src: [ '*' ],
                dest: '<%= dirs.dest.translations %>'
            },
            pkg: {
                options: {
                    processContent: function( content ) {
                        return grunt.template.process( content, { delimiters: 'curly' } )
                    }
                },
                files: [
                    { '<%= pkg.name %>.jquery.json': 'package.json' },
                    { 'README.md': '<%= dirs.src.raw %>/README.md' },
                    { 'LICENSE.md': '<%= dirs.src.raw %>/LICENSE.md' },
                    { 'CHANGELOG.md': '<%= dirs.src.raw %>/CHANGELOG.md' },
                    { 'CONTRIBUTING.md': '<%= dirs.src.raw %>/CONTRIBUTING.md' }
                ]
            }
        },


        // Compile LESS into CSS.
        less: {
            options: {
                style: 'expanded'
            },
            demos: {
                files: {
                    '<%= dirs.dest.demos %>/styles/main.css': '<%= dirs.src.demos %>/styles/base.less'
                }
            },
            themes: {
                files: {
                    '<%= dirs.dest.themes %>/default.css': [ '<%= dirs.src.themes %>/base.less', '<%= dirs.src.themes %>/default.less' ],
                    '<%= dirs.dest.themes %>/classic.css': [ '<%= dirs.src.themes %>/base.less', '<%= dirs.src.themes %>/classic.less' ],
                    '<%= dirs.dest.themes %>/default.date.css': [ '<%= dirs.src.themes %>/base.date.less', '<%= dirs.src.themes %>/default.date.less' ],
                    '<%= dirs.dest.themes %>/default.time.css': [ '<%= dirs.src.themes %>/base.time.less', '<%= dirs.src.themes %>/default.time.less' ],
                    '<%= dirs.dest.themes %>/classic.date.css': [ '<%= dirs.src.themes %>/base.date.less', '<%= dirs.src.themes %>/classic.date.less' ],
                    '<%= dirs.dest.themes %>/classic.time.css': [ '<%= dirs.src.themes %>/base.time.less', '<%= dirs.src.themes %>/classic.time.less' ]
                }
            }
        },


        // Concatenate the files and add the banner.
        concat: {
            options: {
                process: function( content ) {
                    return grunt.template.process( content, { delimiters: 'curly' } )
                }
            },
            demos: {
                files: { '<%= dirs.dest.demos %>/scripts/main.js': '<%= dirs.src.demos %>/scripts/*.js' }
            },
            pickers: {
                expand: true,
                cwd: '<%= dirs.src.pickers %>',
                src: [ '*.js' ],
                dest: '<%= dirs.dest.pickers %>'
            }
        },


        // Lint the files.
        jshint: {
            gruntfile: 'Gruntfile.js',
            demos: [ '<%= dirs.src.demos %>/scripts/base.js' ],
            pickers: [
                '<%= dirs.tests %>/units/*.js',
                '<%= dirs.dest.pickers %>/**/*.js',

                // Ignore the legacy and minified files.
                '!<%= dirs.dest.pickers %>/legacy.js',
                '!<%= dirs.dest.pickers %>/compressed/**/*.js'
            ]
        },


        // Minify all the things!
        uglify: {
            options: {
                preserveComments: 'some'
            },
            pickers: {
                files: [
                    {
                        expand : true,
                        cwd : '<%= dirs.dest.pickers %>',
                        src   : [ '**/*.js', '!compressed/**/*.js' ],
                        dest : '<%= dirs.dest.pickers %>/compressed'
                    }
                ]
            }
        },
        cssmin: {
            pickers: {
                expand: true,
                cwd: '<%= dirs.dest.pickers %>',
                src: [ '**/*.css', '!compressed/**/*.css' ],
                dest: '<%= dirs.dest.pickers %>/compressed'
            }
        },


        // Unit test the files.
        qunit: {
            pickers: [ '<%= dirs.tests %>/units/all.htm' ]
        },


        // Watch the project files.
        watch: {
            gruntfile: {
                files: [ 'Gruntfile.js' ],
                tasks: [ 'jshint:gruntfile', 'default' ]
            },
            quick: {
                files: [
                    '<%= dirs.src.raw %>/*.htm',
                    '<%= dirs.src.demos %>/styles/*.less', '<%= dirs.src.demos %>/scripts/*.js',
                    '<%= dirs.src.pickers %>/**/*.js', '<%= dirs.src.pickers %>/themes/*.css',
                    '<%= dirs.src.themes %>/*.less',
                    '<%= dirs.src.translations %>/*.js'
                ],
                tasks: [ 'quick' ]
            },
            demos: {
                files: [
                    '<%= dirs.src.raw %>/*.htm',
                    '<%= dirs.src.demos %>/styles/*.less', '<%= dirs.src.demos %>/scripts/*.js'
                ],
                tasks: [ 'demo' ]
            },
            pickers: {
                files: [
                    '<%= dirs.src.pickers %>/**/*.js', '<%= dirs.src.pickers %>/themes/*.css',
                    '<%= dirs.src.themes %>/*.less',
                    '<%= dirs.src.translations %>/*.js'
                ],
                tasks: [ 'picker' ]
            }
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
    // * `htmlify` and `copy:pkg` should come after `uglify` because some package files measure `.min` file sizes.
    grunt.registerTask( 'default', [ 'clean', 'concat', 'copy:demos', 'copy:translations', 'less', 'jshint', 'qunit', 'uglify', 'cssmin', 'htmlify', 'copy:pkg' ] )
    grunt.registerTask( 'quick', [ 'concat', 'copy:demos', 'copy:translations', 'less', 'uglify', 'cssmin', 'htmlify', 'copy:pkg' ] )
    grunt.registerTask( 'picker', [ 'clean:pickers', 'concat:pickers', 'copy:translations', 'less:themes', 'jshint:pickers', 'qunit:pickers', 'uglify:pickers', 'cssmin:pickers' ] )
    grunt.registerTask( 'demo', [ 'clean:demos', 'concat:demos', 'copy:demos', 'less:demos', 'jshint:demos', 'htmlify:demos' ] )
    grunt.registerTask( 'travis', [ 'jshint:pickers', 'qunit:pickers' ] )



    // Create and register the task to build out the static HTML files.
    grunt.registerMultiTask( 'htmlify', 'Recursively build static HTML files', function() {

        var task = this,
            options = task.options(),

            // Process the base file using the source file content.
            processFile = function( fileSource ) {

                var processedContent = '',
                    fileNameMatch = fileSource.match( /([\w-]+)(\.htm)$/ )

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


