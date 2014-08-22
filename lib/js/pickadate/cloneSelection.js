/**
 * Clone a selection into shadow dates.
 */
Pickadate.cloneSelection = function(value) {
    var pickadate = this
    var attrs = pickadate.attrs
    value = value || attrs.select
    if ( attrs.allowMultiple ) {
        console.log('todo');
        return
    }
    if ( attrs.allowRange ) {
        return value.map(ShadowDate)
    }
    return ShadowDate(value)
}