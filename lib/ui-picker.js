(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'shadow'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        
        module.exports = factory(require('jquery'), require('shadow'));
    } else {
        // Browser globals (root is window)
        root.Picker = factory(root.$, root.shadow);
    }
}(this, function($, shadow) {

'use strict';

var el = shadow._.el
var $document = $(document)

/**
 * Construct a picker shadow object.
 *
 * @static
 * @class Picker
 * @extends shadow.DataElement
 */
var Picker = {
    name: 'Picker'
}

Picker.attrs = {
    opened: null
}
Picker.classNames = {
    host: '',
    opened: '--opened',
    holder: 'holder',
    frame: 'frame',
    wrap: 'wrap',
    box: 'box'
}
Picker.classNamesPrefix = 'picker'
/**
    Create an instance of a picker object.

    @static
    @method create
    @param {Object} options Options for the element’s prototype.
    @return {Picker} An instance of the picker element.
 */
Picker.create = function(options) {

    var picker = this._super(options)
    var classes = picker.classNames
    var attrs = picker.attrs

    // Setup the states of the host element.
    var $host = picker.$host.addClass(classes.host)
    picker.on('set:opened.' + picker.id, function(event) {
        var value = event.value
        $host.toggleClass(classes.opened, value)
        if ( value && value != 'always' ) {
            bindDocumentClickToClose(picker)
        }
        else {
            $document.off('click.' + picker.id)
        }
    })

    // If start’s opened, trigger it open.
    if ( attrs.opened ) {
        attrs.opened = attrs.opened
    }

    // Bind the open/close triggers.
    var eventNames = 'click.' + picker.id + ' focusin.' + picker.id
    picker.$el.on(eventNames, function() {
        picker.open()
    })
    if ( picker.$el[0] !== picker.$host[0] ) {
        picker.$host.on(eventNames, function() {
            picker.open()
        })
    }

    return picker
}


/**
 * When the document is clicked, close the picker.
 */
function bindDocumentClickToClose(picker) {

    var pickerEl = picker.$el[0]
    var pickerHost = picker.$host[0]

    $document.on('click.' + picker.id, function(event) {
        var target = event.target
        if (
            pickerEl !== target &&
            pickerHost !== target &&
            !pickerEl.contains(target) &&
            !pickerHost.contains(target)
        ) {
            picker.close()
        }
    })
}
/**
 * Open & close the picker.
 */
Picker.open = function() {
    if ( !this.attrs.opened ) this.attrs.opened = true
}
Picker.close = function() {
    if ( this.attrs.opened ) this.attrs.opened = false
}
Picker.toggle = function() {
    this.attrs.opened = !this.attrs.opened
}
/**
 * Build out the templating for the picker.
 */
Picker.template = function() {

    var picker = this
    var classes = picker.classNames

    // Create the nodes that contain the content.
    var pickerHolder = el(classes.holder,
        el(classes.frame,
            el(classes.wrap,
                el(classes.box,
                    picker.content)
                )
            )
        )

    var frag = document.createDocumentFragment()
    frag.appendChild(pickerHolder)
    return frag
}

Picker = shadow.DataElement.extend(Picker)

return Picker

}));
