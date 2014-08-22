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

        var comparator = function(unit, loopedUnit) {
            return loopedUnit.compare(unit)
        }

        if ( attrs.allowRange ) {
            console.log('todo');
            return
        }

        else if ( _.isWithin(attrs.select, date, comparator) ) {
            return attrs.select
        }

        var selections = attrs.select.slice(0)
        selections.push(date)

        return selections
    }

    return attrs.allowRange ? [[date]] : [date]
}