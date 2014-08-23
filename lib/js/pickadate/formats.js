Pickadate.formats = {
    d: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return value.date
    },
    dd: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return leadZero(value.date)
    },
    ddd: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        var date = ShadowDate([value.year, value.month, value.date])
        return this.dict.weekdaysShort[date.day]
    },
    dddd: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        var date = ShadowDate([value.year, value.month, value.date])
        return this.dict.weekdaysFull[date.day]
    },
    m: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return value.month + 1
    },
    mm: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return leadZero(value.month + 1)
    },
    mmm: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        return this.dict.monthsShort[value.month]
    },
    mmmm: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        return this.dict.monthsFull[value.month]
    },
    yyyy: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{4}/)
            return value && value[0]
        }
        return value.year
    }
}


/**
 * Add a leading zero for numbers below 9.
 */
function leadZero(number) {
    return (number > 9 ? '' : '0') + number
}