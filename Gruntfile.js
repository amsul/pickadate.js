/*jshint node: true*/

/**
 * This Gruntfile is used to import configs and tasks
 * from the `node_configs` and `node_tasks` folders.
 */

'use strict';

module.exports = function(grunt) {
    initTasks(grunt, 'node_tasks')
    initConfigs(grunt, 'node_configs')
}

function initTasks(grunt, folderPath) {
    var pkg = grunt.file.readJSON('package.json')
    var tasks = pkg.devDependencies
    delete tasks.grunt
    for ( var task in tasks ) {
        grunt.loadNpmTasks(task)
    }
    grunt.loadTasks(folderPath)
}

function initConfigs(grunt, folderPath) {
    var config = {}
    grunt.file.expand(folderPath + '/**/*.js').forEach(function(filePath) {
        var fileName = filePath.split('/').pop().split('.')[0]
        var fileData = require('./' + filePath)
        config[fileName] = fileData
    })
    grunt.initConfig(config)
}