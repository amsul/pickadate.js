
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */


var $DOM = $( '#qunit-fixture' )



/* ==========================================================================
   Time picker tests
   ========================================================================== */


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

test( 'Checking holder states...', function () {

    ok( this.$input.pickatime( 'isOpen' ) === false, 'Closed by default' )

    this.$input.pickatime( 'open' )
    ok( this.$input.pickatime( 'isOpen' ) === true, 'Opened with trigger' )

    this.$input.pickatime( 'close' )
    ok( this.$input.pickatime( 'isOpen' ) === false, 'Closed by trigger' )

    this.$input.focus()
    ok( this.$input.pickatime( 'isOpen' ) === true, 'Opened with focus' )

    this.$input.blur()
    $( 'body' ).focus()
    ok( this.$input.pickatime( 'isOpen' ) === false, 'Closed by losing focus' )

    this.$input.click()
    ok( this.$input.pickatime( 'isOpen' ) === true, 'Opened with click' )

    $( 'body' ).click()
    ok( this.$input.pickatime( 'isOpen' ) === false, 'Closed by clicking outside' )
})

test( 'Checking input attributes...', function() {
    ok( this.$input[ 0 ].type === 'text', 'Input type updated' )
    ok( this.$input[ 0 ].readOnly === true, 'Input is readonly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === this.$input.pickatime( 'get', 'min' ).PICK, 'Default selected time is correct' )
})

test( 'Checking picker holder...', function() {
    var $holder = this.$input.pickatime( 'picker' ).$holder
    ok( $holder.length, 'There is a picker holder right after the input element' )
    ok( $holder.find( '[data-pick]' ).length === 48, 'There are 48 selectable times at 30 minute intervals' )
})

test( 'Checking picker objects...', function() {
    var nowDateObject = new Date(),
        nowTimeMinutes = nowDateObject.getHours() * 60 + nowDateObject.getMinutes(),
        interval = this.$input.pickatime( 'get', 'interval' )
    ok( interval === 30, 'Default interval is 30' )
    ok( this.$input.pickatime( 'get', 'now' ).PICK === interval + nowTimeMinutes - ( nowTimeMinutes % interval ), 'Now time is correct at ' + this.$input.pickatime( 'get', 'now' ).HOUR + ':' + this.$input.pickatime( 'get', 'now' ).MINS )
    ok( !this.$input.pickatime( 'get', 'disable' ).length, 'No disabled times' )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === 0, 'Selected time is midnight' )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === 0, 'Min time is midnight' )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === 1410, 'Max time is 23:30' )
})




