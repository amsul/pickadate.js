
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
        this.$input = $DOM.find( 'input' ).pickadate()
        this.picker = this.$input.pickadate( 'picker' )
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

    picker.$root.find( 'div' ).eq(3).click()
    ok( picker.get( 'open' ) === true, 'Remains open with click within' )

    picker.close()
    ok( picker.get( 'open' ) === false, 'Closed with trigger' )

    picker.stop()
    ok( picker.get( 'start' ) === false, 'Stopped with trigger' )

    picker.start()
    ok( picker.get( 'start' ) === true, 'Started with trigger' )
})

test( 'Picker properties', function() {

    var picker = this.picker

    strictEqual( picker.get( 'type' ), 'password', 'Original type is saved' )
    notStrictEqual( picker.get( 'min' ).pick, null, 'Has “min”' )
    notStrictEqual( picker.get( 'max' ).pick, null, 'Has “max”' )
    strictEqual( picker.get( 'select' ), null, 'Has no “select”' )
    ok( isInteger( picker.get( 'highlight' ).pick ), 'Has “highlight”' )
    ok( isInteger( picker.get( 'view' ).pick ), 'Has “view”' )
    ok( isInteger( picker.get( 'now' ).pick ), 'Has “now”' )
    deepEqual( picker.get( 'disable' ), [], 'Default “disable” collection is empty' )
})

