/**
    @method setup
 */
Pickadate.setup = function() {

    var pickadate = this
    var attrs = pickadate.attrs

    pickadate._super()

    // Set the starting “today”.
    attrs.today = ShadowDate(true)

    // Set the starting limit dates.
    attrs.min = ShadowDate(attrs.min)
    attrs.max = ShadowDate(attrs.max)

    // Set the starting select.
    if ( attrs.select ) {
        attrs.select = pickadate.cloneSelection()
        attrs.highlight = pickadate.cloneLastSelection()
    }

    // Set the starting highlight.
    else if ( attrs.highlight ) {
        attrs.highlight = ShadowDate(attrs.highlight)
    }
    else {
        attrs.highlight = ShadowDate(attrs.today)
    }

    // Set the starting view.
    if ( attrs.view ) {
        attrs.view = ShadowDate(attrs.view, { setToTheFirst: true })
    }
    else {
        attrs.view = ShadowDate(attrs.highlight, { setToTheFirst: true })
    }

    // Whenever the select is assigned, format it accordingly.
    pickadate.on('assign:select.' + pickadate.id, function(event) {
        var value = event.value
        if ( value ) {
            event.value = pickadate.getNewAssignment(value)
        }
    })

    // Whenever the highlight is assigned, format it accordingly.
    pickadate.on('assign:highlight.' + pickadate.id, function(event) {
        var value = pickadate.nextEnabledDate(event.value)
        event.value = ShadowDate(value)
    })

    // Whenever the view is assigned, the date should be the month’s first.
    pickadate.on('assign:view.' + pickadate.id, function(event) {
        var value = event.value
        value = ShadowDate(value)
        event.value = ShadowDate([value.year, value.month, 1])
    })

    // Whenever the min/max is assigned, create a shadow date.
    pickadate.on('assign:min.' + pickadate.id + ' assign:max.' + pickadate.id, function(event) {
        event.value = ShadowDate(event.value)
    })

    // Whenever the highlight is updated, the view should be updated.
    pickadate.on('set:highlight.' + pickadate.id, function(event) {
        attrs.view = event.value
    })

    // Whenever the select is updated, the highlight should be updated.
    pickadate.on('set:select.' + pickadate.id, function(event) {
        var value = event.value
        if ( value ) {
            if ( attrs.allowMultiple && attrs.allowRange ) {
                var unit = value[value.length - 1]
                value = unit[unit.length - 1]
            }
            else if ( attrs.allowMultiple || attrs.allowRange ) {
                value = value[value.length - 1]
            }
            attrs.highlight = value
        }
    })

    // Whenever the min is updated, the highlight should be updated.
    pickadate.on('set:min.' + pickadate.id, function(event) {
        attrs.highlight = attrs.highlight
    })

    // Whenever the max is updated, the highlight should be updated.
    pickadate.on('set:max.' + pickadate.id, function(event) {
        attrs.highlight = attrs.highlight
    })

    // Whenever a selection is added/removed, re-set the select.
    pickadate.on('add:select.' + pickadate.id + ' remove:select.' + pickadate.id, function(event) {
        if ( attrs.allowMultiple || attrs.allowRange ) {
            attrs.select = event.value.length ? event.value : null
        }
    })

    return pickadate
}