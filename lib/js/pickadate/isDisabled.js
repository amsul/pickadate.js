/**
 * Check if a date is disabled.
 * Optionally, a “comparison” can be passed to scope the comparison.
 */
Pickadate.isDisabled = function(comparison, date) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( arguments.length < 2 ) {
        date = comparison
        comparison = ''
    }

    date = ShadowDate(date)

    // First, check if any disabled unit matches the date.
    if (isWithinDisabledCollection(attrs.disable, date)) {
        return true
    }

    // Next, check if it’s within the min/max range.
    if (
        attrs.min.compare('greater', date) ||
        attrs.max.compare('lesser', date)
    ) {
        return true
    }

    // Otherwise it’s not disabled.
    return false
}


function isWithinDisabledCollection(collection, date) {

    if ( !collection ) {
        return false
    }

    return collection.some(function(disabledUnit) {

        if (typeof disabledUnit == 'number') {
            // date.compare('day', disabledUnit)
            return date.day === disabledUnit
        }

        if (Array.isArray(disabledUnit)) {

            // If it’s a range, check if it contains the date.
            if (disabledUnit.length == 2) {
                console.log('TODO: check if date is within the range', disabledUnit)
                return
            }

            // Otherwise compare it as a date.
            return date.compare(disabledUnit)
        }

        console.log('TODO:', _.isTypeOf(disabledUnit))
        console.log('Compare against:', disabledUnit)
    })
}