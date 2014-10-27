/**
 * Get a new mutiple selection by passing a date.
 * An optional shadow date can be passed as a “hook” for a range.
 */
Pickadate.getNewMultipleSelection = function(date, hookedDate) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( !attrs.allowMultiple ) {
        throw new Error('Multiple selections are not allowed.')
    }

    if ( attrs.select ) {

        var selections = attrs.select.slice(0)

        if ( attrs.allowRange ) {

            var lastRange = selections[selections.length - 1]

            if ( hookedDate && lastRange.length === 1 && hookedDate.compare(lastRange[0]) ) {
                selections[selections.length - 1] = [hookedDate, date]
                return selections
            }

            var newRange = pickadate.getNewRangeSelection(date, hookedDate)

            if ( hookedDate ) {
                selections[selections.length - 1] = newRange
                return selections
            }

            for ( var i = 0; i < selections.length; i++ ) {
                var range = selections[i]
                if ( date.compareRange(range) ) {
                    return selections
                }
            }

            console.log('todo:', 'check for overlapping ranges before pushing a new one')

            selections.push(newRange)

            return selections
        }

        var comparator = function(unit, loopedUnit) {
            return loopedUnit.compare(unit)
        }

        if ( _.isWithin(selections, date, comparator) ) {
            return selections
        }

        selections.push(date)

        return selections
    }

    return attrs.allowRange ? [[date]] : [date]
}