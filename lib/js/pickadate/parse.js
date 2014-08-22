/**
 * Parse a date into it’s attribute format.
 */
Pickadate.parse = function(string) {

    var pickadate = this
    var value = pickadate._super(string)

    if ( !value ) {
        return null
    }

    var attrs = pickadate.attrs
    var dict = pickadate.dict

    var parseUnit = function(unit) {
        var month
        if ( 'mmmm' in unit ) {
            month = dict.monthsFull.indexOf(unit.mmmm)
            if ( month < 0 ) {
                throw new Error('No month named “' + unit.mmmm + '” found.')
            }
        }
        else if ( 'mmm' in unit ) {
            month = dict.monthsShort.indexOf(unit.mmm)
            if ( month < 0 ) {
                throw new Error('No month named “' + unit.mmm + '” found.')
            }
        }
        return [
            ~~unit.yyyy,
            month !== undefined ? month :
                ~~('mm' in unit ? unit.mm : unit.m) - 1,
            ~~('dd' in unit ? unit.dd : unit.d)
        ]
    }

    if ( attrs.allowMultiple ) {
        console.log('todo');
        return
    }

    if ( attrs.allowRange ) {
        return value.map(parseUnit)
    }

    return parseUnit(value)
}