module( 'Time picker general events', {
    setup: function() {
        var thisModule = this
        thisModule.$input = $( '<input type=time>' )
        $DOM.append( thisModule.$input )
        thisModule.$input.pickatime({
            onStart: function() {
                thisModule.started = true
                thisModule.restarted = thisModule.stopped && thisModule.started
                thisModule.updatedType = thisModule.$input[ 0 ].type === 'text'
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
            onSet: function() {
                thisModule.selectedArray = this.get( 'select' ).PICK === 600
                thisModule.selectedNumber = this.get( 'select' ).PICK === 120
                thisModule.clearedValue = this.get( 'value' ) === ''
            },
            onStop: function() {
                thisModule.stopped = true
                thisModule.restoredType = thisModule.$input[ 0 ].type === 'time'
            }
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking the basic events...', function() {

    ok( this.started, 'Started up fine' )
    ok( this.updatedType, 'Updated the element type' )

    ok( this.rendered, 'Rendered correctly' )

    this.$input.pickatime( 'open' )
    ok( this.opened, 'Opened just fine with a trigger' )

    this.$input.pickatime( 'close' )
    ok( this.closed, 'Closed just fine with a trigger' )

    this.$input.pickatime( 'stop' )
    ok( this.stopped, 'Stopped just fine' )
    ok( this.restoredType, 'Restored the element type' )

    this.$input.pickatime( 'start' )
    ok( this.restarted, 'Restarted just fine' )
    ok( this.updatedType, 'Updated the element type' )
})

test( 'Checking the `set` events...', function() {

    this.$input.pickatime( 'set', { select: [10,0] } )
    ok( this.selectedArray, 'Selected from an array' )

    this.$input.pickatime( 'set', { select: 120 } )
    ok( this.selectedNumber, 'Selected from a number' )

    this.$input.pickatime( 'clear' )
    ok( this.clearedValue, 'Cleared the input value' )
})




module( 'Time picker mouse events', {
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

test( 'Checking click to open and close...', function() {

    ok( !this.$input.pickatime( 'isOpen' ), 'Closed to start with' )

    this.$input.click()
    ok( this.$input.pickatime( 'isOpen' ), 'Opened after click' )
})

test( 'Checking click to select...', function() {

    var $holder = this.$input.pickatime( 'picker' ).$holder,
        interval = this.$input.pickatime( 'get', 'interval' )

    for ( var i = 0; i < 48; i += 1 ) {
        $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).eq( i ).click()
        ok( this.$input.pickatime( 'get', 'select' ).PICK === i * interval, 'Selected ' + this.$input.pickatime( 'get', { select: 'h:i A' } ) )
        ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { select: 'h:i A' } ), 'Input value updated to ' + this.$input.pickatime( 'get', 'value' ) )
    }
})

test( 'Checking click to clear...', function() {

    var $holder = this.$input.pickatime( 'picker' ).$holder

    this.$input.pickatime( 'set', { select: [4,30] } )
    ok( this.$input.pickatime( 'get', 'value' ) === '4:30 AM', 'Input has a value' )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.buttonClear ).click()
    ok( this.$input.pickatime( 'get', 'value' ) === '', 'Input value has cleared' )
})




module( 'Time picker keyboard events', {
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

test( 'Checking keydown to open and close...', function() {

    ok( !this.$input.pickatime( 'isOpen' ), 'Closed to start with' )

    this.$input.trigger({ type: 'keydown', keyCode: 40 })
    ok( this.$input.pickatime( 'isOpen' ), 'Opened after pressing "down"' )

    this.$input.trigger({ type: 'keydown', keyCode: 27 })
    ok( !this.$input.pickatime( 'isOpen' ), 'Closed after pressing "escape"' )

    this.$input.trigger({ type: 'keydown', keyCode: 38 })
    ok( this.$input.pickatime( 'isOpen' ), 'Opened after pressing "up"' )

    this.$input.trigger({ type: 'keydown', keyCode: 8 })
    ok( !this.$input.pickatime( 'isOpen' ), 'Closed after pressing "backspace"' )

    this.$input.trigger({ type: 'keydown', keyCode: 37 })
    ok( this.$input.pickatime( 'isOpen' ), 'Opened after pressing "left"' )

    this.$input.trigger({ type: 'keydown', keyCode: 46 })
    ok( !this.$input.pickatime( 'isOpen' ), 'Closed after pressing "alt. backspace"' )

    this.$input.trigger({ type: 'keydown', keyCode: 39 })
    ok( this.$input.pickatime( 'isOpen' ), 'Opened after pressing "right"' )
})

test( 'Checking keydown to highlight, viewset, and select...', function() {

    this.$input.focus()
    ok( this.$input.pickatime( 'isOpen' ), 'Opened with focus' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 0, 'Focused in: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )

    this.$input.trigger({ type: 'keydown', keyCode: 13 })
    ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { highlight: 'h:i A' } ), 'Selected value with "enter": ' + this.$input.pickatime( 'get', 'value' ) )

    for ( var i = 1; i < 48; i += 1 ) {

        this.$input.focus()
        this.$input.trigger({ type: 'keydown', keyCode: 40 })
        ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 30 * i, 'Keyed "down" to: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )
        ok( this.$input.pickatime( 'get', 'view' ).PICK === this.$input.pickatime( 'get', 'highlight' ).PICK, 'Updated "view" to: ' + this.$input.pickatime( 'get', { view: 'h:i A' } ) )

        this.$input.trigger({ type: 'keydown', keyCode: 13 })
        ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { highlight: 'h:i A' } ), 'Selected value with "enter": ' + this.$input.pickatime( 'get', 'value' ) )
    }

    this.$input.focus()
    this.$input.trigger({ type: 'keydown', keyCode: 40 })
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 1410, 'Reached "down" limit: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )

    this.$input.trigger({ type: 'keydown', keyCode: 13 })
    ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { highlight: 'h:i A' } ), 'Selected value with "enter": ' + this.$input.pickatime( 'get', 'value' ) )

    for ( var j = 2; j < 49; j += 1 ) {

        this.$input.focus()
        this.$input.trigger({ type: 'keydown', keyCode: 38 })
        ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 1440 - 30 * j, 'Keyed "up" to: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )

        this.$input.trigger({ type: 'keydown', keyCode: 13 })
        ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { highlight: 'h:i A' } ), 'Selected value with "enter": ' + this.$input.pickatime( 'get', 'value' ) )
    }

    this.$input.trigger({ type: 'keydown', keyCode: 38 })
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 0, 'Reached "up" limit: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )
})




