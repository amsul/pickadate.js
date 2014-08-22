/**
 * Get a new multiple date assignment to use for attributes.
 */
Pickadate.getNewMultipleAssignment = function(collection) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( attrs.allowRange ) {
        console.log('todo');
        return /*collection.map(function(unit) {
            console.log(unit);
            return pickadate.getNewRangeAssignment(unit)
        })*/
    }

    return collection.map(ShadowDate).sort(function(prev, current) {
        return prev.compare('greater', current) ? 1 : -1
    })
}