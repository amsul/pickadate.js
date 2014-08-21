define(function(require) {

    'use strict';

    var Em = require('ember')

    var computed = require('computed-helpers')

    var objects = require('objects')
    var TabsObject = objects.TabsObject
    var TabObject = objects.TabObject

    var arrays = require('arrays')
    var FilesArray = arrays.FilesArray
    var ModulesArray = arrays.ModulesArray
    var ClassesArray = arrays.ClassesArray
    var ClassitemsArray = arrays.ClassitemsArray

    var objectToFlatArray = function(object) {
        return object ? Object.keys(object).map(function(key) {
            return object[key]
        }) : []
    }

    var ApplicationController = Em.ObjectController.extend({
        files: function() {
            var data = this.get('model.files')
            var proxy = FilesArray.create({
                content: objectToFlatArray(data)
            })
            return proxy
        }.property('model.files'),
        modules: function() {
            var data = this.get('model.modules')
            var proxy = ModulesArray.create({
                content: objectToFlatArray(data)
            })
            return proxy
        }.property('model.modules'),
        classes: function() {
            var data = this.get('model.classes')
            var proxy = ClassesArray.create({
                content: objectToFlatArray(data)
            })
            return proxy
        }.property('model.classes'),
        classitems: function() {
            var data = this.get('model.classitems')
            var proxy = ClassitemsArray.create({
                content: data
            })
            return proxy
        }.property('model.classitems'),
    })

    var ModuleController = Em.ObjectController.extend({
        needs: ['application'],
        allModules: Em.computed.alias('controllers.application.modules'),
        syncModel: function() {
            var modules = this.get('allModules')
            var module = modules.findBy('name', this.get('name'))
            this.set('model', module)
        }.observes('allModules', 'name')
    })

    var ClassController = Em.ObjectController.extend({

        needs: ['application'],

        queryParams: ['tab', 'item'],
        tab: 'index',
        item: '',

        showInherited: true,
        showProtected: true,
        showPrivate: false,
        showDeprecated: false,

        allClasses: Em.computed.alias('controllers.application.classes'),
        allClassitems: Em.computed.alias('controllers.application.classitems'),

        syncModel: function() {

            var classes = this.get('allClasses')
            var classitems = this.get('allClassitems')
            var name = this.get('name')
            var cls = classes.findBy('name', name)

            this.set('model', cls)

            var extensionTrail = []
            var extendedFrom

            /*jshint sub: true*/
            while ( cls && (extendedFrom = cls.get('extends')) ) {
                if ( extendedFrom ) {
                    extensionTrail.push(extendedFrom)
                    cls = classes.findBy('name', extendedFrom)
                }
            }
            /*jshint sub: false*/

            var ownedClassitems = classitems.filterBy('class', name).
                map(function(classitem) {
                    if ( classitem.get('isExtended') ) {
                        classitem.set('extends', null)
                    }
                    if ( classitem.get('isInherited') ) {
                        classitem.set('inherits', null)
                    }
                    return classitem
                })

            var inheritedNames = []

            var inheritedClassitems = extensionTrail.
                map(function(extensionName) {
                    return classitems.filterBy('class', extensionName)
                }).
                reduce(function(collection, extensionClassitems) {
                    return collection.concat(extensionClassitems)
                }, []).
                filter(function(classitem) {

                    var classitemName = classitem.get('name')
                    var className = classitem.get('class')
                    var extendedClassitem = ownedClassitems.findBy('name', classitemName)

                    if ( extendedClassitem ) {
                        if ( !extendedClassitem.get('isExtended') ) {
                            extendedClassitem.set('extends', className)
                        }
                        return false
                    }

                    if ( extensionTrail.indexOf(className) > -1 ) {
                        if ( inheritedNames.indexOf(classitemName) < 0 ) {
                            inheritedNames.push(classitemName)
                            classitem.set('inherits', className)
                            classitem.set('class', className)
                            return true
                        }
                        return false
                    }

                    return true
                })

            this.set('classitems', ownedClassitems.concat(inheritedClassitems).sortBy('queryName'))

        }.observes('allClasses', 'name'),

        indexedItems: function() {
            var classitems = this.get('classitems')
            var tabObjects = this.get('tabObjects').slice(1)
            var indexedItems = tabObjects.map(function(tabObject) {
                var tabName = tabObject.get('name')
                return {
                    data: tabObject,
                    classitems: classitems.filterBy('itemtype', tabName)
                }
            })
            return indexedItems
        }.property('classitems'),

        tabObjects: function() {
            var classitems = this.get('classitems')
            var namesToTitles = {
                index: 'Index',
                attribute: 'Attributes',
                property: 'Properties',
                method: 'Methods',
            }
            var names = Object.keys(namesToTitles).filter(function(key) {
                return classitems.findBy('itemtype', key)
            })
            names.unshift('index')
            return names.map(function(name) {
                return TabObject.create({
                    name: name,
                    title: namesToTitles[name] || name
                })
            })
        }.property('classitems'),

        tabsObject: function() {
            var tabObjects = this.get('tabObjects')
            return TabsObject.create({
                data: tabObjects
            })
        }.property('tabObjects'),

        indexTabObject: function() {
            var tabObjects = this.get('tabObjects')
            return tabObjects.findBy('name', 'index')
        }.property('tabObjects'),

        updateActiveTab: function() {
            var tabName = this.get('tab')
            var tabsObject = this.get('tabsObject')
            tabsObject.setActiveTab(tabName)
        }.observes('tab', 'model'),

        toggleClassitemsVisibility: function(type, visibility) {
            this.get('indexedItems').forEach(function(item) {
                item.classitems.filterBy(type, true).forEach(function(classitem) {
                    classitem.set('isHidden', !visibility)
                })
            })
        },

        updateVisibilityOfClassitems: function() {
            this.updateInheritedClassitems()
            this.updateProtectedClassitems()
            this.updatePrivateClassitems()
            this.updateDeprecatedClassitems()
        },

        updateInheritedClassitems: function() {
            this.toggleClassitemsVisibility('isInherited', this.get('showInherited'))
        }.observes('showInherited'),

        updateProtectedClassitems: function() {
            this.toggleClassitemsVisibility('isProtected', this.get('showProtected'))
        }.observes('showProtected'),

        updatePrivateClassitems: function() {
            this.toggleClassitemsVisibility('isPrivate', this.get('showPrivate'))
        }.observes('showPrivate'),

        updateDeprecatedClassitems: function() {
            this.toggleClassitemsVisibility('isDeprecated', this.get('showDeprecated'))
        }.observes('showDeprecated'),

    })

    return {
        ApplicationController: ApplicationController,
        ModuleController: ModuleController,
        ClassController: ClassController,
    }
})