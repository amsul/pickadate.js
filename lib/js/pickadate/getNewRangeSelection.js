/**
 * Get a new range selection by passing a date.
 * An optional shadow date can be passed as a “hook” for a range.
 */
Pickadate.getNewRangeSelection = function(date, hookedDate) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( !attrs.allowRange ) {
        throw new Error('Range selections are not allowed.')
    }

    if ( !attrs.select || !hookedDate && attrs.select.length === 2 ) {
        return [date]
    }

    return [hookedDate || attrs.select[0], date]
}