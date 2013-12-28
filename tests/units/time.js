
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
   Time picker tests
   ========================================================================== */


module( 'Time picker setup', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickatime()
        this.picker = $input.pickatime( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Clock stage', function() {
    strictEqual( this.picker.$root.find( '[data-pick]' ).length, 48, '48 selectable times' )
})

test( 'Properties', function() {

    var picker = this.picker,
        today = new Date(),
        interval = picker.get( 'interval' ),
        nowMinutes = today.getHours() * 60 + today.getMinutes()

    strictEqual( interval, 30, 'Default interval is 30' )

    strictEqual( picker.get( 'min' ).pick, 0, 'Default “min” is midnight' )
    strictEqual( picker.get( 'max' ).pick, 1410, 'Default “max” is 23:30' )
    strictEqual( picker.get( 'now' ).pick, interval + nowMinutes - ( nowMinutes % interval ), 'Default “now” is: ' + picker.get( 'now', 'HH:i' ) )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), 'Default “select” is “min”' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'select' ), 'Default “highlight” is “select”' )
    deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), 'Default “view” is “highlight”' )
})

test( 'Formats', function() {

    var picker = this.picker,
        interval = $.fn.pickatime.defaults.interval,
        today = new Date(),
        minutes = today.getHours() * 60 + today.getMinutes(),
        leadZero = function( number ) {
            return ( number < 10 ? '0' : '' ) + number
        },
        toHours = function( mins ) {
            var hours = ~~( mins/60 ) % 12
            return hours ? hours : 12
        },
        formats = {
            h: function() {
                return '' + toHours( minutes )
            },
            hh: function() {
                return leadZero( toHours( minutes ) )
            },
            H: function() {
                return '' + ( ~~( minutes/60 ) % 24 )
            },
            HH: function() {
                return leadZero( ~~( minutes/60 ) % 24 )
            },
            i: function() {
                return leadZero( minutes%60 )
            },
            a: function() {
                return ~~( minutes/60 ) % 24 > 12 ? 'p.m.' : 'a.m.'
            },
            A: function() {
                return ~~( minutes/60 ) % 24 > 12 ? 'PM' : 'AM'
            }
        }

    minutes = interval + minutes - minutes % interval

    ;([ 'h', 'hh', 'H', 'HH', 'i', 'a', 'A' ]).forEach( function( format ) {
        var expect = formats[ format ]()
        deepEqual( picker.get( 'now', format ), expect, '`' + format + '`: ' + expect )
    })

})

module( 'Time picker setup', {
    teardown: function() {
        $DOM.empty()
    }
})

test( 'Editable', function() {

    $DOM.append( $INPUT.clone()).append( $INPUT.clone() )

    var $input1 = $DOM.find( 'input' ).eq(0).pickadate()
    var $input2 = $DOM.find( 'input' ).eq(1).pickadate({
        editable: true
    })

    strictEqual( $input1[0].readOnly, true, 'Editable: false' )
    strictEqual( $input2[0].readOnly, false, 'Editable: true' )
})




module( 'Time picker `set`', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickatime()
        this.picker = $input.pickatime( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`interval`', function() {

    var picker = this.picker,
        $root = picker.$root

    picker.set( 'interval', 120 )
    strictEqual( picker.get( 'interval' ), 120, '`interval` updated' )
    strictEqual( picker.get( 'min' ).pick % 120, 0, '`min` updated' )
    strictEqual( picker.get( 'max' ).pick % 120, 0, '`max` updated' )
    strictEqual( $root.find( '.' + $.fn.pickatime.defaults.klass.listItem ).length, 12, '12 selectable times' )

    picker.set( 'interval', 'lol' )
    strictEqual( picker.get( 'interval' ), 120, 'Interval unaffected by non-integer' )
})

test( '`select`', function() {

    var picker = this.picker

    // Using numbers
    picker.set( 'select', 180 )
    strictEqual( picker.get( 'select' ).pick, 180, '`select` using a number: ' + picker.get( 'select', 'HH:i' ) )
    strictEqual( picker.get( 'highlight' ).pick, 180, '`highlight` updated' )
    strictEqual( picker.get( 'view' ).pick, 180, '`view` updated' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )

    // Using JavaScript date objects
    var dateObject = new Date()
    dateObject.setHours(4,20)
    picker.set( 'select', dateObject )
    strictEqual( picker.get('select').pick, 270, '`select` using a JS date object: ' + picker.get( 'select', 'HH:i' ) )
    strictEqual( picker.get( 'highlight' ).pick, 270, '`highlight` updated' )
    strictEqual( picker.get( 'view' ).pick, 270, '`view` updated' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )

    // Using arrays
    picker.set( 'select', [9,0] )
    strictEqual( picker.get( 'select' ).pick, 540, '`select` using an array: ' + picker.get( 'select', 'HH:i' ) )
    strictEqual( picker.get( 'highlight' ).pick, 540, '`highlight` updated' )
    strictEqual( picker.get( 'view' ).pick, 540, '`view` updated' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )
})

