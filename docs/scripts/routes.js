define(function(require) {

    'use strict';

    var Em = require('ember')
    var $ = require('jquery')

    var ApplicationRoute = Em.Route.extend({
        model: function() {
            return $.getJSON($('script[data-docs]').data('docs')).then(function(data) {

                // // Fix the file path that yuidoc gives for modules..
                // var moduleName = module.name
                // var file = data.files.find(function(f) {
                //     return moduleName in f.modules
                // })
                // module.file = file.name

                return data
            })
        }
    })

    var ModuleRoute = Em.Route.extend({
        model: function(params) {
            var data = this.modelFor('application')
            return data.modules[params.module_name]
        }
    })

    var ClassRoute = Em.Route.extend({
        model: function(params) {
            var data = this.modelFor('application')
            return data.classes[params.class_name]
        }
    })

    return {
        ApplicationRoute: ApplicationRoute,
        ModuleRoute: ModuleRoute,
        ClassRoute: ClassRoute,
    }
})