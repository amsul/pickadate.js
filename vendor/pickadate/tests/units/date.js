
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true,
    eqnull: true,
    eqeqeq: true
 */


var $DOM = $( '#qunit-fixture' ),
    $INPUT = $( '<input type=password>' )



/* ==========================================================================
   Date picker tests
   ========================================================================== */


module( 'Date picker setup', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickadate()
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Calendar stage', function() {
    strictEqual( this.picker.$root.find( '.' + $.fn.pickadate.defaults.klass.table + ' [data-pick]' ).length, 42, '42 selectables dates' )
})

test( 'Properties', function() {

    var picker = this.picker,
        today = new Date()

    today.setHours( 0, 0, 0, 0 )

    strictEqual( picker.get( 'min' ).pick, -Infinity, 'Default “min” is -Infinity' )
    strictEqual( picker.get( 'max' ).pick, Infinity, 'Default “max’ is +Infinity' )
    strictEqual( picker.get( 'now' ).pick, today.getTime(), 'Default “now” is ' + picker.get( 'now', 'yyyy/mm/dd' ) )
    deepEqual( picker.get( 'select' ), null, 'Default “select” is `null`' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), 'Default “highlight” is “now”' )
    strictEqual( picker.get( 'view' ).pick, today.setDate( 1 ), 'Default “view” is ' + picker.get( 'view', 'yyyy/mm/dd' ) )
})

test( 'First weekday', function() {

    var picker = this.picker,
        $input = picker.$node

    strictEqual( picker.$root.find( '.' + $.fn.pickadate.defaults.klass.weekdays ).first().text(), $.fn.pickadate.defaults.weekdaysShort[0], 'Sunday is first day' )

    picker.stop().$node.pickadate({ firstDay: 1 })
    strictEqual( $input.pickadate( 'picker' ).$root.find( '.' + $.fn.pickadate.defaults.klass.weekdays ).first().text(), $.fn.pickadate.defaults.weekdaysShort[1], 'Monday is first day' )

    picker.set( 'select', [ 2013, 8, 14 ] )
    strictEqual( picker.$root.find( 'td' ).first().text(), '1', 'Months starting on Sunday shift back a week' )
})

test( 'Formats', function() {

    var picker = this.picker,
        today = new Date(),
        leadZero = function( number ) {
            return ( number < 10 ? '0' : '' ) + number
        },
        formats = {
            d: function() {
                return '' + today.getDate()
            },
            dd: function() {
                return leadZero( today.getDate() )
            },
            ddd: function() {
                return $.fn.pickadate.defaults.weekdaysShort[ today.getDay() ]
            },
            dddd: function() {
                return $.fn.pickadate.defaults.weekdaysFull[ today.getDay() ]
            },
            m: function() {
                return '' + ( today.getMonth() + 1 )
            },
            mm: function() {
                return leadZero( ( today.getMonth() + 1 ) )
            },
            mmm: function() {
                return $.fn.pickadate.defaults.monthsShort[ today.getMonth() ]
            },
            mmmm: function() {
                return $.fn.pickadate.defaults.monthsFull[ today.getMonth() ]
            },
            yy: function() {
                return ( '' + today.getFullYear() ).slice(2)
            },
            yyyy: function() {
                return '' + today.getFullYear()
            }
        }

    today.setHours(0,0,0,0)

    ;([ 'd', 'dd', 'ddd', 'dddd', 'm', 'mm', 'mmm', 'mmmm', 'yy', 'yyyy' ]).forEach( function( format ) {
        var expect = formats[ format ]()
        deepEqual( picker.get( 'now', format ), expect, '`' + format + '`: ' + expect )
    })
})

module( 'Date picker setup', {
    teardown: function() {
        $DOM.empty()
    }
})

test( 'Editable', function() {

    $DOM.append( $INPUT.clone() ).append( $INPUT.clone() )

    var $input1 = $DOM.find( 'input' ).eq(0).pickadate()
    var $input2 = $DOM.find( 'input' ).eq(1).pickadate({
        editable: true
    })

    strictEqual( $input1[0].readOnly, true, 'Editable: false' )
    strictEqual( $input2[0].readOnly, false, 'Editable: true' )
})

test( 'Disable today with `min` as `true`', function() {

    $DOM.append( $INPUT.clone() )

    var today = new Date()
    var $input = $DOM.find( 'input' ).pickadate({
        min: true,
        disable: [ today ]
    })
    var picker = $input.pickadate('picker')
    var highlighted = picker.get('highlight')

    var playdate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    deepEqual(
        [playdate.getFullYear(), playdate.getMonth(), playdate.getDate()],
        [highlighted.year, highlighted.month, highlighted.date],
        'Able to disable today'
    )
})

