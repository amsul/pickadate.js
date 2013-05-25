
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
    ok( this.picker.$root.find( '.' + $.fn.pickadate.defaults.klass.table + ' [data-pick]' ).length === 42, '42 selectables dates' )
})

test( 'Properties', function() {

    var picker = this.picker,
        today = new Date()

    today.setHours( 0, 0, 0, 0 )

    strictEqual( picker.get( 'min' ).pick, -Infinity, 'Default “min” is -Infinity' )
    strictEqual( picker.get( 'max' ).pick, Infinity, 'Default “max’ is +Infinity' )
    strictEqual( picker.get( 'now' ).pick, today.getTime(), 'Default “now” is ' + picker.get( 'now', 'yyyy/mm/dd' ) )
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), 'Default “select” is “now”' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), 'Default “highlight” is “select”' )
    strictEqual( picker.get( 'view' ).pick, today.setDate( 1 ), 'Default “view” is ' + picker.get( 'view', 'yyyy/mm/dd' ) )
})

test( 'First weekday', function() {

    var picker = this.picker,
        $input = picker.$node

    strictEqual( picker.$root.find( '.' + $.fn.pickadate.defaults.klass.weekdays ).first().text(), $.fn.pickadate.defaults.weekdaysShort[0], 'Sunday is first day' )

    picker.stop().$node.pickadate({ firstDay: 1 })
    strictEqual( $input.pickadate( 'picker' ).$root.find( '.' + $.fn.pickadate.defaults.klass.weekdays ).first().text(), $.fn.pickadate.defaults.weekdaysShort[1], 'Monday is first day' )

    picker.set( 'select', [ 2013, 8, 14 ] )
    ok( picker.$root.find( 'td' ).first().text() === '1', 'Months starting on Sunday shift back a week' )
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
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'highlight', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    deepEqual( picker.get( 'highlight' ).obj, playdate, '`highlight` using an array: ' + playdate )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'highlight', playdate )
    deepEqual( picker.get( 'highlight' ).obj, playdate, '`highlight` using a JS date object: ' + playdate )
    strictEqual( picker.get( 'view', 'yyyy/mm/dd' ), picker.get( 'highlight', 'yyyy/mm/01' ), '`view` updated: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
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
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
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
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
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
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
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
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` unaffected' )

    playdate.setMonth( today.getMonth() )
    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using positive numbers
    picker.set( 'min', 40 )
    playdate.setDate( today.getDate() + 40 )
    deepEqual( picker.get( 'min' ).obj, playdate, '`min` using a positive number: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'min', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    deepEqual( picker.get( 'min' ).obj, playdate, '`min` using an array: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() + 40 )
    picker.set( 'min', playdate )
    deepEqual( picker.get( 'min' ).obj, playdate, '`min` using a JS date object: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )
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
    deepEqual( picker.get( 'select' ).obj, today, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )

    // Using `false`
    picker.set( 'min', false )
    deepEqual( picker.get( 'min' ).obj, -Infinity, '`min` using `false`: ' + -Infinity )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ).obj, today, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'max' ).pick, Infinity, '`max` unaffected' )
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
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` unaffected' )

    playdate.setMonth( today.getMonth() )
    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using negative numbers
    picker.set( 'max', -40 )
    playdate.setDate( today.getDate() - 40 )
    deepEqual( picker.get( 'max' ).obj, playdate, '`max` using a negative number: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'max' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using arrays
    playdate.setDate( playdate.getDate() - 40 )
    picker.set( 'max', [playdate.getFullYear(),playdate.getMonth(),playdate.getDate()] )
    deepEqual( picker.get( 'max' ).obj, playdate, '`max` using an array: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'max' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` updated' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using JavaScript date objects
    playdate.setDate( playdate.getDate() - 40 )
    picker.set( 'max', playdate )
    deepEqual( picker.get( 'max' ).obj, playdate, '`max` using a JS date object: ' + playdate )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'max' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` updated' )
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
    deepEqual( picker.get( 'select' ).obj, today, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )

    // Using `false`
    picker.set( 'max', false )
    deepEqual( picker.get( 'max' ).obj, Infinity, '`max` using `false`: ' + Infinity )
    deepEqual( picker.get( 'now' ).obj, today, '`now` unaffected' )
    deepEqual( picker.get( 'select' ).obj, today, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).obj, playdate, '`view` unaffected' )
    strictEqual( picker.get( 'value' ), '', '`value` unaffected' )
    deepEqual( picker.get( 'min' ).pick, -Infinity, '`min` unaffected' )
})

test( '`disable` and `enable` using integers', function() {

    var today = new Date(),
        disableCollection = [1,4,7],
        picker = this.picker,
        $root = picker.$root

    today.setHours(0,0,0,0)

    picker.set( 'disable', disableCollection )

    if ( disableCollection.indexOf( today.getDay() + 1 ) > -1 ) {
        notDeepEqual( picker.get( 'select' ), picker.get( 'now' ), 'Shifted disabled `select`: ' + picker.get( 'select' ).obj )
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
    deepEqual( picker.get( 'disable' ), [4,7], 'Disabled time removed from collection' )

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

    var now = new Date()
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth(),
        disableCollection = [ [nowYear,nowMonth,1],[nowYear,nowMonth,17],[nowYear,nowMonth,25] ],
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
    deepEqual( picker.get( 'disable' ), [ [nowYear,nowMonth,1],[nowYear,nowMonth,25] ], 'Disabled date removed from collection' )

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
    deepEqual( picker.get( 'disable' ), [ [nowYear,nowMonth,1],[nowYear,nowMonth,25] ], 'Disabled collection `enable` flipped' )

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
    deepEqual( picker.get( 'disable' ), [ [nowYear,nowMonth,1],[nowYear,nowMonth,25] ], 'Disabled collection `disable` flipped' )

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
        interval = 86400000,
        monthStartDay = viewsetObject.day,
        monthEndDate = new Date( viewsetObject.year, viewsetObject.month + 1, 0 ).getDate()

    for ( var i = monthStartDay; i < monthStartDay + monthEndDate; i += 1 ) {
        $root.find( '.' + $.fn.pickadate.defaults.klass.day ).eq( i ).click()
        ok( picker.get( 'select' ).pick === viewsetObject.pick + ( i - monthStartDay ) * interval, 'Selected ' + picker.get( 'select', 'yyyy/mm/dd' ) )
        ok( picker.get( 'value' ) === picker.get( 'select', $.fn.pickadate.defaults.format ), 'Input value updated to ' + picker.get( 'value' ) )
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
    deepEqual( picker.get( 'highlight' ).obj, playdate, 'Previous month: ' + playdate )
    deepEqual( picker.get( 'select' ).obj, today, 'Select unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, 'View updated' )

    $root.find( '.' + $.fn.pickadate.defaults.klass.navNext ).click()
    $root.find( '.' + $.fn.pickadate.defaults.klass.navNext ).click()
    playdate.setMonth( today.getMonth() + 1 )
    playdate.setDate( today.getDate() )
    deepEqual( picker.get( 'highlight' ).obj, playdate, 'Next month: ' + playdate )
    deepEqual( picker.get( 'select' ).obj, today, 'Select unaffected' )

    playdate.setDate( 1 )
    deepEqual( picker.get( 'view' ).obj, playdate, 'View updated' )
})

test( 'Today', function() {

    var picker = this.picker

    picker.$root.find( '.' + $.fn.pickadate.defaults.klass.buttonToday ).click()
    ok( picker.get( 'value' ) === picker.get( 'select', $.fn.pickadate.defaults.format ), 'Value set to today' )
})

test( 'Clear', function() {

    var picker = this.picker

    picker.set( 'select', new Date() )
    ok( picker.get( 'value' ) === picker.get( 'select', $.fn.pickadate.defaults.format ), 'Value updated' )

    picker.$root.find( '.' + $.fn.pickadate.defaults.klass.buttonClear ).click()
    ok( picker.get( 'value' ) === '', 'Value cleared' )
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
        $input = picker.$node,
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
        $input = picker.$node,
        playdate = new Date()

    // Open the picker
    picker.open()

    // Down
    for ( var i = 0; i < 10; i += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 40 })
        playdate.setDate( playdate.getDate() + 7 )
        ok( picker.get( 'highlight' ).date === playdate.getDate(), 'Keyed "down" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        ok( picker.get( 'view' ).month === picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }

    // Up
    for ( var j = 0; j < 10; j += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 38 })
        playdate.setDate( playdate.getDate() - 7 )
        ok( picker.get( 'highlight' ).date === playdate.getDate(), 'Keyed "up" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        ok( picker.get( 'view' ).month === picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }

    // Left
    for ( var k = 0; k < 10; k += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 37 })
        playdate.setDate( playdate.getDate() - 1 )
        ok( picker.get( 'highlight' ).date === playdate.getDate() && picker.get( 'highlight' ).day === playdate.getDay(), 'Keyed "left" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        ok( picker.get( 'view' ).month === picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }

    // Right
    for ( var l = 0; l < 10; l += 1 ) {

        $input.trigger({ type: 'keydown', keyCode: 39 })
        playdate.setDate( playdate.getDate() + 1 )
        ok( picker.get( 'highlight' ).date === playdate.getDate() && picker.get( 'highlight' ).day === playdate.getDay(), 'Keyed "right" to: ' + picker.get( 'highlight', 'yyyy/mm/dd' ) )
        ok( picker.get( 'view' ).month === picker.get( 'highlight' ).month, 'Updated "view" to: ' + picker.get( 'view', 'yyyy/mm/dd' ) )
    }
})




module( 'Date picker with a `value`', {
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




module( 'Date picker with a `data-value`', {
    setup: function() {
        $DOM.append( $INPUT.clone().data( 'value', '1988/08/14' ) )
        var $input = $DOM.find( 'input' ).pickadate({
            formatSubmit: 'yyyy/mm/dd'
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`data-value` to select, highlight, and view', function() {

    var picker = this.picker

    ok( picker._hidden, 'Has hidden input' )
    ok( picker._hidden.value === '1988/08/14', 'Hidden input value' )
    deepEqual( picker.get( 'select' ).obj, new Date(1988,7,14), 'Selects date' )
    deepEqual( picker.get( 'highlight' ).obj, new Date(1988,7,14), 'Highlights date' )
    deepEqual( picker.get( 'view' ).obj, new Date(1988,7,1), 'Viewsets date' )
})