module( 'Time picker with a `value`', {
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

test( 'Checking input `value` to set time...', function() {
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 840, 'Element value sets correct time' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 840, 'Element value sets correct highlight' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 840, 'Element value sets correct view' )
    ok( !this.$input.siblings( '[type=hidden]' ).length, 'There is no hidden input' )
})




module( 'Time picker with a `data-value`', {
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

test( 'Checking input `data-value` to set time...', function() {
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 840, 'Selects correct time' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 840, 'Highlights correct time' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 840, 'Viewsets correct time' )
    ok( this.$input.siblings( '[type=hidden]' )[ 0 ].type === 'hidden', 'There is a hidden input' )
    ok( this.$input.siblings( '[type=hidden]' )[ 0 ].value === '14:00', 'The hidden input has correct value' )
})




module( 'Time picker with a `disable` collection', {
    setup: function() {
        this.$input = $( '<input type=time>' )
        $DOM.append( this.$input )
        this.$input.pickatime({
            disable: [ 0, 1, 10, [4,30], [22,30] ]
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Confirming disabled times with integers & arrays...', function() {

    var $input = this.$input,
        $holder = $input.pickatime( 'picker' ).$holder,
        interval = $input.pickatime( 'get', 'interval' )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index >= 0 && index < 4 || index >= 20 && index < 22 || index === 9 || index === 45 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        if ( index === 4 ) {
            ok( index * interval === $input.pickatime( 'get', 'select' ).PICK, 'Time selected shifted to 2:00 AM' )
            ok( index * interval === $input.pickatime( 'get', 'highlight' ).PICK, 'Time highlighted shifted to 2:00 AM' )
            ok( index * interval === $input.pickatime( 'get', 'view' ).PICK, 'View shifted to 2:00 AM' )
        }
    })
})

test( 'Flipping disabled times as enabled...', function() {

    var $input = this.$input,
        $holder = $input.pickatime( 'picker' ).$holder,
        interval = $input.pickatime( 'get', 'interval' )

    this.$input.pickatime( 'disableAll' )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index >= 0 && index < 4 || index >= 20 && index < 22 || index === 9 || index === 45 ) {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is not disabled: ' + item.innerHTML )
        }
        if ( index === 9 ) {
            ok( index * interval === $input.pickatime( 'get', 'select' ).PICK, 'Time selected shifted to 4:30 AM' )
            ok( index * interval === $input.pickatime( 'get', 'highlight' ).PICK, 'Time highlighted shifted to 4:30 AM' )
            ok( index * interval === $input.pickatime( 'get', 'view' ).PICK, 'View shifted to 4:30 AM' )
        }
    })

    this.$input.pickatime( 'disableAll', false )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index >= 0 && index < 4 || index >= 20 && index < 22 || index === 9 || index === 45 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is not disabled: ' + item.innerHTML )
        }
        if ( index === 10 ) {
            ok( index * interval === $input.pickatime( 'get', 'select' ).PICK, 'Time selected shifted to 4:30 AM' )
            ok( index * interval === $input.pickatime( 'get', 'highlight' ).PICK, 'Time highlighted shifted to 4:30 AM' )
            ok( index * interval === $input.pickatime( 'get', 'view' ).PICK, 'View shifted to 4:30 AM' )
        }
    })
})




