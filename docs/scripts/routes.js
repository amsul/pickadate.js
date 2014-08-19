define(function(require) {

    'use strict';

    var Em = require('ember')

    var config = require('config')
    var objects = require('objects')
    var DocItemObject = objects.DocItemObject

    var ApplicationRoute = Em.Route.extend({
        model: function() {
            return config
        }
    })

    var ModuleRoute = Em.Route.extend({
        model: function(params) {
            var data = this.modelFor('application')
            return DocItemObject.create({
                data: data.modules.findBy('name', params.module_name),
            })
        }
    })

    var ClassRoute = Em.Route.extend({
        model: function(params) {
            var data = this.modelFor('application')
            var klass = data.classes.findBy('name', params.class_name)
            return DocItemObject.create({
                data: klass,
                isExtended: !!klass.extends,
                extendedFrom: klass.extends
            })
        }
    })

    return {
        ApplicationRoute: ApplicationRoute,
        ModuleRoute: ModuleRoute,
        ClassRoute: ClassRoute,
    }
})