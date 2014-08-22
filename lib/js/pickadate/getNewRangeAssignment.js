/**
 * Get a new range date assignment to use for attributes.
 */
Pickadate.getNewRangeAssignment = function(range) {

    if ( range.length > 2 ) {
        throw new Error('A range can have a maximum of 2 dates; a lower and upper bound.')
    }

    range = range.map(ShadowDate)

    if ( range.length === 1 || range[0].compare(range[1]) ) {
        return [range[0]]
    }

    return range.sort(function(prev, current) {
        return prev.compare('greater', current) ? 1 : -1
    })
}