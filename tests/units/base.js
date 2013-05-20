
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
    $INPUT = $( '<input type=password>' ),
    isInteger = function( value ) {
        return {}.toString.call( value ).indexOf( 'Number' ) > -1 && value % 1 === 0
    }



/* ==========================================================================
   Base picker tests
   ========================================================================== */


module( 'Base setup', {
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

test( 'Input stage and attributes', function() {

    var input = this.picker.$node[ 0 ]

    ok( input.type === 'text', 'Type updated' )
    ok( input.readOnly === true, 'Readonly set' )
    ok( input.value === '', 'No value' )
    ok( this.picker.$root.length, 'Root holder exists' )
    ok( !this.picker._hidden, 'Hidden input doesn’t exist' )
})

test( 'Picker states', function() {

    var picker = this.picker

    ok( picker.get( 'start' ) === true, 'Started' )
    ok( picker.get( 'open' ) === false, 'Closed to start with' )

    picker.open()
    ok( picker.get( 'open' ) === true, 'Opened with trigger' )

    picker.$root.find( 'button' )[0].focus()
    ok( picker.get( 'open' ) === true, 'Remains open with focus within' )

    picker.$root.click()
    ok( picker.get( 'open' ) === true, 'Remains open with click within' )

    picker.close()
    ok( picker.get( 'open' ) === false, 'Closed with trigger' )

    picker.stop()
    ok( picker.get( 'start' ) === false, 'Stopped with trigger' )

    picker.start()
    ok( picker.get( 'start' ) === true, 'Started with trigger' )
})

test( 'Properties', function() {

    var picker = this.picker

    ok( picker.get( 'type' ) === 'password', 'Original type is saved' )
    ok( picker.get( 'min' ).pick != null, 'Has “min”' )
    ok( picker.get( 'max' ).pick != null, 'Has “max”' )
    ok( isInteger( picker.get( 'select' ).pick ), 'Has “select”' )
    ok( isInteger( picker.get( 'highlight' ).pick ), 'Has “highlight”' )
    ok( isInteger( picker.get( 'view' ).pick ), 'Has “view”' )
    ok( isInteger( picker.get( 'now' ).pick ), 'Has “now”' )
    deepEqual( picker.get( 'disable' ), [], 'Default “disable” collection is empty' )
})


module( 'Formatting setup', {
    setup: function() {
        $DOM.append( $INPUT.clone().attr( 'name', 'picker' ) )
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

test( 'Hidden suffix', function() {
    var picker = this.picker
    strictEqual( picker.$node[0].name + '_submit', picker._hidden.name, 'Correct hidden element `name` suffix' )
})






module( 'Base events', {
    setup: function() {
        $DOM.append( $INPUT.clone() )
        var thisModule = this,
            $input = $DOM.find( 'input' ).pickadate({
                onStart: function() {
                    thisModule.started = true
                    thisModule.restarted = true
                    thisModule.inputType = this.$node[ 0 ].type
                },
                onRender: function() {
                    thisModule.rendered = true
                },
                onOpen: function() {
                    thisModule.opened = true
                },
                onClose: function() {
                    thisModule.closed = true
                },
                onStop: function() {
                    thisModule.stopped = true
                    thisModule.inputType = this.$node[ 0 ].type
                },
                onSet: function( thing ) {
                    thisModule.selected = thing
                }
            })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'As options', function() {

    var thisModule = this,
        picker = thisModule.picker

    strictEqual( thisModule.started, picker.get( 'start' ) === true, 'Fired: `onStart`' )
    strictEqual( thisModule.inputType, 'text', 'Updated input type' )
    strictEqual( thisModule.rendered, picker.get( 'start' ) === true, 'Fired: `onRender`' )

    picker.open()
    strictEqual( thisModule.opened, picker.get( 'open' ) === true, 'Fired: `onOpen`' )

    picker.close()
    strictEqual( thisModule.closed, picker.get( 'open' ) === false, 'Fired: `onClose`' )

    picker.stop()
    strictEqual( thisModule.stopped, picker.get( 'start' ) === false, 'Fired: `onStop`' )
    strictEqual( thisModule.inputType, $INPUT[ 0 ].type, 'Restored input type' )

    picker.start()
    strictEqual( thisModule.restarted, picker.get( 'start' ) === true, 'Restarted: `onStart`' )

    picker.set()
    deepEqual( thisModule.selected, {}, 'Fired: `onSet`' )
})

test( 'As individual methods', 6, function() {

    var picker = this.picker

    // Register the events
    picker.
        on( 'open', function() {
            ok( true, 'Opened' )
        }).
        on( 'close', function() {
            ok( true, 'Closed' )
        }).
        on( 'render', function() {
            ok( true, 'Rendered' )
        }).
        on( 'set', function() {
            ok( true, 'Set' )
        }).
        on( 'stop', function() {
            ok( true, 'Stopped' )
        }).
        on( 'start', function() {
            ok( true, 'Started' )
        })

    picker.
        trigger( 'start' ).
        trigger( 'open' ).
        trigger( 'render' ).
        trigger( 'set' )
})

test( 'As multiple methods', 6, function() {

    var picker = this.picker

    // Register the events
    picker.on({
        open: function() {
            ok( true, 'Opened' )
        },
        close: function() {
            ok( true, 'Closed' )
        },
        render: function() {
            ok( true, 'Rendered' )
        },
        set: function() {
            ok( true, 'Set' )
        },
        stop: function() {
            ok( true, 'Stopped' )
        },
        start: function() {
            ok( true, 'Started' )
        }
    })

    picker.
        trigger( 'start' ).
        trigger( 'open' ).
        trigger( 'render' ).
        trigger( 'set' )
})

test( 'Open/close alternate focus', function() {

    var picker = this.picker,
        klasses = Picker.klasses()

    picker.open( false )
    ok( !picker.get( 'open' ) && picker.$node[0].className === klasses.input + ' ' + klasses.active && picker.$root[0].className === klasses.picker + ' ' + klasses.opened && document.activeElement !== picker.$node[0], 'Opened without focus' )

    picker.close( true )
    ok( !picker.get( 'open' ) && picker.$node[0].className === klasses.input && picker.$root[0].className === klasses.picker && document.activeElement === picker.$node[0], 'Closed with focus' )
})






module( 'Base mouse events', {
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

test( 'Open and close', function() {

    var picker = this.picker

    picker.$node.click()
    ok( picker.get( 'open' ) === true, 'Opened with click in' )

    $( 'body' ).click()
    ok( picker.get( 'open' ) === false, 'Closed with click out' )
})






module( 'Base keyboard events', {
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

test( 'Open and close', function() {

    var picker = this.picker

    picker.$node.focus()
    ok( picker.get( 'open' ) === true, 'Opened with key in' )

    picker.$node.blur()
    $DOM.focusin()
    ok( picker.get( 'open' ) === false, 'Closed with key out' )

    picker.$node.trigger({ type: 'keydown', keyCode: 40 })
    ok( picker.get( 'open' ) === true, 'Opened after arrow “down”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 27 })
    ok( picker.get( 'open' ) === false, 'Closed after “escape”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 38 })
    ok( picker.get( 'open' ) === true, 'Opened after arrow “up”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 8 })
    ok( picker.get( 'open' ) === false, 'Closed after “backspace”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 37 })
    ok( picker.get( 'open' ) === true, 'Opened after arrow “left”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 46 })
    ok( picker.get( 'open' ) === false, 'Closed after “alt. backspace”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 39 })
    ok( picker.get( 'open' ) === true, 'Opened after arrow “right”' )
})

test( 'Set and clear', function() {

    var picker = this.picker

    picker.open()
    picker.$node.trigger({ type: 'keydown', keyCode: 13 })
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), 'Set value as default selection after “enter”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 8 })
    strictEqual( picker.get( 'value' ), '', 'Clear input value after “backspace”' )
})




