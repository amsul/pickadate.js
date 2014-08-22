/**
 * Checks if a date is disabled and then returns the next enabled one.
 */
Pickadate.nextEnabledDate = function(value) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( _.isTypeOf(value, 'date') ) {
        value = [value.getFullYear(), value.getMonth(), value.getDate()]
    }
    else if ( shadow.Date.isClassOf(value) ) {
        value = value.value
    }

    if ( attrs.min.compare('greater', value) ) {
        value = attrs.min.value
    }

    else if ( attrs.max.compare('lesser', value) ) {
        value = attrs.max.value
    }

    var safety = 100
    var year = value[0]
    var month = value[1]
    var date = value[2]
    var targetDate = new Date(year, month, date)

    month = (month + 12) % 12

    while ( safety && targetDate.getMonth() !== month ) {

        if ( !safety ) throw 'fell into infinite loop..'
        safety -= 1

        date -= 1
        targetDate = new Date(year, month, date)
    }

    return targetDate
}