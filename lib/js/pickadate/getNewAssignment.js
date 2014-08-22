/**
 * Get a new date assignment to use for attributes.
 */
Pickadate.getNewAssignment = function(value) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( attrs.allowMultiple ) {
        return pickadate.getNewMultipleAssignment(value)
    }

    if ( attrs.allowRange ) {
        return pickadate.getNewRangeAssignment(value)
    }

    return ShadowDate(value)
}