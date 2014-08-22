/**
 * Get a new selection by passing a date.
 * An optional shadow date can be passed as a “hook” for a range.
 * An optional boolean can be passed to wrap the date into an array.
 */
Pickadate.getNewSelection = function(value, hookedDate) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( attrs.allowMultiple ) {
        return pickadate.getNewMultipleSelection(value, hookedDate)
    }

    if ( attrs.allowRange ) {
        return pickadate.getNewRangeSelection(value, hookedDate)
    }

    return value
}