test( '`highlight`', function() {

    var picker = this.picker

    // Using numbers
    picker.set( 'highlight', 180 )
    strictEqual( picker.get( 'highlight' ).pick, 180, '`highlight` using a number: ' + picker.get( 'highlight', 'HH:i' ) )
    deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), '`view` updated' )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )

    // Using JavaScript date objects
    var dateObject = new Date()
    dateObject.setHours(4,20)
    picker.set( 'highlight', dateObject )
    strictEqual( picker.get('highlight').pick, 270, '`highlight` using a JS date object: ' + picker.get( 'highlight', 'HH:i' ) )
    deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), '`view` updated' )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )

    // Using arrays
    picker.set( 'highlight', [9,0] )
    strictEqual( picker.get( 'highlight' ).pick, 540, '`highlight` using an array: ' + picker.get( 'highlight', 'HH:i' ) )
    deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), '`view` updated' )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )
})

test( '`view`', function() {

    var picker = this.picker

    // Using numbers
    picker.set( 'view', 180 )
    strictEqual( picker.get( 'view' ).pick, 180, '`view` using a number: ' + picker.get( 'view', 'HH:i' ) )
    strictEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )

    // Using JavaScript date objects
    var dateObject = new Date()
    dateObject.setHours(4,20)
    picker.set( 'view', dateObject )
    strictEqual( picker.get('view').pick, 270, '`view` using a JS date object: ' + picker.get( 'view', 'HH:i' ) )
    strictEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )

    // Using arrays
    picker.set( 'view', [9,0] )
    strictEqual( picker.get( 'view' ).pick, 540, '`view` using an array: ' + picker.get( 'view', 'HH:i' ) )
    strictEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )
})

test( '`min` using integers', function() {

    var picker = this.picker,
        interval = 30

    // Using negative numbers
    picker.set( 'min', -3 )
    strictEqual( picker.get( 'min' ).pick, picker.get( 'now' ).pick + ( interval * -3 ), '`min` using a negative number: ' + picker.get( 'min', 'HH:i' ) )

    if ( picker.get( 'min' ).pick > 0 ) {
        deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
        deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )
        deepEqual( picker.get( 'view' ), picker.get( 'min' ), '`view` updated' )
    }
    else {
        strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
        strictEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
        strictEqual( picker.get( 'view' ).pick, 0, '`view` unaffected' )
    }
    strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )


    // Using positive numbers
    picker.set( 'min', 3 )
    strictEqual( picker.get( 'min' ).pick, picker.get( 'now' ).pick + ( interval * 3 ), '`min` using a positive number: ' + picker.get( 'min', 'HH:i' ) )

    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )
    deepEqual( picker.get( 'view' ), picker.get( 'min' ), '`view` updated' )

    if ( picker.get( 'min' ).pick > 1410 ) {
        strictEqual( picker.get( 'max' ).pick, 1410 + 1440, '`max` updated' )
    }
    else {
        strictEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )
    }
})

test( '`min` using booleans', function() {

    var picker = this.picker

    // Boolean true
    picker.set( 'min', true )
    deepEqual( picker.get( 'min' ), picker.get( 'now' ), '`min` using `true`: ' + picker.get( 'min', 'HH:i' ) )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )
    deepEqual( picker.get( 'view' ), picker.get( 'min' ), '`view` updated' )
    deepEqual( picker.get( 'max' ).time, 1410, '`max` unaffected' )

    // Boolean false
    picker.set( 'min', false )
    strictEqual( picker.get( 'min' ).time, 0, '`min` using `false`: ' + picker.get( 'min', 'HH:i' ) )
    deepEqual( picker.get( 'select' ), picker.get( 'now' ), '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'now' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ), picker.get( 'now' ), '`view` unaffected' )
    deepEqual( picker.get( 'max' ).time, 1410, '`max` unaffected' )
})