test( 'Disable today with `max` as `true`', function() {

    $DOM.append( $INPUT.clone() )

    var today = new Date()
    var $input = $DOM.find( 'input' ).pickadate({
        max: true,
        disable: [ today ]
    })
    var picker = $input.pickadate('picker')
    var highlighted = picker.get('highlight')

    var playdate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
    deepEqual(
        [playdate.getFullYear(), playdate.getMonth(), playdate.getDate()],
        [highlighted.year, highlighted.month, highlighted.date],
        'Able to disable today'
    )
})




module( 'Date picker `set`', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickadate()
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`clear`', function() {

    var picker = this.picker

    strictEqual( picker.get('select'), null, 'Starts off without a selection' )

    picker.set('select', new Date())
    notStrictEqual( picker.get('select'), null, 'A selection has been added' )

    picker.clear()
    strictEqual( picker.get('select'), null, 'Clears out selection' )
})

test( '`select`', function() {

    var picker = this.picker,
        today = new Date(),
        playdate = new Date( today.getFullYear(), today.getMonth(), today.getDate() + 40 )

    today.setHours(0,0,0,0)

    // Using numbers
    picker.set( 'select', playdate.getTime() )
    deepEqual( picker.get( 'select' ).obj, playdate, '`select` using a number: ' + playdate )
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), '`value` matches' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated' )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'select', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    deepEqual( picker.get( 'select' ).obj, playdate, '`select` using an array: ' + playdate )
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), '`value` matches' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated' )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'select', playdate )
    deepEqual( picker.get( 'select' ).obj, playdate, '`select` using a JS date object: ' + playdate )
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), '`value` matches' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated' )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )
})

test( '`highlight`', function() {

    var picker = this.picker,
        today = new Date(),
        playdate = new Date( today.getFullYear(), today.getMonth(), today.getDate() + 40 )

    today.setHours(0,0,0,0)

    // Using numbers
    picker.set( 'highlight', playdate.getTime() )
    deepEqual( picker.get( 'highlight' ).obj, playdate, '`highlight` using a number: ' + playdate )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'highlight', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    deepEqual( picker.get( 'highlight' ).obj, playdate, '`highlight` using an array: ' + playdate )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'highlight', playdate )
    deepEqual( picker.get( 'highlight' ).obj, playdate, '`highlight` using a JS date object: ' + playdate )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )
})

