/**
 * Clone the last date in a selection.
 */
Pickadate.cloneLastSelection = function(value) {
    var pickadate = this
    var attrs = pickadate.attrs
    value = value || attrs.select
    if ( attrs.allowMultiple ) {
        console.log('todo');
        console.log(attrs.select);
    }
    else if ( attrs.allowRange ) {
        return ShadowDate(value[value.length - 1])
    }
    return ShadowDate(value)
}