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
        data: Em.computed.alias('controllers.application.model'),

        to: null,
        section: null,
        fileLink: null,

        toSplit: function() {
            var to = this.get('to')
            if ( !to ) {
                throw new Error('A cross-link requires a "to", "section", or "fileLink" property.')
            }
            return to.split('#')
        }.property('to'),

        categoryName: Em.computed.alias('toSplit.0'),
        itemName: Em.computed.alias('toSplit.1'),

        categoryType: function() {
            var data = this.get('data')
            var categoryName = this.get('categoryName')
            if ( data.classes.findBy('name', categoryName) ) {
                return 'class'
            }
            if ( data.modules.findBy('name', categoryName) ) {
                return 'module'
            }
        }.property('data', 'categoryName'),

        itemType: function() {
            var section = this.get('section')
            if ( section ) {
                return section == 'attributes' ? 'attribute' :
                    section == 'properties' ? 'property' :
                    section == 'methods' ? 'method' :
                    section
            }
            var data = this.get('data')
            var itemName = this.get('itemName')
            var itemShortName = itemName.replace(/\(.+\)$/, '')
            var classitem = data.classitems.findBy('name', itemShortName)
            if ( !classitem ) {
                throw new Error('Nothing found to cross link to by the name of ' + itemName)
            }
            return classitem.itemtype
        }.property('section', 'data', 'itemName')

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