
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true
 */


var
    MINUTES_IN_DAY = 1440,
    $DOM = $( '#qunit-fixture' ),
    $input = $( '<input type=date>' )



module( 'Input stage setup', {
    setup: function() {
        $DOM.append( $input )
        $input.pickatime()
    },
    teardown: function() {
        $DOM.empty()
    }
})

test( 'Input element basic setup', function() {
    ok( $input[ 0 ].type == 'text', 'Input type is text.' )
    ok( $input[ 0 ].readOnly === true, 'Input has readonly state.' )
})



module( 'Holder stage setup', {
    setup: function() {
        $DOM.append( $input )
        $input.pickatime()
    },
    teardown: function() {
        $DOM.empty()
    }
})

test( 'Holder is present', function() {
    ok( $input.next( '.pickadate__holder' ).length, 'There is a picker holder right after the input element.' )
})



module( 'Hidden input is not present', {
    setup: function() {
        $DOM.append( $input )
        $input.pickatime()
    },
    teardown: function() {
        $DOM.empty()
    }
})

test( 'Hidden input status', function() {
    ok( !$input.data( 'pickatime' ).settings.formatSubmit && !$DOM.find( 'input[type=hidden]' ).length, 'There is no hidden input.' )
})



module( 'Hidden input is present', {
    setup: function() {
        $DOM.append( $input )
        $input.pickatime({
            formatSubmit: 'g:iA'
        })
    },
    teardown: function() {
        $DOM.empty()
    }
})

test( 'Hidden input status 2', function() {
    ok( $input.data( 'pickatime' ).settings.formatSubmit && $DOM.find( 'input[type=hidden]' ).length, 'There is a hidden input.' )
})



module( 'Time intervals', {
    setup: function() {
        $DOM.append( $input )
        $input.pickatime()
    },
    teardown: function() {
        $DOM.empty()
    }
})

test( 'Default time interval', function() {
    ok( $input.data( 'pickatime' ).settings.timeStep * $input.data( 'pickatime' ).$node.next().find( '.pickadate__list-item' ).length == MINUTES_IN_DAY, 'Correct number of items.' )
})



module( 'Time intervals', {
    setup: function() {
        $DOM.append( $input )
        $input.pickatime({
            timeStep: 10
        })
    },
    teardown: function() {
        $DOM.empty()
    }
})

test( '10 minute time interval', function() {
    ok( $input.data( 'pickatime' ).settings.timeStep * $input.data( 'pickatime' ).$node.next().find( '.pickadate__list-item' ).length == MINUTES_IN_DAY, 'Correct number of items.' )
})



