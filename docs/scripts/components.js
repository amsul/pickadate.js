define(function(require) {

    'use strict';

    var Em = require('ember')
    var $ = require('jquery')

    var ListParamsComponent = Em.Component.extend({
        tagName: 'span',
        data: null,
        dataList: null,
        createListOfParams: function() {
            var data = this.get('data')
            if ( data ) {
                var dataList = ''
                data.forEach(function(param, index) {
                    if ( index ) {
                        dataList += ', '
                    }
                    if ( param.optional ) {
                        dataList += '['
                    }
                    dataList += param.name
                    if ( param.optional ) {
                        dataList += ']'
                    }
                })
                this.set('dataList', dataList)
            }
        }.on('willInsertElement').observes('data')
    })

    var ToggleTabsComponent = Em.Component.extend(Ember.ControllerMixin, {

        needs: ['class'],

        isQuerying: false,

        updateScrollToQuriedItem: function() {
            this.set('isQuerying', true)
            this.scrollToQuriedItem()
        }.observes('tabs', 'controllers.class.item'),

        scrollToQuriedItem: function() {
            var queryName = this.get('controllers.class.item')
            if ( !queryName ) {
                return
            }
            var component = this
            var doTheScroll = function() {
                component.set('isQuerying', false)
                var $el = $('[data-query-name="' + queryName + '"]')
                try {
                    $el[0].scrollIntoView()
                } catch (e) {
                    console.error('Unable to scroll to "%@".'.fmt(queryName))
                }
            }
            if ( component.get('isQuerying') ) {
                Em.run.next(component, doTheScroll)
            }
            else {
                doTheScroll()
            }
        }.on('didInsertElement'),

        filterClassitems: function() {
            var classController = this.get('controllers.class')
            classController.updateVisibilityOfClassitems()
        }.on('didInsertElement').observes('tabs'),

    })

    var ToggleTabsButtonComponent = Em.Component.extend({
        classNameBindings: ['isActive:is-active']
    })

    var ToggleTabsBodyComponent = Em.Component.extend({
        attributeBindings: ['isNotActive:hidden'],
        isNotActive: Em.computed.not('isActive')
    })

    var BlockNoteComponent = Em.Component.extend({
        classNames: ['notification'],
        classNameBindings: ['isWarning:notification--warning'],
        isWarning: Em.computed.equal('type', 'warning')
    })

    var CrossLinkComponent = Em.Component.extend(Ember.ControllerMixin, {

        tagName: 'span',

        needs: ['application'],

        project: Em.computed.alias('controllers.application.project'),
        files: Em.computed.alias('controllers.application.files'),
        modules: Em.computed.alias('controllers.application.modules'),
        classes: Em.computed.alias('controllers.application.classes'),
        classitems: Em.computed.alias('controllers.application.classitems'),

        to: null,
        section: null,
        file: null,
        line: null,

        fileLink: function() {
            var file = this.get('file')
            if ( !file ) {
                return
            }
            var line = this.get('line')
            var root = this.get('project.repo') + '/blob/master'
            return '%@/%@'.fmt(root, file) + (line ? '#L' + line : '')
        }.property('file', 'line'),

        toSplit: function() {
            var to = this.get('to')
            if ( !to ) {
                throw new Error('A cross-link requires a "to", "section", or "file" property.')
            }
            return to.split(':')
        }.property('to'),

        categoryName: Em.computed.alias('toSplit.0'),
        itemName: Em.computed.alias('toSplit.1'),

        categoryType: function() {
            var categoryName = this.get('categoryName')
            if ( this.get('classes').findBy('name', categoryName) ) {
                return 'class'
            }
            if ( this.get('modules').findBy('name', categoryName) ) {
                return 'module'
            }
        }.property('classes', 'modules', 'categoryName'),

        itemType: function() {
            var section = this.get('section')
            if ( section ) {
                return section == 'attributes' ? 'attribute' :
                    section == 'properties' ? 'property' :
                    section == 'methods' ? 'method' :
                    section
            }
            var itemName = this.get('itemName')
            var itemShortName = itemName.replace(/\(.+\)$/, '')
            var classitem = this.get('classitems').findBy('name', itemShortName)
            if ( !classitem ) {
                throw new Error('Nothing found to cross link to by the name of ' + itemName)
            }
            return classitem.get('itemtype')
        }.property('section', 'classitems', 'itemName')

    })

    return {
        ListParamsComponent: ListParamsComponent,
        ToggleTabsComponent: ToggleTabsComponent,
        ToggleTabsButtonComponent: ToggleTabsButtonComponent,
        ToggleTabsBodyComponent: ToggleTabsBodyComponent,
        BlockNoteComponent: BlockNoteComponent,
        CrossLinkComponent: CrossLinkComponent,
    }
})