module( 'Time picker `get` and `set` properties', {
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

test( 'Setting `min` & `max` with arrays...', function() {

    this.$input.pickatime( 'set', { min: [2,0] } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === 120, 'Sets min limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 120, 'Select updates accordingly' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 120, 'Highlight updates accordingly' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 120, 'View updates accordingly' )

    this.$input.pickatime( 'set', { max: [20,0] } )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === 1200, 'Sets max limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 120, 'Select unaffected' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 120, 'Highlight unaffected' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 120, 'View unaffected' )
})

test( 'Setting `min` & `max` with integers...', function() {

    var nowObject = this.$input.pickatime( 'get', 'now' ),
        interval = this.$input.pickatime( 'get', 'interval' )

    this.$input.pickatime( 'set', { min: -3 } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === nowObject.PICK - interval * 3, 'Sets negative min limit correctly' )

    this.$input.pickatime( 'set', { max: 3 } )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === nowObject.PICK + interval * 3, 'Sets positive max limit correctly' )

    this.$input.pickatime( 'set', { min: 3 } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === nowObject.PICK + interval * 3, 'Sets positive min limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === nowObject.PICK + interval * 3, 'Select updates accordingly' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === nowObject.PICK + interval * 3, 'Highlight updates accordingly' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === nowObject.PICK + interval * 3, 'View updates accordingly' )

    this.$input.pickatime( 'set', { max: -3 } )
    // If the max is less than the min, we need the next day's max time so add 1440.
    ok( this.$input.pickatime( 'get', 'max' ).PICK === nowObject.PICK - interval * 3 + ( this.$input.pickatime( 'get', 'min' ).PICK > this.$input.pickatime( 'get', 'max' ).PICK ? 0 : 1440 ), 'Sets negative max limit correctly' )
})

test( 'Setting `min` & `max` with booleans...', function() {

    var nowObject = this.$input.pickatime( 'get', 'now' )

    this.$input.pickatime( 'set', { min: true } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === nowObject.PICK, 'Sets min limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === nowObject.PICK, 'Select updates accordingly' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === nowObject.PICK, 'Highlight updates accordingly' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === nowObject.PICK, 'View updates accordingly' )

    this.$input.pickatime( 'set', { max: true } )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === nowObject.PICK, 'Sets max limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === nowObject.PICK, 'Select unaffected' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === nowObject.PICK, 'Highlight unaffected' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === nowObject.PICK, 'View unaffected' )
})

test( 'Setting `disable` with integers...', function() {

    var $input = this.$input,
        $holder = $input.pickatime( 'picker' ).$holder

    $input.pickatime( 'set', { disable: [0,1,4] } )

    ok( $input.pickatime( 'get', 'disable' ).toString() === [0,1,4].toString(), 'Disabled times added to collection' )
    ok( 120 === $input.pickatime( 'get', 'select' ).PICK, 'Select updated: 2:00 AM' )
    ok( 120 === $input.pickatime( 'get', 'highlight' ).PICK, 'Highlight updated: 2:00 AM' )
    ok( 120 === $input.pickatime( 'get', 'view' ).PICK, 'View updated: 2:00 AM' )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index >= 0 && index < 4 || index >= 8 && index < 10 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })

    $input.pickatime( 'set', { enable: [1] } )
    ok( $input.pickatime( 'get', 'disable' ).toString() === [0,4].toString(), 'Disabled time removed from collection' )
    ok( 120 === $input.pickatime( 'get', 'select' ).PICK, 'Select unaffected: 2:00 AM' )
    ok( 120 === $input.pickatime( 'get', 'highlight' ).PICK, 'Highlight unaffected: 2:00 AM' )
    ok( 120 === $input.pickatime( 'get', 'view' ).PICK, 'View unaffected: 2:00 AM' )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index >= 0 && index < 2 || index >= 8 && index < 10 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })
})

test( 'Setting `disable` with arrays...', function() {

    this.$input.pickatime( 'set', { disable: [ [1,0],[4,30],[18,0],[23,30] ] } )

    ok( this.$input.pickatime( 'get', 'disable' ).toString() === [ [1,0],[4,30],[18,0],[23,30] ].toString(), 'Disabled times added to collection' )

    var $holder = this.$input.pickatime( 'picker' ).$holder

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index === 2 || index === 9 || index === 36 || index === 47 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })

    this.$input.pickatime( 'set', { enable: [ [4,30] ] } )
    ok( this.$input.pickatime( 'get', 'disable' ).toString() === [ [1,0],[18,0],[23,30] ].toString(), 'Disabled time removed from collection' )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index === 2 || index === 36 || index === 47 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else {
            ok( !$( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is enabled: ' + item.innerHTML )
        }
    })
})

test( 'Setting `select` with arrays...', function() {
    this.$input.pickatime( 'set', { select: [9,0] } )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 540, 'Selects time correctly' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 0, 'Highlight unaffected' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 0, 'View unaffected' )
})

test( 'Setting `highlight` with arrays...', function() {
    this.$input.pickatime( 'set', { highlight: [14,0] } )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 840, 'Highlights time correctly' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 840, 'View updates accordingly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 0, 'Select unaffected' )
})

test( 'Setting `view` with arrays...', function() {
    this.$input.pickatime( 'set', { view: [16,0] } )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 960, 'Viewsets correctly' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 0, 'Highlight unaffected' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 0, 'Select unaffected' )
})

test( 'Setting `interval` with integers...', function() {

    var $holder = this.$input.pickatime( 'picker' ).$holder

    this.$input.pickatime( 'set', { interval: 120 } )
    ok( this.$input.pickatime( 'get', 'interval' ) === 120, 'Interval updated' )
    ok( this.$input.pickatime( 'get', 'min' ).PICK % 120 === 0, 'Min updated accordingly' )
    ok( this.$input.pickatime( 'get', 'max' ).PICK % 120 === 0, 'Max updated accordingly' )
    ok( $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).length === 12, 'There are 12 selectable times' )

    this.$input.pickatime( 'set', { interval: 'asdf' } )
    ok( this.$input.pickatime( 'get', 'interval' ) === 120, 'Interval unaffected by non-integer' )
})





