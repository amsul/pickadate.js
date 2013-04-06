
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */


var $DOM = $( '#qunit-fixture' )



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
    ok( this.$input[ 0 ].type == 'text', 'Input type updated' )
    ok( this.$input[ 0 ].readOnly === true, 'Input is readonly' )
    ok( this.$input.pickatime( 'get', 'select' ).TIME == this.$input.pickatime( 'get', 'now' ).TIME, 'Default selected time is correct' )
})

test( 'Holder is present', function() {
    var $holder = this.$input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] )
    ok( $holder.length, 'There is a picker holder right after the input element' )
    ok( $holder.find( '[data-pick]' ).length == 48, 'There are 48 selectable times at 30 minute intervals' )
})

test( 'Picker stage', function() {
    var nowDateObject = new Date(),
        nowTimeMinutes = nowDateObject.getHours() * 60 + nowDateObject.getMinutes(),
        interval = $.fn.pickatime.defaults.interval
        console.log( interval + nowTimeMinutes - ( nowTimeMinutes % interval ) )
    ok( this.$input.pickatime( 'get', 'now' ).TIME === interval + nowTimeMinutes - ( nowTimeMinutes % interval ), 'Now time is correct at ' + this.$input.pickatime( 'get', 'now' ).HOUR + ':' + this.$input.pickatime( 'get', 'now' ).MINS )
    ok( !this.$input.pickatime( 'get', 'disable' ).length, 'No disabled times' )
    ok( !this.$input.pickatime( 'get', 'off' ), 'The times are not all off' )
    ok( this.$input.pickatime( 'get', 'min' ).TIME === 0, 'Min time is midnight' )
    ok( this.$input.pickatime( 'get', 'max' ).TIME == 1410, 'Max time is 23:30' )
})




module( 'Time picker with a value', {
    setup: function() {
        this.$input = $( '<input type=time value="2:00 p.m.">' )
        $DOM.append( this.$input )
        this.$input.pickatime()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Input element values', function() {
    ok( this.$input.pickatime( 'get', 'select' ).TIME == 840, 'Element value sets correct time' )
    ok( this.$input.pickatime( 'get', 'highlight' ).TIME == 840, 'Element value sets correct highlight' )
    ok( this.$input.pickatime( 'get', 'view' ).TIME == 840, 'Element value sets correct view' )
    ok( !this.$input.next().next().length, 'There is no hidden input' )
})




module( 'Time picker with a data value', {
    setup: function() {
        this.$input = $( '<input type=time data-value="14:00">' )
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
    ok( this.$input.pickatime( 'get', 'select' ).TIME == 840, 'Selects correct time' )
    ok( this.$input.pickatime( 'get', 'highlight' ).TIME == 840, 'Highlights correct time' )
    ok( this.$input.pickatime( 'get', 'view' ).TIME == 840, 'Viewsets correct time' )
    ok( this.$input.next().next()[ 0 ].type == 'hidden', 'There is a hidden input' )
    ok( this.$input.next().next()[ 0 ].value == '14:00', 'The hidden input has correct value' )
})