test( '`view`', function() {

    var picker = this.picker,
        today = new Date(),
        playdate = new Date( today.getFullYear(), today.getMonth(), today.getDate() + 40 )

    today.setHours(0,0,0,0)

    // Using numbers
    picker.set( 'view', playdate.getTime() )
    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` using a number: ' + playdate )
    deepEqual( picker.get( 'highlight' ).obj, today, '`highlight` unaffected' )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'view', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` using a number: ' + playdate )
    deepEqual( picker.get( 'highlight' ).obj, today, '`highlight` unaffected' )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )


    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'view', playdate )
    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` using a JS date object: ' + playdate )
    deepEqual( picker.get( 'highlight' ).obj, today, '`highlight` unaffected' )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )
})

test( '`min`', function() {

    var picker = this.picker,
        today = new Date(),
        playdate = new Date( today.getFullYear(), today.getMonth(), today.getDate() - 40 )

    today.setHours(0,0,0,0)

    // Using negative numbers
    picker.set( 'min', -40 )
    deepEqual( picker.get( 'min' ).obj, playdate, '`min` using a negative number: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), '`highlight` unaffected' )

    playdate.setDate( 1 )
    playdate.setMonth( today.getMonth() )
    playdate.setFullYear( today.getFullYear() )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using positive numbers
    picker.set( 'min', 40 )
    playdate.setDate( today.getDate() + 40 )
    deepEqual( picker.get( 'min' ).obj, playdate, '`min` using a positive number: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'min', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    deepEqual( picker.get( 'min' ).obj, playdate, '`min` using an array: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'min', playdate )
    deepEqual( picker.get( 'min' ).obj, playdate, '`min` using a JS date object: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )
})

test( '`min` using booleans', function() {

    var picker = this.picker,
        today = new Date(),
        playdate = new Date( today.getFullYear(), today.getMonth(), 1 )

    today.setHours(0,0,0,0)

    // Using `true`
    picker.set( 'min', true )
    deepEqual( picker.get( 'min' ).obj, today, '`min` using `true`: ' + today )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using `false`
    picker.set( 'min', false )
    deepEqual( picker.get( 'min' ).obj, -Infinity, '`min` using `false`: ' + -Infinity )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )
})

test( '`min` using strings', function() {

    var picker = this.picker

    var min = picker.get('min')
    strictEqual( min.pick, -Infinity, 'No `min` date' )

    picker.set( 'min', '8 January, 2013' )

    min = picker.get('min')
    deepEqual( [min.year, min.month, min.date], [2013, 0, 8], '`min` updated' )
})

test( '`max`', function() {

    var picker = this.picker,
        today = new Date(),
        playdate = new Date( today.getFullYear(), today.getMonth(), today.getDate() + 40 )

    today.setHours(0,0,0,0)

    // Using positive numbers
    picker.set( 'max', 40 )
    deepEqual( picker.get( 'max' ).obj, playdate, '`max` using a positive number: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), '`highlight` unaffected' )

    playdate.setYear( today.getFullYear() )
    playdate.setMonth( today.getMonth(), 1 )
    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using negative numbers
    picker.set( 'max', -40 )
    playdate.setDate( today.getDate() - 40 )
    deepEqual( picker.get( 'max' ).obj, playdate, '`max` using a negative number: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'max' ), '`highlight` updated' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() - 40 )
    picker.set( 'max', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    deepEqual( picker.get( 'max' ).obj, playdate, '`max` using an array: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'max' ), '`highlight` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() - 40 )
    picker.set( 'max', playdate )
    deepEqual( picker.get( 'max' ).obj, playdate, '`max` using a JS date object: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'max' ), '`highlight` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
})

test( '`max` using booleans', function() {

    var picker = this.picker,
        today = new Date(),
        playdate = new Date( today.getFullYear(), today.getMonth(), 1 )

    today.setHours(0,0,0,0)

    // Using `true`
    picker.set( 'max', true )
    deepEqual( picker.get( 'max' ).obj, today, '`max` using `true`: ' + today )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using `false`
    picker.set( 'max', false )
    deepEqual( picker.get( 'max' ).obj, Infinity, '`max` using `false`: ' + Infinity )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), null, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
})

test( '`max` using strings', function() {

    var picker = this.picker

    var max = picker.get('max')
    strictEqual( max.pick, Infinity, 'No `max` date' )

    picker.set( 'max', '8 January, 2013' )

    max = picker.get('max')
    deepEqual( [max.year, max.month, max.date], [2013, 0, 8], '`max` updated' )
})

test( '`disable` and `enable` using integers', function() {

    var today = new Date(),
        disableCollection = [1,4,7],
        picker = this.picker,
        $root = picker.$root

    today.setHours(0,0,0,0)

    picker.set( 'disable', disableCollection )

    if ( disableCollection.indexOf( today.getDay() + 1 ) > -1 ) {
        notDeepEqual( picker.get( 'highlight' ), picker.get( 'now' ), 'Shifted disabled `highlight`: ' + picker.get( 'highlight' ).obj )
    }

    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled dates added to collection' )

    $root.find( 'tr' ).each( function( indexRow, tableRow ) {
        $( tableRow ).find( '[data-pick]' ).each( function( indexCell, tableCell ) {
            if ( disableCollection.indexOf( indexCell + 1 ) > -1 ) {
                ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Disabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
            else {
                ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Enabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
        })
    })

    picker.set( 'enable', [1] )
    deepEqual( picker.get( 'disable' ), [4,7], 'Disabled date removed from collection' )

    $root.find( 'tr' ).each( function( indexRow, tableRow ) {
        $( tableRow ).find( '[data-pick]' ).each( function( indexCell, tableCell ) {
            if ( [4,7].indexOf( indexCell + 1 ) > -1 ) {
                ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Disabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
            else {
                ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Enabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
        })
    })

    picker.set( 'enable', 'flip' )
    deepEqual( picker.get( 'disable' ), [4,7], 'Disabled collection `enable` flipped' )
    strictEqual( picker.get( 'enable' ), -1, 'Inverted `enable`')

    $root.find( 'tr' ).each( function( indexRow, tableRow ) {
        $( tableRow ).find( '[data-pick]' ).each( function( indexCell, tableCell ) {
            if ( [4,7].indexOf( indexCell + 1 ) < 0 ) {
                ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Disabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
            else {
                ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Enabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
        })
    })

    picker.set( 'disable', 'flip' )
    deepEqual( picker.get( 'disable' ), [4,7], 'Disabled collection `disable` flipped' )
    strictEqual( picker.get( 'enable' ), 1, 'Inverted back `enable`')

    $root.find( 'tr' ).each( function( indexRow, tableRow ) {
        $( tableRow ).find( '[data-pick]' ).each( function( indexCell, tableCell ) {
            if ( [4,7].indexOf( indexCell + 1 ) > -1 ) {
                ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Disabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
            else {
                ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Enabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
        })
    })
})

test( '`disable` and `enable` using arrays', function() {

    var today = new Date(),
        nowYear = today.getFullYear(),
        nowMonth = today.getMonth(),
        disableCollection = [ [nowYear,nowMonth,1],[nowYear,nowMonth,25],[nowYear,nowMonth,17] ],
        picker = this.picker,
        viewday = picker.get( 'view' ).day,
        $root = picker.$root

    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled dates added to collection' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index === 1 || index === 17 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })

    picker.set( 'enable', [ [nowYear,nowMonth,17] ] )
    disableCollection = [ [nowYear,nowMonth,1],[nowYear,nowMonth,25] ]
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled date removed from collection' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index === 1 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })


    picker.set( 'enable', 'flip' )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled collection `enable` flipped' )
    deepEqual( picker.get( 'enable' ), -1, 'Base state disabled' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index !== 1 && index !== 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })


    picker.set( 'disable', 'flip' )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled collection `disable` flipped' )
    deepEqual( picker.get( 'enable' ), 1, 'Base state enabled' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index === 1 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })
})

test( '`disable` and `enable` using JS dates', function() {

    var now = new Date(),
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth(),
        disableCollection = [ new Date(nowYear,nowMonth,1), new Date(nowYear,nowMonth,17), new Date(nowYear,nowMonth,25) ],
        picker = this.picker,
        viewday = picker.get( 'view' ).day,
        $root = picker.$root


    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled dates added to collection' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index === 1 || index === 17 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })


    picker.set( 'enable', [ new Date(nowYear,nowMonth,17) ] )
    deepEqual( picker.get( 'disable' ), [ new Date(nowYear,nowMonth,1), new Date(nowYear,nowMonth,25) ], 'Disabled date removed from collection' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index === 1 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })


    picker.set( 'enable', 'flip' )
    deepEqual( picker.get( 'disable' ), [ new Date(nowYear,nowMonth,1), new Date(nowYear,nowMonth,25) ], 'Disabled collection `enable` flipped' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index !== 1 && index !== 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })


    picker.set( 'disable', 'flip' )
    deepEqual( picker.get( 'disable' ), [ new Date(nowYear,nowMonth,1), new Date(nowYear,nowMonth,25) ], 'Disabled collection `disable` flipped' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday + 1
        if ( index === 1 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })
})

test( '`disable` and `enable` using booleans', function() {

    var now = new Date(),
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth(),
        disableCollection = [ [nowYear,nowMonth,1],[nowYear,nowMonth,17],[nowYear,nowMonth,25] ],
        picker = this.picker,
        $root = picker.$root


    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled dates added to collection' )

    picker.set('disable', false)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )
    strictEqual( $root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 0, 'No dates disabled' )


    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled dates added to collection' )

    picker.set('disable', true)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )
    deepEqual( picker.get('enable'), -1, 'Disabled collection `enable` flipped' )
    strictEqual( $root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 42, 'All dates disabled' )


    picker.set( 'enable', 'flip' )
    deepEqual( picker.get('enable'), 1, 'Disabled collection `enable` flipped' )

    picker.set( 'disable', disableCollection )
    deepEqual( picker.get('disable'), disableCollection, 'Disabled dates added to collection' )


    picker.set('enable', true)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )
    strictEqual( $root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 0, 'No dates disabled' )


    picker.set( 'disable', disableCollection )
    deepEqual( picker.get('disable'), disableCollection, 'Disabled dates added to collection' )


    picker.set('enable', false)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )
    deepEqual( picker.get('enable'), -1, 'Disabled collection `enable` flipped' )
    strictEqual( $root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 42, 'All dates disabled' )
})

test( '`disable` and `enable` using ranges', function() {

    var picker = this.picker,
        $root = picker.$root,
        disableCollection, viewday

    picker.set( 'view', [2014,2,1] )
    viewday = picker.get( 'view' ).day + 1

    disableCollection = [ { from: [2014,2,4], to: [2014,2,14] } ]
    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled range' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday
        if ( index >= 2 && index <= 12 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })

    picker.set( 'enable', disableCollection )
    deepEqual( picker.get( 'disable' ), [], 'Cleared disabled range' )
    strictEqual( $root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 0, 'No dates disabled' )


    disableCollection = [ { from: new Date(2014,2,7), to: new Date(2014,2,17) } ]
    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled range updated' )

    $root.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - viewday
        if ( index >= 5 && index <= 15 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })

    picker.set( 'enable', disableCollection )
    deepEqual( picker.get( 'disable' ), [], 'Cleared disabled range' )
    strictEqual( $root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 0, 'No dates disabled' )
})

// test( '`disable` and `enable` using relative ranges', function() {
//
//     var picker = this.picker,
//         $root = picker.$root,
//         today = picker.get( 'now' ).obj,
//         yearToday = today.getFullYear(),
//         monthToday = today.getMonth(),
//         dateToday = today.getDate(),
//         backDay = [ yearToday, monthToday, dateToday - 10 ],
//         forwardDay = new Date( yearToday, monthToday, dateToday + 10 ),
//         disableCollection, index, $dates, disabledDate, previousMonth
//
//     disableCollection = [ { from: true, to: forwardDay } ]
//     picker.set( 'disable', disableCollection )
//     deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled range relative to today with date object' )
//
//     $dates = $root.find('.' + $.fn.pickadate.defaults.klass.disabled)
//     for ( index = 0, datesCount = $dates.length; index < datesCount; index += 1 ) {
//         disabledDate = +$dates[index].innerHTML
//         disabledDate = new Date(yearToday, monthToday, disabledDate)
//         ok( disabledDate >= today &&
//             disabledDate <= new Date(yearToday, monthToday, dateToday + 10),
//             'Date is disabled: ' + disabledDate
//         );
//     }
//
//     picker.set( 'enable', disableCollection )
//     deepEqual( picker.get( 'disable' ), [], 'Cleared disabled range' )
//     ok( !$root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 'No dates disabled' )
//
//     disableCollection = [ { from: backDay, to: true } ]
//     picker.set( 'disable', disableCollection )
//     deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled range relative to today with array' )
//
//     $dates = $root.find('.' + $.fn.pickadate.defaults.klass.disabled)
//     for ( index = 0, datesCount = $dates.length; index < datesCount; index += 1 ) {
//         disabledDate = +$dates[index].innerHTML
//         previousMonth = disabledDate > dateToday ? 1 : 0
//         disabledDate = new Date(yearToday, monthToday - previousMonth, disabledDate)
//         ok( disabledDate <= today &&
//             disabledDate >= new Date(yearToday, monthToday, dateToday - 10),
//             'Date is disabled: ' + disabledDate
//         );
//     }
//
//     picker.set( 'enable', disableCollection )
//     deepEqual( picker.get( 'disable' ), [], 'Cleared disabled range' )
//     ok( !$root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 'No dates disabled' )
//
//     disableCollection = [ { from: true, to: 10 } ]
//     picker.set( 'disable', disableCollection )
//     deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled range relative to today with positive integer' )
//
//     $dates = $root.find('.' + $.fn.pickadate.defaults.klass.disabled)
//     for ( index = 0, datesCount = $dates.length; index < datesCount; index += 1 ) {
//         disabledDate = +$dates[index].innerHTML
//         disabledDate = new Date(yearToday, monthToday, disabledDate)
//         ok( disabledDate >= today &&
//             disabledDate <= new Date(yearToday, monthToday, dateToday + 10),
//             'Date is disabled: ' + disabledDate
//         );
//     }
//
//     picker.set( 'enable', disableCollection )
//     deepEqual( picker.get( 'disable' ), [], 'Cleared disabled range' )
//     ok( !$root.find( '.' + $.fn.pickadate.defaults.klass.disabled ).length, 'No dates disabled' )
//
//     disableCollection = [ { from: -10, to: true } ]
//     picker.set( 'disable', disableCollection )
//     deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled range relative to today with negative integer' )
//
//     $dates = $root.find('.' + $.fn.pickadate.defaults.klass.disabled)
//     for ( index = 0, datesCount = $dates.length; index < datesCount; index += 1 ) {
//         disabledDate = +$dates[index].innerHTML
//         previousMonth = disabledDate > dateToday ? 1 : 0
//         disabledDate = new Date(yearToday, monthToday - previousMonth, disabledDate)
//         ok( disabledDate <= today &&
//             disabledDate >= new Date(yearToday, monthToday, dateToday - 10),
//             'Date is disabled: ' + disabledDate
//         );
//     }
// });

test( '`disable` and `enable` using overlapping ranges', function() {

    var picker = this.picker,
        $root = picker.$root,
        disableCollection

    picker.set( 'view', [2014,2,1] )

    picker.set( 'disable', [
        { from: [2014,2,4], to: [2014,2,28] }
    ])
    picker.set( 'enable', [
        { from: [2014,2,14], to: [2014,2,18] }
    ])

    disableCollection = [
        { from: [2014,2,4], to: [2014,2,28] },
        { from: [2014,2,14], to: [2014,2,18], inverted: true }
    ]
    deepEqual( picker.get( 'disable' ), disableCollection, 'Inverted range within disabled range' )

    $dates = $root.find('.' + $.fn.pickadate.defaults.klass.disabled)
    for ( index = 0, datesCount = $dates.length; index < datesCount; index += 1 ) {
        disabledDate = +$dates[index].innerHTML
        ok( disabledDate >= 4 && disabledDate < 14 ||
            disabledDate > 18 && disabledDate <= 28,
            'Date is disabled: ' + disabledDate
        );
    }

    picker.set( 'disable', false )
    picker.set( 'disable', [
        { from: [2014,2,4], to: [2014,2,28] }
    ])
    picker.set( 'enable', [
        { from: [2014,2,1], to: [2014,2,14] }
    ])

    disableCollection = [
        { from: [2014,2,4], to: [2014,2,28] },
        { from: [2014,2,1], to: [2014,2,14], inverted: true }
    ]
    deepEqual( picker.get( 'disable' ), disableCollection, 'Inverted range before and within disabled range' )

    $dates = $root.find('.' + $.fn.pickadate.defaults.klass.disabled)
    for ( index = 0, datesCount = $dates.length; index < datesCount; index += 1 ) {
        disabledDate = +$dates[index].innerHTML
        ok( disabledDate >= 14 && disabledDate <= 28,
            'Date is disabled: ' + disabledDate
        );
    }

    picker.set( 'disable', false )
    picker.set( 'disable', [
        { from: [2014,2,4], to: [2014,2,20] }
    ])
    picker.set( 'enable', [
        { from: [2014,2,16], to: [2014,2,24] }
    ])

    disableCollection = [
        { from: [2014,2,4], to: [2014,2,20] },
        { from: [2014,2,16], to: [2014,2,24], inverted: true }
    ]
    deepEqual( picker.get( 'disable' ), disableCollection, 'Inverted range after and within disabled range' )

    $dates = $root.find('.' + $.fn.pickadate.defaults.klass.disabled)
    for ( index = 0, datesCount = $dates.length; index < datesCount; index += 1 ) {
        disabledDate = +$dates[index].innerHTML
        ok( disabledDate >= 4 && disabledDate < 16,
            'Date is disabled: ' + disabledDate
        );
    }
})

test( '`disable` and `enable` repeatedly', function() {

    var now = new Date(2014,3,6),
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth(),
        nowDate = now.getDate(),
        picker = this.picker,
        disabledCollection = [
            [nowYear,nowMonth,1],
            [nowYear,nowMonth,17],
            new Date(nowYear,nowMonth,25),
            1,
            { from: [nowYear,nowMonth,4], to: [nowYear,nowMonth,10] },
            { from: [nowYear,nowMonth,8], to: [nowYear,nowMonth,12] }
        ],
        collectionToEnable

    picker.set( 'disable', disabledCollection )
    picker.set( 'disable', disabledCollection )
    deepEqual( picker.get( 'disable' ), disabledCollection, 'Collection without duplicates' )

    collectionToEnable = [
        [nowYear,nowMonth,17],
        [nowYear,nowMonth,25],
        now,
        { from: [nowYear,nowMonth,8], to: [nowYear,nowMonth,12] }
    ]
    picker.set( 'enable', collectionToEnable )
    disabledCollection = [
        [nowYear,nowMonth,1],
        1,
        { from: [nowYear,nowMonth,4], to: [nowYear,nowMonth,10] },
        [nowYear,nowMonth,nowDate,'inverted'],
        { from: [nowYear,nowMonth,8], to: [nowYear,nowMonth,12], inverted: true }
    ]
    deepEqual( picker.get( 'disable' ), disabledCollection, 'Collection enabled various values' )

    picker.set( 'enable', collectionToEnable )
    deepEqual( picker.get( 'disable' ), disabledCollection, 'Collection without duplicates' )

    collectionToEnable = disabledCollection
    picker.set( 'enable', collectionToEnable )
    deepEqual( picker.get( 'disable' ), [], 'Collection cleared - including inverted range overlaps' )

    picker.set( 'enable', collectionToEnable )
    deepEqual( picker.get( 'disable' ), [], 'Collection kept clear' )
})




module( 'Date picker `set` beyond limits', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickadate({
            min: -40,
            max: 40
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`select`', function() {

    var picker = this.picker,
        today = new Date()

    today.setHours(0,0,0,0)

    picker.set( 'select', new Date( today.getFullYear(), today.getMonth(), today.getDate() - 60 ) )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), 'Able to not `select` beyond lower limit' )

    picker.set( 'select', new Date( today.getFullYear(), today.getMonth(), today.getDate() + 60 ) )
    deepEqual( picker.get( 'select' ), picker.get( 'max' ), 'Able to not `select` beyond upper limit' )
})

test( '`highlight`', function() {

    var picker = this.picker,
        today = new Date()

    today.setHours(0,0,0,0)

    picker.set( 'highlight', new Date( today.getFullYear(), today.getMonth(), today.getDate() - 60 ) )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), 'Able to not `highlight` beyond lower limit' )

    picker.set( 'highlight', new Date( today.getFullYear(), today.getMonth(), today.getDate() + 60 ) )
    deepEqual( picker.get( 'highlight' ), picker.get( 'max' ), 'Able to not `highlight` beyond upper limit' )
})

test( '`view`', function() {

    var picker = this.picker,
        today = new Date(),
        viewset,
        min = picker.get( 'min' ),
        max = picker.get( 'max' )

    today.setHours(0,0,0,0)

    picker.set( 'view', new Date( today.getFullYear(), today.getMonth(), today.getDate() - 60 ) )
    viewset = picker.get( 'view' )
    deepEqual( [viewset.year,viewset.month,viewset.date], [min.year,min.month,1], 'Able to not `view` beyond lower limit' )

    picker.set( 'view', new Date( today.getFullYear(), today.getMonth(), today.getDate() + 60 ) )
    viewset = picker.get( 'view' )
    deepEqual( [viewset.year,viewset.month,viewset.date], [max.year,max.month,1], 'Able to not `view` beyond upper limit' )
})




module( 'Date picker mouse events', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickadate()
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Select', function() {

    var picker = this.picker,
        $root = picker.$root,
        viewsetObject = picker.get( 'view' ),
        monthStartDay = viewsetObject.day,
        monthEndDate = new Date( viewsetObject.year, viewsetObject.month + 1, 0 ).getDate()

    for ( var i = monthStartDay; i < monthStartDay + monthEndDate; i += 1 ) {
        $root.find( '.' + $.fn.pickadate.defaults.klass.day ).eq( i ).click()
        strictEqual( picker.get( 'select' ).pick, new Date( viewsetObject.year, viewsetObject.month, viewsetObject.date + i - monthStartDay ).getTime(), 'Selected ' + picker.get( 'select', 'yyyy/mm/dd' ) )
        strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), 'Input value updated to ' + picker.get( 'value' ) )
    }
})

test( 'Highlight', function() {

    var picker = this.picker,
        $root = picker.$root,
        today = new Date(),
        playdate = new Date()

    today.setHours(0,0,0,0)
    playdate.setHours(0,0,0,0)

    $root.find( '.' + $.fn.pickadate.defaults.klass.navPrev ).click()
    playdate.setMonth( playdate.getMonth() - 1 )
    if ( playdate.getMonth() === today.getMonth() ) {
        playdate.setDate( 0 )
    }
    deepEqual( picker.get( 'highlight' ).obj, playdate, 'Previous month: ' + playdate )
    deepEqual( picker.get( 'select' ), null, 'Select unaffected' )

    var day = playdate.getDate()
    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, 'View updated' )

    $root.find( '.' + $.fn.pickadate.defaults.klass.navNext ).click()
    $root.find( '.' + $.fn.pickadate.defaults.klass.navNext ).click()
    playdate.setMonth( today.getMonth() + 1 )

    playdate = new Date(today.getFullYear(), today.getMonth() + 1, day)
    if ( playdate.getDate() < day ) {
        playdate.setDate( 0 )
    }
    deepEqual( picker.get( 'highlight' ).obj, playdate, 'Next month: ' + playdate )
    deepEqual( picker.get( 'select' ), null, 'Select unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, 'View updated' )
})

test( 'Today', function() {

    var picker = this.picker

    picker.open()

    picker.$root.find( '.' + $.fn.pickadate.defaults.klass.buttonToday ).click()
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), 'Value set to today' )
})

test( 'Clear', function() {

    var picker = this.picker

    picker.open()

    picker.set( 'select', new Date() )
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), 'Value updated' )

    picker.$root.find( '.' + $.fn.pickadate.defaults.klass.buttonClear ).click()
    strictEqual( picker.get( 'value' ), '', 'Value cleared' )
})

test( 'Closes upon selection', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-pick]').click()

    ok( !picker.get('open'), 'Closed after selection' )

})

test( 'Closes upon clearing', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-clear]').click()

    ok( !picker.get('open'), 'Closed after clearing' )

})

module( 'Date picker mouse events', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickadate({
            closeOnSelect: false,
            closeOnClear: false
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Remains open upon selection with option', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-pick]').click()

    ok( picker.get('open'), 'Remains open after selection' )

})

test( 'Closes upon clearing', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-clear]').click()

    ok( picker.get('open'), 'Remains open after clearing' )

})




module( 'Date picker keyboard events', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickadate()
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Select', function() {

    var picker = this.picker,
        $input = picker.$holder,
        playdate = new Date()

    playdate.setHours(0,0,0,0)

    for ( var i = 0; i < 10; i += 1 ) {

        // Open the picker.
        picker.open()

        // Update the playdate.
        playdate.setDate( playdate.getDate() + 10 )

        // Set the highlight.
        picker.set( 'highlight', playdate )

        // Keydown to select the highlighted item.
        $input.trigger({ type: 'keydown', keyCode: 13 })

        // Check if the select is the same as the highlight.
        deepEqual( picker.get( 'select' ), picker.get( 'highlight' ), 'Select updated to: ' + picker.get( 'select' ).obj )
    }
})

test( 'Highlight', function() {

    var picker = this.picker,
        $input = picker.$holder,
        playdate = new Date()

    // Open the picker
    picker.open()

    // Down
    for ( var i = 0; i < 10; i += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 40 })
        playdate.setDate( playdate.getDate() + 7 )
        strictEqual( picker.get( 'highlight' ).date, playdate.getDate(), 'Keyed "down" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        strictEqual( picker.get( 'view' ).month, picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }

    // Up
    for ( var j = 0; j < 10; j += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 38 })
        playdate.setDate( playdate.getDate() - 7 )
        strictEqual( picker.get( 'highlight' ).date, playdate.getDate(), 'Keyed "up" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        strictEqual( picker.get( 'view' ).month, picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }

    // Left
    for ( var k = 0; k < 10; k += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 37 })
        playdate.setDate( playdate.getDate() - 1 )
        ok( picker.get( 'highlight' ).date === playdate.getDate() && picker.get( 'highlight' ).day === playdate.getDay(), 'Keyed "left" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        strictEqual( picker.get( 'view' ).month, picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }

    // Right
    for ( var l = 0; l < 10; l += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 39 })
        playdate.setDate( playdate.getDate() + 1 )
        ok( picker.get( 'highlight' ).date === playdate.getDate() && picker.get( 'highlight' ).day === playdate.getDay(), 'Keyed "right" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        strictEqual( picker.get( 'view' ).month, picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }
})

test( 'Closes upon selection', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-pick]').focus()
    picker.$holder.trigger({ type: 'keydown', keyCode: 13 })

    ok( !picker.get('open'), 'Closed after selection' )

})

test( 'Closes upon clearing', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-clear]').focus()
    picker.$holder.trigger({ type: 'keydown', keyCode: 13 })

    ok( !picker.get('open'), 'Closed after clearing' )

})

module( 'Date picker keyboard events', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickadate({
            closeOnSelect: false,
            closeOnClear: false
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Remains open upon selection with option', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-pick]').focus()
    picker.$holder.trigger({ type: 'keydown', keyCode: 13 })

    ok( picker.get('open'), 'Remains open after selection' )

})

test( 'Closes upon clearing', function() {

    var picker = this.picker

    picker.open()

    ok( picker.get('open'), 'Opened to start off' )

    picker.$holder.find('[data-clear]').focus()
    picker.$holder.trigger({ type: 'keydown', keyCode: 13 })

    ok( picker.get('open'), 'Remains open after clearing' )

})



module( 'Date picker with a visible value', {
    setup: function() {
        $DOM.append( $INPUT.clone().val( '14 August, 1988' ) )
        var $input = $DOM.find( 'input' ).pickadate()
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`value` to select, highlight, and view', function() {
    var picker = this.picker
    ok( !picker._hidden, 'No hidden input' )
    deepEqual( picker.get( 'select' ).obj, new Date(1988,7,14), 'Selects date' )
    deepEqual( picker.get( 'highlight' ).obj, new Date(1988,7,14), 'Highlights date' )
    deepEqual( picker.get( 'view' ).obj, new Date(1988,7,1), 'Viewsets date' )
})


module( 'Date picker with a simple format', {
    setup: function() {
        $DOM.append( $INPUT.clone().val( '1988-08-14' ) )
        var $input = $DOM.find( 'input' ).pickadate({
            format: 'yyyy-mm-dd'
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`value` to select, highlight, and view', function() {
    var picker = this.picker
    ok( !picker._hidden, 'No hidden input' )
    deepEqual( picker.get( 'select' ).obj, new Date(1988,7,14), 'Selects date' )
    deepEqual( picker.get( 'highlight' ).obj, new Date(1988,7,14), 'Highlights date' )
    deepEqual( picker.get( 'view' ).obj, new Date(1988,7,1), 'Viewsets date' )
})




module( 'Date picker with a hidden value', {
    teardown: function() {
        $DOM.empty()
    }
})

test( '`value` to select, highlight, and view', function() {

    $DOM.append( $INPUT.clone().val( '14 August, 1988' ) )
    var $input = $DOM.find( 'input' ).pickadate({
        formatSubmit: 'yyyy/mm/dd'
    })
    var picker = $input.pickadate( 'picker' )

    ok( picker._hidden, 'Has hidden input' )
    strictEqual( picker._hidden.value, '1988/08/14', 'Hidden input value' )
    deepEqual( picker.get( 'select' ).obj, new Date(1988,7,14), 'Selects date' )
    deepEqual( picker.get( 'highlight' ).obj, new Date(1988,7,14), 'Highlights date' )
    deepEqual( picker.get( 'view' ).obj, new Date(1988,7,1), 'Viewsets date' )
})

test( '`data-value` to select, highlight, and view', function() {

    $DOM.append( $INPUT.clone().data( 'value', '1988/08/14' ) )
    var $input = $DOM.find( 'input' ).pickadate({
        formatSubmit: 'yyyy/mm/dd'
    })
    var picker = $input.pickadate( 'picker' )

    ok( picker._hidden, 'Has hidden input' )
    strictEqual( picker._hidden.value, '1988/08/14', 'Hidden input value' )
    deepEqual( picker.get( 'select' ).obj, new Date(1988,7,14), 'Selects date' )
    deepEqual( picker.get( 'highlight' ).obj, new Date(1988,7,14), 'Highlights date' )
    deepEqual( picker.get( 'view' ).obj, new Date(1988,7,1), 'Viewsets date' )
})

test( 'the pre-filled `value` selected is no longer "active"', function() {

    var $input = $( '<input type="text" value="14 August, 2014">' ).pickadate({
        formatSubmit: 'yyyy/mm/dd',
        min: [2015, 7, 14]
    })
    var picker = $input.pickadate( 'picker' )

    strictEqual( picker.get( 'value' ), '14 August, 2014', 'Sets the default value' )
    strictEqual( picker.get( 'valueSubmit' ), '2014/08/14', 'Sets the default value to submit' )

    var select = picker.get('select')
    deepEqual( [select.year, select.month, select.date], [2014, 7, 14], 'Sets the default select' )

})
