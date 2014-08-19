define(function(require) {

    'use strict';

    var Em = require('ember')

    /*jshint indent: false*/
    var fileNames = [

        // Component views.
        'components/list-params',
        'components/block-note',
        'components/cross-link',

        // Route based views.
        'application',
            'index',
            'module',
            'class',

        // Rendering views.
        'classitem',
        'classitem-param',

        // Partial views.
        '_sidebar',
        '_sidebar-modules',
        '_sidebar-classes',
    ]
    /*jshint indent: 4*/

    var requiredPaths = fileNames.map(function(file) {
        return 'text!../templates/' + file + '.hbs'
    })

    require(requiredPaths, function() {

        for ( var i = 0; i < fileNames.length; i+= 1 ) {
            var fileName = fileNames[i]
            var fileContent = arguments[i]
            if ( fileName in Em.TEMPLATES ) {
                throw new Error('The file "' + fileName + '" has already been listed.')
            }
            Em.TEMPLATES[fileName] = Em.Handlebars.compile(fileContent)
        }

        require(['routes', 'controllers', 'objects', 'components', 'views'], function() {
            var args = [].slice.call(arguments, 0)
            require(['app'], function(App) {
                args.forEach(function(arg) {
                    /*jshint indent: false*/
                    for ( var key in arg ) if ( arg.hasOwnProperty(key) ) {
                        App[key] = arg[key]
                    }
                    /*jshint indent: 4*/
                })
            })
        })

    })

})