define(function(require) {

    'use strict';

    var Em = require('ember')

    var computed = require('computed-helpers')

    var DeclarationObject = Em.ObjectProxy.extend({})

    var CategoryObject = DeclarationObject.extend({
        classes: computed.objectKeys('content.classes'),
        fors: computed.objectKeys('content.fors'),
        namespaces: computed.objectKeys('content.namespaces'),
    })

    var FileObject = CategoryObject.extend({
        modules: computed.objectKeys('content.modules'),
    })

    var ModuleObject = CategoryObject.extend({
        submodules: computed.objectKeys('content.submodules'),
    })

    var ClassObject = CategoryObject.extend({
        queryName: Em.computed.alias('name')
    })

    var ClassitemObject = DeclarationObject.extend({

        isHidden: false,
        isInherited: Em.computed.bool('inherits'),
        isExtended: Em.computed.bool('extends'),
        isPrivate: Em.computed.equal('access', 'private'),
        isProtected: Em.computed.equal('access', 'protected'),
        isDeprecated: Em.computed.bool('deprecated'),
        isRequired: Em.computed.equal('required', 1),
        isWriteOnce: Em.computed.equal('writeonce', ''),
        isMethod: Em.computed.equal('itemtype', 'method'),
        isReadOnly: function() {
            return 'readonly' in this.get('content')
        }.property('readonly'),

        types: function() {
            var types = this.get('type')
            return types ? types.replace(/^\{|\}$/g, '').split('|') : ''
        }.property('type'),

        queryName: function() {
            var params = this.get('params')
            var queryName = this.get('name')
            if ( params && params.length ) {
                queryName += '(%@)'.fmt(params.mapProperty('name').join('-'))
            }
            return queryName
        }.property('params')

    })

    var TabsObject = Em.Object.extend({
        data: [],
        setActiveTab: function(tabName) {
            tabName = tabName || 'index'
            var tabs = this.get('data')
            tabs.findBy('isActive', true).set('isActive', false)
            tabs.findBy('name', tabName).set('isActive', true)
        },
        init: function() {
            this._super()
            var tabs = this.get('data')
            tabs.findBy('name', 'index').set('isActive', true)
        },
    })

    var TabObject = Em.Object.extend({
        isActive: false,
        name: null
    })

    return {
        TabsObject: TabsObject,
        TabObject: TabObject,
        DeclarationObject: DeclarationObject,
        FileObject: FileObject,
        ModuleObject: ModuleObject,
        ClassObject: ClassObject,
        ClassitemObject: ClassitemObject,
    }
})