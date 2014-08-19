define(function(require) {

    'use strict';

    var objectToArray = function(object) {
        return Object.keys(object).map(function(key) {
            return object[key]
        })
    }

    var data = JSON.parse(require('text!/lib/docs/data.json'))

    // Convert objects into arrays.
    data.files = objectToArray(data.files)
    data.classes = objectToArray(data.classes)
    data.modules = objectToArray(data.modules)
    data.modules.forEach(function(module) {
        module.classes = Object.keys(module.classes)
    })

    // Fix the file path that yuidoc gives for modules..
    data.modules.forEach(function(module) {
        var moduleName = module.name
        var file = data.files.find(function(f) {
            return moduleName in f.modules
        })
        module.file = file.name
    })

    return data
})