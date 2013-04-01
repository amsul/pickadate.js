
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */


var
    MINUTES_IN_DAY = 1440,
    $DOM = $( '#qunit-fixture' )



module( 'Time picker stage setup', {
    setup: function() {
        this.$input = $( '<input type=time>' )
        $DOM.append( this.$input )
        this.$input.pickatime()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Input element attributes', function() {
    ok( this.$input[ 0 ].type == 'text', 'Input type updated.' )
    ok( this.$input[ 0 ].readOnly === true, 'Input is readonly.' )
    ok( this.$input.pickatime( '$node' )._type == 'time', 'Original input type is saved.' )
    ok( this.$input.pickatime( 'get', 'select' )[ 0 ].TIME == this.$input.pickatime( 'get', 'now' ).TIME, 'Default selected time is correct.' )
})

test( 'Holder is present', function() {
    ok( this.$input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] ).length, 'There is a picker holder right after the input element.' )
})




module( 'Time picker with a value', {
    setup: function() {
        this.$input = $( '<input type=time value="2:00 a.m.">' )
        $DOM.append( this.$input )
        this.$input.pickatime()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Input element values', function() {
    ok( !this.$input.next().next().length, 'There is no hidden input' )
    ok( this.$input.pickatime( 'get', 'select' )[ 0 ].TIME == 120, 'Element value sets correct time' )
    ok( this.$input.pickatime( 'get', 'view' ).TIME == 120, 'Element value sets correct view' )
    ok( this.$input.pickatime( 'get', 'highlight' ).TIME == 120, 'Element value sets correct highlight' )
})




module( 'Time picker with a data value', {
    setup: function() {
        this.$input = $( '<input type=time data-value="04:00">' )
        $DOM.append( this.$input )
        this.$input.pickatime({
            formatSubmit: 'HH:i'
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Input element data values', function() {
    ok( this.$input.next().next()[ 0 ].type == 'hidden', 'There is a hidden input' )
    ok( this.$input.pickatime( 'get', 'select' )[ 0 ].TIME == 240, 'Element value sets correct time' )
    ok( this.$input.pickatime( 'get', 'view' ).TIME == 240, 'Element value sets correct view' )
    ok( this.$input.pickatime( 'get', 'highlight' ).TIME == 240, 'Element value sets correct highlight' )
})







// module( 'Hidden input is present', {
//     setup: function() {
//         $DOM.append( $input )
//         $input.pickatime({
//             formatSubmit: 'g:iA'
//         })
//     },
//     teardown: function() {
//         $DOM.empty()
//     }
// })

// test( 'Hidden input status 2', function() {
//     ok( $input.data( 'pickatime' ).settings.formatSubmit && $DOM.find( 'input[type=hidden]' ).length, 'There is a hidden input.' )
// })



// module( 'Time intervals', {
//     setup: function() {
//         $DOM.append( $input )
//         $input.pickatime()
//     },
//     teardown: function() {
//         $DOM.empty()
//     }
// })

// test( 'Default time interval', function() {
//     ok( $input.data( 'pickatime' ).settings.timeStep * $input.data( 'pickatime' ).$node.next().find( '.pickadate__list-item' ).length == MINUTES_IN_DAY, 'Correct number of items.' )
// })



// module( 'Time intervals', {
//     setup: function() {
//         $DOM.append( $input )
//         $input.pickatime({
//             timeStep: 10
//         })
//     },
//     teardown: function() {
//         $DOM.empty()
//     }
// })

// test( '10 minute time interval', function() {
//     ok( $input.data( 'pickatime' ).settings.timeStep * $input.data( 'pickatime' ).$node.next().find( '.pickadate__list-item' ).length == MINUTES_IN_DAY, 'Correct number of items.' )
// })



