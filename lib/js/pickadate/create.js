/**
    Create an instance of a pickadate object.

    @static
    @method create
    @param {Object} options Options for the element’s prototype.
    @return {Pickadate} An instance of the pickadate element.
 */
Pickadate.create = function(options) {

    var pickadate = this._super(options)
    var attrs = pickadate.attrs

    pickadate.$host.on('mousedown.' + pickadate.id, '[data-select]', function(event) {

        // Prevent caret selection from occurring.
        event.preventDefault()

        // Grab the date to set.
        var originalDate = ShadowDate($(event.target).data('select'))

        // Keep a reference to this original date.
        var currentDate = originalDate

        // Set the initial selection.
        attrs.select = pickadate.getNewSelection(originalDate)

        // Update the previous date and update the selection.
        function updateSelection(newDate) {
            currentDate = newDate
            attrs.select = pickadate.getNewSelection(newDate, originalDate)
        }

        // Update the selection when moused over. If it’s over a different month,
        // add a pause before going to yet another different month.
        var timeout
        pickadate.$host.on('mouseenter.' + pickadate.id, '[data-select]', function(event) {
            var newDate = ShadowDate($(event.target).data('select'))
            if ( currentDate.month !== newDate.month ) {
                if ( timeout === undefined ) {
                    timeout = setTimeout(function() {
                        timeout = clearTimeout(timeout)
                    }, 1000)
                    updateSelection(newDate)
                }
            }
            else if ( !currentDate.compare(newDate) ) {
                updateSelection(newDate)
            }
        })

        $document.on('mouseup.' + pickadate.id, function(event) {
            pickadate.$host.off('mouseenter.' + pickadate.id, '[data-select]')
            $document.off('mouseup.' + pickadate.id)
        })

    })

    // Bind updating the highlight when clicked.
    pickadate.$host.on('click', '[data-highlight]', function(event) {
        var target = event.target
        var value = $(target).data('highlight')
        attrs.highlight = ShadowDate(value)
        if ( attrs.show == 'years' ) {
            attrs.show = 'months'
        }
        else {
            attrs.show = null
        }
    })

    return pickadate
}