test( 'Picker alternate API', function() {

    var $input = this.$input
    var picker = this.picker

    strictEqual( $input.pickadate( 'get', 'start' ), picker.get( 'start' ), 'Methods are passed forward' )
    strictEqual( $input.pickadate( 'component' ), picker.component, 'Objects are passed forward' )
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

test( 'Default hidden prefix & suffix', function() {
    var picker = this.picker
    strictEqual( picker.$node[0].name + '_submit', picker._hidden.name, 'Correct hidden element `name`' )
})

module( 'Formatting setup', {
    setup: function() {
        $DOM.append( $INPUT.clone().attr( 'name', 'picker' ) )
        var $input = $DOM.find( 'input' ).pickadate({
            formatSubmit: 'yyyy/mm/dd',
            hiddenPrefix: 'prefixed__',
            hiddenSuffix: '__suffixed'
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Custom hidden prefix & suffix', function() {
    var picker = this.picker
    strictEqual( 'prefixed__' + picker.$node[0].name + '__suffixed', picker._hidden.name, 'Correct hidden element `name`' )
})

module( 'Formatting setup', {
    setup: function() {
        $DOM.append( $INPUT.clone().attr( 'name', 'picker' ) )
        var $input = $DOM.find( 'input' ).pickadate({
            formatSubmit: 'yyyy/mm/dd',
            hiddenPrefix: '',
            hiddenSuffix: ''
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'No hidden prefix & suffix', function() {
    var picker = this.picker
    strictEqual( picker.$node[0].name, picker._hidden.name, 'Correct hidden element `name`' )
})

module( 'Formatting setup', {
    setup: function() {
        $DOM.append( $INPUT.clone().attr( 'name', 'picker' ) )
        var $input = $DOM.find( 'input' ).pickadate({
            formatSubmit: 'yyyy/mm/dd',
            hiddenName: true
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Hidden name replaces visible name', function() {
    var picker = this.picker
    strictEqual( picker.$node[0].name, '', 'Visible element has no `name`')
    strictEqual(picker._hidden.name, 'picker', 'Correct hidden element `name`' )
})





module( 'Container setup', {
    setup: function() {
        $DOM.append( $INPUT.clone().attr( 'name', 'picker' ), $( '<div id="outlet"/>' ) )
        var $input = $DOM.find( 'input' ).pickadate({
            formatSubmit: 'yyyy/mm/dd',
            container: '#outlet'
        })
        this.picker = $input.pickadate( 'picker' )
    },
    teardown: function() {
        this.picker.stop()
        $DOM.empty()
    }
})

test( 'Picker root outlet', function() {
    var picker = this.picker
    strictEqual( picker.$root[0].parentNode.id, 'outlet', 'Correct root outlet' )
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
        trigger( 'set' ).
        trigger( 'close' )
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
        trigger( 'set' ).
        trigger( 'close' )
})

test( 'As muted methods', 1, function() {

    var picker = this.picker

    // Bind the callback.
    picker.on('set', function() {
        ok( true, 'An outspoken method' )
    })

    // Do the selections.
    picker.set('select', new Date())
    picker.set('select', new Date(), { muted: true })
    picker.set({ select: new Date() }, { muted: true })
})

test( 'Clear as muted', function() {

    var picker = this.picker
    var called = false

    // Bind the callback.
    picker.on('set', function() {
        called = true
    })

    picker.clear({ muted: true })

    ok( !called, 'Callback not called' )
})

test( 'Open with alternate focus', function() {

    var picker = this.picker,
        klasses = Picker.klasses()

    stop()
    picker.open( false )
    setTimeout( function() {
        ok( !picker.get( 'open' ) && picker.$node[0].className === klasses.input + ' ' + klasses.active && picker.$root[0].className === klasses.picker + ' ' + klasses.opened && document.activeElement !== picker.$node[0], 'Opened without focus' )
        start()
    }, 0 )
})

test( 'Close with alternate focus', function() {

    var picker = this.picker

    stop()
    picker.close( true )
    setTimeout( function() {
        var isClosed = !picker.get( 'open' )
        var hasCorrectActiveElement = document.activeElement === picker.$holder[0]
        ok( isClosed && hasCorrectActiveElement, 'Closed with focus' )
        start()
    }, 0 )
})

test( 'Switch off', function() {

    var truthy = true,
        picker = this.picker

    picker.on('open', function() {
        truthy = false
    })
    picker.off('open')

    strictEqual( truthy, true, 'Method turned off' )
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

asyncTest( 'Open and close', function() {

    var picker = this.picker

    picker.$node.click()
    setTimeout(function() {
        ok( picker.get( 'open' ) === true, 'Opened with click in' )

        $( 'body' ).click()
        setTimeout(function(){
            ok( picker.get( 'open' ) === false, 'Closed with click out' )
            QUnit.start();
        }, 200)
    }, 200)
})

asyncTest( 'Open and close', function() {

    var picker = this.picker

    picker.$node.click()
    setTimeout(function() {
        strictEqual( picker.get( 'open' ), true, 'Opened with click in' )

        picker.$root.find( '.' + $.fn.pickadate.defaults.klass.buttonClose ).click();
        setTimeout(function(){
            strictEqual( picker.get( 'open' ), false, 'Closed by clicking “close”' )
            QUnit.start();
        }, 200)
    }, 200)
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

asyncTest( 'Open and close', function() {

    var picker = this.picker

    picker.$node.focus()
    setTimeout(function () {
        ok(picker.get('open') === true, 'Opened with key in')
        picker.$node.blur()
        $DOM.focusin()
        setTimeout(function () {
            ok(picker.get('open') === false, 'Closed with key out')
            picker.$node.trigger({
                type: 'keydown',
                keyCode: 40
            })
            setTimeout(function () {
                ok(picker.get('open') === true, 'Opened after arrow “down”')
                picker.$node.trigger({
                    type: 'keydown',
                    keyCode: 27
                })
                setTimeout(function () {
                    ok(picker.get('open') === false, 'Closed after “escape”')
                    picker.$node.trigger({
                        type: 'keydown',
                        keyCode: 38
                    })
                    setTimeout(function () {
                        ok(picker.get('open') === true, 'Opened after arrow “up”')
                        picker.$node.trigger({
                            type: 'keydown',
                            keyCode: 8
                        })
                        setTimeout(function () {
                            ok(picker.get('open') === false, 'Closed after “backspace”')
                            picker.$node.trigger({
                                type: 'keydown',
                                keyCode: 37
                            })
                            setTimeout(function () {
                                ok(picker.get('open') === true, 'Opened after arrow “left”')
                                picker.$node.trigger({
                                    type: 'keydown',
                                    keyCode: 46
                                })
                                setTimeout(function () {
                                    ok(picker.get('open') === false, 'Closed after “alt. backspace”')
                                    picker.$node.trigger({
                                        type: 'keydown',
                                        keyCode: 39
                                    })
                                    setTimeout(function () {
                                        ok(picker.get('open') === true, 'Opened after arrow “right”')
                                        QUnit.start();
                                    }, 200)
                                }, 200)
                            }, 200)
                        }, 200)
                    }, 200)
                }, 200)
            }, 200)
        }, 200)
    }, 200)
})

test( 'Set and clear', function() {

    var picker = this.picker

    picker.open()
    picker.$node.trigger({ type: 'keydown', keyCode: 13 })
    strictEqual( picker.get( 'value' ), picker.get( 'select', $.fn.pickadate.defaults.format ), 'Set value as default selection after “enter”' )

    picker.$node.trigger({ type: 'keydown', keyCode: 8 })
    strictEqual( picker.get( 'value' ), '', 'Clear input value after “backspace”' )
})




