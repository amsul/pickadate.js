define(function(require) {

    'use strict';

    var Em = require('ember')
    var marked = require('marked')
    var hljs = require('hljs')

    Em.View.reopen({
        didInsertElement: function() {
            this._super()
            var $pre = this.$().find('pre')
            if ( $pre.length ) {
                $pre.each(function() {
                    var pre = this
                    var codeBlock = pre.children[0]
                    var content = codeBlock.textContent
                    var language = codeBlock.className.replace(/^lang-/, '')
                    if ( !language ) {
                        console.log(pre)
                        throw new Error('Need the language name to correctly syntax highlight.')
                    }
                    pre.classList.add('hljs')
                    var highlight = hljs.highlight(language, content)
                    codeBlock.innerHTML = highlight.value
                })
            }
        }
    })

    var MarkdownView = Em.View.extend({
        classNames: ['is-block'],
        createTemplate: function() {
            var content = this.get('content')
            if ( content ) {
                content = marked(content)
                var div = document.createElement('div')
                div.innerHTML = content
                content = div.innerHTML
            }
            else {
                content = ''
            }
            var template = Em.Handlebars.compile(content)
            this.set('template', template)
        }.on('init'),
        updateTemplate: function() {
            this.createTemplate()
            this.rerender()
        }.observes('content')
    })

    Em.Handlebars.helper('md', MarkdownView)

    return {
        MarkdownView: MarkdownView,
    }
})