test( '`min` using arrays', function() {

    var picker = this.picker

    // Using arrays
    picker.set( 'min', [2,0] )
    strictEqual( picker.get( 'min' ).pick, 120, '`min` using an array: ' + picker.get( 'min', 'HH:i' ) )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )
    deepEqual( picker.get( 'view' ), picker.get( 'min' ), '`view` updated' )
    deepEqual( picker.get( 'max' ).pick, 1410, '`max` unaffected' )
})

test( '`min` using JS dates', function() {

    var picker = this.picker

    // Using JavaScript date objects
    var dateObject = new Date()
    dateObject.setHours(4,20)
    picker.set( 'min', dateObject )
    strictEqual( picker.get( 'min' ).pick, 260, '`min` using an array: ' + picker.get( 'min', 'HH:i' ) )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` updated' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` updated' )
    deepEqual( picker.get( 'view' ), picker.get( 'min' ), '`view` updated' )
    deepEqual( picker.get( 'max' ).pick, 1400, '`max` updated' )
})

test( '`max` using integers', function() {

    var picker = this.picker,
        interval = 30

    // Using positive numbers
    picker.set( 'max', 3 )
    strictEqual( picker.get( 'max' ).pick, picker.get( 'now' ).pick + ( interval * 3 ), '`max` using a positive number: ' + picker.get( 'max', 'HH:i' ) )

    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ), picker.get( 'min' ), '`view` unaffected' )


    // Using negative numbers
    picker.set( 'max', -3 )

    var maxPickTime = picker.get( 'now' ).pick + ( interval * -3 )
    // If it's less than `min` time, add a day.
    maxPickTime += maxPickTime < 0 ? 1440 : 0
    strictEqual( picker.get( 'max' ).pick, maxPickTime, '`max` using a negative number: ' + picker.get( 'max', 'HH:i' ) )

    if ( picker.get( 'max' ).pick < 0 ) {
        notStrictEqual( picker.get( 'min' ).pick, 0, '`min` updated' )
        deepEqual( picker.get( 'select' ), picker.get( 'max' ), '`select` updated' )
        deepEqual( picker.get( 'highlight' ), picker.get( 'max' ), '`highlight` updated' )
        deepEqual( picker.get( 'view' ), picker.get( 'max' ), '`view` updated' )
    }
    else {
        strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
        deepEqual( picker.get( 'select' ), picker.get( 'min' ), '`select` unaffected' )
        deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), '`highlight` unaffected' )
        deepEqual( picker.get( 'view' ), picker.get( 'min' ), '`view` unaffected' )
    }
})

