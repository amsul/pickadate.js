define(function(require) {

    'use strict';

    var Em = require('ember')

    var objects = require('objects')
    var TabsObject = objects.TabsObject
    var TabObject = objects.TabObject
    var DocItemObject = objects.DocItemObject

    var ClassController = Em.ObjectController.extend({

        needs: ['application'],

        queryParams: ['tab', 'item'],
        tab: 'index',
        item: '',

        appRepo: Em.computed.alias('controllers.application.model.project.repo'),
        appVersion: Em.computed.alias('controllers.application.model.project.version'),
        appClasses: Em.computed.alias('controllers.application.model.classes'),
        appClassitems: Em.computed.alias('controllers.application.model.classitems'),

        extensionTrail: function() {

            var appClasses = this.get('appClasses')
            var extensionTrail = []
            var classObject = appClasses.findBy('name', this.get('name'))
            var extendedFrom

            /*jshint sub: true*/
            while ( classObject && (extendedFrom = classObject['extends']) ) {
                if ( extendedFrom ) {
                    extensionTrail.push(extendedFrom)
                    classObject = appClasses.findBy('name', extendedFrom)
                }
            }
            /*jshint sub: false*/

            return extensionTrail
        }.property('name'),

        hasName: function(classitem) {
            return 'name' in classitem
        },

        ownedClassitems: function() {
            return this.get('appClassitems').
                filterBy('class', this.get('name')).
                filter(this.hasName)
        }.property('name'),

        inheritedClassitems: function() {
            var appClassitems = this.get('appClassitems')
            var extensionTrail = this.get('extensionTrail')
            return extensionTrail.
                map(function(extensionName) {
                    return appClassitems.filterBy('class', extensionName)
                }).
                reduce(function(collection, extensionClassitems) {
                    collection = collection.concat(extensionClassitems)
                    return collection
                }, []).
                filter(this.hasName)
        }.property('name'),

        docitems: function() {

            var intoDocItem = function(data) {
                return DocItemObject.create({
                    data: data,
                })
            }

            var ownedDocItems = this.get('ownedClassitems').
                map(intoDocItem)

            var extensionTrail = this.get('extensionTrail')

            var inheritedNames = []

            var inheritedDocItems = !extensionTrail.length ? [] :
                this.get('inheritedClassitems').
                    map(intoDocItem).
                    filter(function(docitem) {
                        var className = docitem.get('className')
                        var extendedDocItem = ownedDocItems.findBy('name', docitem.get('name'))
                        if ( extendedDocItem ) {
                            if ( !extendedDocItem.get('isExtended') ) {
                                extendedDocItem.set('isExtended', true)
                                extendedDocItem.set('extendedFrom', className)
                            }
                            return false
                        }
                        if ( extensionTrail.indexOf(className) > -1 ) {
                            var docitemName = docitem.get('name')
                            if ( inheritedNames.indexOf(docitemName) < 0 ) {
                                inheritedNames.push(docitemName)
                                docitem.set('isInherited', true)
                                docitem.set('inheritedFrom', docitem.get('className'))
                                docitem.set('className', className)
                                return true
                            }
                            return false
                        }
                        return true
                    })

            return ownedDocItems.concat(inheritedDocItems).sortBy('queryName')
        }.property('name'),

        indexedDocitems: function() {
            var docitems = this.get('docitems')
            var tabObjects = this.get('tabObjects').slice(1)
            var indexedDocitems = tabObjects.map(function(tabObject) {
                var tabName = tabObject.get('name')
                return {
                    data: tabObject,
                    units: docitems.filterBy('itemName', tabName)
                }
            })
            return indexedDocitems
        }.property('docitems'),

        tabObjects: function() {
            var docitems = this.get('docitems')
            var namesToTitles = {
                index: 'Index',
                attribute: 'Attributes',
                property: 'Properties',
                method: 'Methods',
            }
            var names = Object.keys(namesToTitles).filter(function(key) {
                return docitems.findBy('itemName', key)
            })
            names.unshift('index')
            return names.map(function(name) {
                return TabObject.create({
                    name: name,
                    title: namesToTitles[name] || name
                })
            })
        }.property('docitems'),

        tabsObject: function() {
            var tabObjects = this.get('tabObjects')
            return TabsObject.create({
                data: tabObjects
            })
        }.property('tabObjects'),

        updateActiveTab: function() {
            var tabName = this.get('tab')
            var tabsObject = this.get('tabsObject')
            tabsObject.setActiveTab(tabName)
        }.observes('tab'),

        indexTabObject: function() {
            var tabObjects = this.get('tabObjects')
            return tabObjects.findBy('name', 'index')
        }.property('tabObjects'),

        showInherited: true,
        showProtected: true,
        showPrivate: false,
        showDeprecated: false,

        toggleClassitemsVisibility: function(type, visibility) {
            this.get('indexedDocitems').forEach(function(docitem) {
                docitem.units.filterBy(type, true).forEach(function(unit) {
                    unit.set('isHidden', !visibility)
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
        ClassController: ClassController
    }
})