define(function(require) {

    'use strict';

    var Em = require('ember')

    var config = require('config')

    var DocItemObject = Em.Object.extend({

        data: null,

        isHidden: false,
        isInherited: false,
        isExtended: false,
        inheritedFrom: null,
        extendedFrom: null,

        isModule: Em.computed.equal('data.tag', 'module'),
        isMethod: Em.computed.equal('data.itemtype', 'method'),
        isPrivate: Em.computed.equal('data.access', 'private'),
        isProtected: Em.computed.equal('data.access', 'protected'),
        isStatic: Em.computed.equal('data.static', 1),
        isRequired: Em.computed.equal('data.required', 1),
        isWriteOnce: Em.computed.equal('data.writeonce', ''),
        isDeprecated: Em.computed.bool('data.deprecated'),
        isReadOnly: function() {
            return 'readonly' in this.get('data')
        }.property('data.readonly'),

        name: Em.computed.alias('data.name'),
        description: Em.computed.alias('data.description'),
        className: Em.computed.alias('data.class'),
        itemName: Em.computed.alias('data.itemtype'),

        types: function() {
            var types = this.get('data.type')
            return types ? types.replace(/^\{|\}$/g, '').split('|') : ''
        }.property('data.type'),

        queryName: function() {
            var queryName = this.get('name')
            var params = this.get('data.params')
            if ( params && params.length ) {
                queryName += '(' + params.mapProperty('name').join('-') + ')'
            }
            return queryName
        }.property('name', 'data.params'),

        definedAt: function() {
            return '%@:%@'.fmt(this.get('data.file'), this.get('data.line'))
        }.property('data.file', 'data.line'),

        definedLink: function() {
            var file = this.get('data.file')
            if ( !file ) {
                return
            }
            var line = this.get('data.line')
            var root = Em.get(config, 'project.repo') + '/blob'
            var version = Em.get(config, 'project.version')
            return root + '/' + version + '/' + file + (line ? '#L' + line : '')
        }.property('data.file', 'data.line')

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
        DocItemObject: DocItemObject,
        TabsObject: TabsObject,
        TabObject: TabObject,
    }
})