test( '`max` using booleans', function() {

    var picker = this.picker

    // Boolean true
    picker.set( 'max', true )
    deepEqual( picker.get( 'max' ), picker.get( 'now' ), '`max` using `true`: ' + picker.get( 'max', 'HH:i' ) )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
    strictEqual( picker.get( 'view' ).pick, 0, '`view` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )

    // Boolean false
    picker.set( 'max', false )
    deepEqual( picker.get( 'max' ).pick, 1410, '`max` using `false`: ' + picker.get( 'max', 'HH:i' ) )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
    strictEqual( picker.get( 'view' ).pick, 0, '`view` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
})

test( '`max` using arrays', function() {

    var picker = this.picker

    // Using arrays
    picker.set( 'max', [14,30] )
    strictEqual( picker.get( 'max' ).pick, 870, '`max` using an array: ' + picker.get( 'max', 'HH:i' ) )
    strictEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    strictEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
    strictEqual( picker.get( 'view' ).pick, 0, '`view` unaffected' )
    strictEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
})

test( '`max` using JS dates', function() {

    var picker = this.picker

    // Using JavaScript date objects
    var dateObject = new Date()
    dateObject.setHours(16,20)
    picker.set( 'max', dateObject )
    strictEqual( picker.get( 'max' ).pick, 960, '`max` using an array: ' + picker.get( 'max', 'HH:i' ) )
    deepEqual( picker.get( 'select' ).pick, 0, '`select` unaffected' )
    deepEqual( picker.get( 'highlight' ).pick, 0, '`highlight` unaffected' )
    deepEqual( picker.get( 'view' ).pick, 0, '`view` unaffected' )
    deepEqual( picker.get( 'min' ).pick, 0, '`min` unaffected' )
})

test( '`disable` and `enable` using integers', function() {

    var disableCollection = [1,4,7],
        picker = this.picker,
        $root = picker.$root

    picker.set( 'disable', disableCollection )

    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled times added' )

    $root.find( '[data-pick]' ).each( function() {
        var $this = $( this ),
            hour = ~~( $this.data('pick')/60 )
        if ( disableCollection.indexOf( hour ) > -1 ) {
            ok( $this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Disabled time: ' + $this.html() )
        }
        else {
            ok( !$this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Enabled time: ' + $this.html() )
        }
    })

    picker.set( 'enable', [1] )
    deepEqual( picker.get( 'disable' ), [4,7], 'Disabled time removed' )

    $root.find( '[data-pick]' ).each( function() {
        var $this = $( this ),
            hour = ~~( $this.data('pick')/60 )
        if ( [4,7].indexOf( hour ) > -1 ) {
            ok( $this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Disabled time: ' + $this.html() )
        }
        else {
            ok( !$this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Enabled time: ' + $this.html() )
        }
    })

    picker.set( 'enable', 'flip' )
    deepEqual( picker.get( 'disable' ), [4,7], 'Disabled collection `enable` flipped' )

    $root.find( '[data-pick]' ).each( function() {
        var $this = $( this ),
            hour = ~~( $this.data('pick')/60 )
        if ( [4,7].indexOf( hour ) < 0 ) {
            ok( $this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Disabled time: ' + $this.html() )
        }
        else {
            ok( !$this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Enabled time: ' + $this.html() )
        }
    })

    picker.set( 'disable', 'flip' )
    deepEqual( picker.get( 'disable' ), [4,7], 'Disabled collection `disable` flipped' )

    $root.find( '[data-pick]' ).each( function() {
        var $this = $( this ),
            hour = ~~( $this.data('pick')/60 )
        if ( [4,7].indexOf( hour ) > -1 ) {
            ok( $this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Disabled time: ' + $this.html() )
        }
        else {
            ok( !$this.hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Enabled time: ' + $this.html() )
        }
    })
})

test( '`disable` and `enable` using arrays', function() {

    var picker = this.picker,
        $root = picker.$root,
        disableCollection = [ [1,0],[18,0],[23,30],[4,30] ]

    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled times added' )

    $root.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index === 2 || index === 9 || index === 36 || index === 47 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })

    disableCollection.pop()
    picker.set( 'enable', [ [4,30] ] )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled time removed' )

    $root.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index === 2 || index === 36 || index === 47 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })

    picker.set( 'enable', 'flip' )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled collection `enable` flipped' )
    deepEqual( picker.get( 'enable' ), -1, 'Base state disabled' )

    $root.find( '[data-pick]' ).each( function( index, item ) {
        if ( index !== 2 && index !== 36 && index !== 47 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })

    picker.set( 'disable', 'flip' )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled collection `disable` flipped' )
    deepEqual( picker.get( 'enable' ), 1, 'Base state enabled' )

    $root.find( '[data-pick]' ).each( function( index, item ) {
        if ( index === 2 || index === 36 || index === 47 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })


    picker.set( 'disable', [1] )
    var disabledTimeArray = [ 1, 30 ]
    picker.set( 'enable', [ disabledTimeArray ] )
    disabledTimeArray.push( 'inverted' )
    disableCollection = disableCollection.concat([ 1, disabledTimeArray ])
    deepEqual( picker.get('disable'), disableCollection, 'Disabled collection with specified time inverted' )
})

test( '`disable` and `enable` using booleans', function() {

    var picker = this.picker,
        $root = picker.$root,
        disableCollection = [ [1,0],[4,30],[18,0],[23,30] ]


    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled times added to collection' )

    picker.set('disable', false)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )

    $root.find( '[data-pick]' ).each( function( indexCell, tableCell ) {
        ok( !$( tableCell ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + tableCell.innerHTML )
    })


    picker.set( 'disable', disableCollection )
    deepEqual( picker.get( 'disable' ), disableCollection, 'Disabled times added to collection' )

    picker.set('disable', true)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )
    deepEqual( picker.get('enable'), -1, 'Disabled collection `enable` flipped' )

    $root.find( '[data-pick]' ).each( function( indexCell, tableCell ) {
        ok( $( tableCell ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + tableCell.innerHTML )
    })


    picker.set( 'enable', 'flip' )
    deepEqual( picker.get('enable'), 1, 'Disabled collection `enable` flipped' )

    picker.set( 'disable', disableCollection )
    deepEqual( picker.get('disable'), disableCollection, 'Disabled times added to collection' )


    picker.set('enable', true)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )

    $root.find( '[data-pick]' ).each( function( indexCell, tableCell ) {
        ok( !$( tableCell ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + tableCell.innerHTML )
    })


    picker.set( 'disable', disableCollection )
    deepEqual( picker.get('disable'), disableCollection, 'Disabled times added to collection' )


    picker.set('enable', false)
    deepEqual( picker.get('disable'), [], 'Disabled collection reset' )
    deepEqual( picker.get('enable'), -1, 'Disabled collection `enable` flipped' )

    $root.find( '[data-pick]' ).each( function( indexCell, tableCell ) {
        ok( $( tableCell ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + tableCell.innerHTML )
    })
})




module( 'Time picker `set` beyond limits', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).val( '5:30 a.m.' ).pickatime({
            min: [2,30],
            max: [17,0]
        })
        this.picker = $input.pickatime( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`select`', function() {

    var picker = this.picker

    picker.set( 'select', [1,0] )
    deepEqual( picker.get( 'select' ), picker.get( 'min' ), 'Able to not `select` beyond lower limit' )

    picker.set( 'select', [19,0] )
    deepEqual( picker.get( 'select' ), picker.get( 'max' ), 'Able to not `select` beyond upper limit' )
})

test( '`highlight`', function() {

    var picker = this.picker

    picker.set( 'highlight', [1,0] )
    deepEqual( picker.get( 'highlight' ), picker.get( 'min' ), 'Able to not `highlight` beyond lower limit' )

    picker.set( 'highlight', [19,0] )
    deepEqual( picker.get( 'highlight' ), picker.get( 'max' ), 'Able to not `highlight` beyond upper limit' )
})

test( '`view`', function() {

    var picker = this.picker

    picker.set( 'view', [1,0] )
    deepEqual( picker.get( 'view' ), picker.get( 'min' ), 'Able to not `view` beyond lower limit' )

    picker.set( 'view', [19,0] )
    deepEqual( picker.get( 'view' ), picker.get( 'max' ), 'Able to not `view` beyond upper limit' )
})




module( 'Time picker `set` outsite interval scope', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickatime()
        this.picker = $input.pickatime( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`select`', function() {

    var picker = this.picker

    picker.set( 'select', [1,10] )
    var selected = picker.get('select')
    deepEqual( [selected.hour, selected.mins], [1,30], 'Scoped `select` into interval range' )

    picker.set( 'select', [19,49] )
    selected = picker.get('select')
    deepEqual( [selected.hour, selected.mins], [20,0], 'Scoped `select` into interval range' )
})

test( '`highlight`', function() {

    var picker = this.picker

    picker.set( 'highlight', [1,10] )
    var highlighted = picker.get('highlight')
    deepEqual( [highlighted.hour, highlighted.mins], [1,30], 'Scoped `highlight` into interval range' )

    picker.set( 'highlight', [19,49] )
    highlighted = picker.get('highlight')
    deepEqual( [highlighted.hour, highlighted.mins], [20,0], 'Scoped `highlight` into interval range' )
})

test( '`view`', function() {

    var picker = this.picker

    picker.set( 'view', [1,10] )
    var viewset = picker.get('view')
    deepEqual( [viewset.hour, viewset.mins], [1,30], 'Scoped `view` into interval range' )

    picker.set( 'view', [19,49] )
    viewset = picker.get('view')
    deepEqual( [viewset.hour, viewset.mins], [20,0], 'Scoped `view` into interval range' )
})




module( 'Time picker mouse events', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickatime()
        this.picker = $input.pickatime( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Select', function() {

    var picker = this.picker,
        $root = picker.$root,
        interval = picker.get( 'interval' )

    for ( var i = 0; i < 48; i += 1 ) {
        $root.find( '.' + $.fn.pickatime.defaults.klass.listItem ).eq( i ).click()
        strictEqual( picker.get( 'select' ).pick, i * interval, 'Selected ' + picker.get( 'select', 'h:i A' ) )
        strictEqual( picker.get( 'value' ), picker.get( 'select', 'h:i A' ), 'Input value updated to ' + picker.get( 'value' ) )
    }
})

test( 'Clear', function() {

    var picker = this.picker

    picker.set( 'select', [2,0] )
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickatime.defaults.format ), 'Value updated' )

    picker.$root.find( '.' + $.fn.pickatime.defaults.klass.buttonClear ).click()
    strictEqual( picker.get( 'value' ), '', 'Value cleared' )
})




module( 'Time picker keyboard events', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var $input = $DOM.find( 'input' ).pickatime()
        this.picker = $input.pickatime( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Select', function() {

    var picker = this.picker,
        $input = picker.$node

    for ( var i = 0; i < 48; i += 1 ) {

        // Open the picker.
        picker.open()

        // Set the highlight.
        picker.set( 'highlight', i * 30 )

        // Keydown to select the highlighted item.
        $input.trigger({ type: 'keydown', keyCode: 13 })

        // Check if the select is the same as the highlight.
        deepEqual( picker.get( 'select' ), picker.get( 'highlight' ), 'Select updated to: ' + picker.get( 'select', 'HH:i' ) )
    }
})

test( 'Highlight', function() {

    var picker = this.picker,
        $input = picker.$node

    // Open the picker
    picker.open()

    // Down
    for ( var i = 1; i < 48; i += 1 ) {
        $input.trigger({ type: 'keydown', keyCode: 40 })
        strictEqual( picker.get( 'highlight' ).pick, 30 * i, 'Key “down” to `highlight`: ' + picker.get( 'highlight', 'h:i A' ) )
        deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), 'Updated `view`' )
    }

    // Up
    for ( var j = 2; j < 49; j += 1 ) {
        $input.trigger({ type: 'keydown', keyCode: 38 })
        strictEqual( picker.get( 'highlight' ).pick, 1440 - 30 * j, 'Key “up” to `highlight`: ' + picker.get( 'highlight', 'h:i A' ) )
        deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), 'Updated `view`' )
    }

    // Right
    for ( var k = 1; k < 48; k += 1 ) {
        $input.trigger({ type: 'keydown', keyCode: 39 })
        strictEqual( picker.get( 'highlight' ).pick, 30 * k, 'Key “right” to `highlight`: ' + picker.get( 'highlight', 'h:i A' ) )
        deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), 'Updated `view`' )
    }

    // Left
    for ( var l = 2; l < 49; l += 1 ) {
        $input.trigger({ type: 'keydown', keyCode: 37 })
        strictEqual( picker.get( 'highlight' ).pick, 1440 - 30 * l, 'Key “up” to `highlight`: ' + picker.get( 'highlight', 'h:i A' ) )
        deepEqual( picker.get( 'view' ), picker.get( 'highlight' ), 'Updated `view`' )
    }
})




