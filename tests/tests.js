
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true
 */


var $DOM = $( '#qunit-fixture' ),
    $input = $( '<input type=date>' )



module( 'stage setup', {
    setup: function() {
        $DOM.append( $input )
    }
})

test( 'change type to text', function() {
    ok( $input.pickatime()[ 0 ].type == 'text', 'Type is text for time.' )
    ok( $input.pickadate()[ 0 ].type == 'text', 'Type is text for date.' )
});