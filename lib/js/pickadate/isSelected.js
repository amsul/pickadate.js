/**
 * Check if a date is selected.
 * Optionally, a “comparison” can be passed to scope the comparison.
 */
Pickadate.isSelected = function(comparison, date) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( !attrs.select ) {
        return false
    }

    if ( arguments.length < 2 ) {
        date = comparison
        comparison = ''
    }

    if ( attrs.allowMultiple ) {
        var comparator = function(unit, loopedUnit) {
            return loopedUnit.compare(comparison, unit)
        }
        if ( attrs.allowRange ) {
            console.log('todo');
            // for ( var i = 0; i < attrs.select.length; i++ ) {
            //     var range = attrs.select[i]
            //     if ( _.isWithin(range, date, comparator) ) {
            //         return true
            //     }
            // }
            return false
        }
        return _.isWithin(attrs.select, date, comparator)
    }

    else if ( attrs.allowRange ) {
        return ShadowDate(date).compareRange(comparison, attrs.select)
    }

    return attrs.select.compare(comparison, date)
}