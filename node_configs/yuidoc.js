/*jshint node: true*/

'use strict';

module.exports = {
    lib: {
        name: '<%= pkg.name %>',
        title: '<%= pkg.title %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        repo: '<%= pkg.repository.url.replace(/\\.git$/, "") %>',
        author: '<%= pkg.author %>',
        options: {
            paths: 'lib/',
            outdir: 'docs/scripts-docs/',
            parseOnly: true
        }
    }
}