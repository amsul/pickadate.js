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