module( 'Time picker with a visible value', {
    setup: function() {
        $DOM.append( $INPUT.clone().val( '2:00 p.m.' ) )
        var $input = $DOM.find( 'input' ).pickatime()
        this.picker = $input.pickatime( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( '`value` to select, highlight, and view', function() {
    var picker = this.picker
    ok( !picker._hidden, 'No hidden input' )
    strictEqual( picker.get( 'select' ).pick, 840, 'Selects time' )
    strictEqual( picker.get( 'highlight' ).pick, 840, 'Highlights time' )
    strictEqual( picker.get( 'view' ).pick, 840, 'Viewsets time' )
})




module( 'Time picker with a hidden value', {
    teardown: function() {
        $DOM.empty()
    }
})

test( '`value` to select, highlight, and view', function() {

    $DOM.append( $INPUT.clone().val( '2:00 p.m.' ) )
    var $input = $DOM.find( 'input' ).pickatime({
        formatSubmit: 'HH:i'
    })
    var picker = $input.pickatime( 'picker' )

    ok( picker._hidden, 'Has hidden input' )
    strictEqual( picker._hidden.value, '14:00', 'Hidden input value' )
    strictEqual( picker.get( 'select' ).pick, 840, 'Selects time' )
    strictEqual( picker.get( 'highlight' ).pick, 840, 'Highlights time' )
    strictEqual( picker.get( 'view' ).pick, 840, 'Viewsets time' )
})

test( '`data-value` to select, highlight, and view', function() {

    $DOM.append( $INPUT.clone().data( 'value', '14:00' ) )
    var $input = $DOM.find( 'input' ).pickatime({
        formatSubmit: 'HH:i'
    })
    var picker = $input.pickatime( 'picker' )

    ok( picker._hidden, 'Has hidden input' )
    strictEqual( picker._hidden.value, '14:00', 'Hidden input value' )
    strictEqual( picker.get( 'select' ).pick, 840, 'Selects time' )
    strictEqual( picker.get( 'highlight' ).pick, 840, 'Highlights time' )
    strictEqual( picker.get( 'view' ).pick, 840, 'Viewsets time' )
})



