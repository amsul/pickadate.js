
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */


/**
 * To do:
 * – intervals
 * – "flip" disabled
 */


var $DOM = $( '#qunit-fixture' )



/* ==========================================================================
   Time picker tests
   ========================================================================== */


module( 'Set up the time picker stage', {
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
    var $holder = this.$input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] )
    ok( $holder.length, 'There is a picker holder right after the input element' )
    ok( $holder.find( '[data-pick]' ).length === 48, 'There are 48 selectable times at 30 minute intervals' )
})

test( 'Checking picker objects...', function() {
    var nowDateObject = new Date(),
        nowTimeMinutes = nowDateObject.getHours() * 60 + nowDateObject.getMinutes(),
        interval = $.fn.pickatime.defaults.interval
    ok( this.$input.pickatime( 'get', 'now' ).PICK === interval + nowTimeMinutes - ( nowTimeMinutes % interval ), 'Now time is correct at ' + this.$input.pickatime( 'get', 'now' ).HOUR + ':' + this.$input.pickatime( 'get', 'now' ).MINS )
    ok( !this.$input.pickatime( 'get', 'disable' ).length, 'No disabled times' )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === 0, 'Selected time is midnight' )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === 0, 'Min time is midnight' )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === 1410, 'Max time is 23:30' )
})




module( 'General events on the time picker', {
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




module( 'Mouse events on the time picker', {
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

    var $holder = this.$input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] ),
        interval = this.$input.pickatime( 'picker' ).component.i

    for ( var i = 0; i < 48; i += 1 ) {
        $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).eq( i ).click()
        ok( this.$input.pickatime( 'get', 'select' ).PICK === i * interval, 'Selected ' + this.$input.pickatime( 'get', { select: 'h:i A' } ) )
        ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { select: 'h:i A' } ), 'Input value updated to ' + this.$input.pickatime( 'get', 'value' ) )
    }
})

test( 'Checking click to clear...', function() {

    var $holder = this.$input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] )

    this.$input.pickatime( 'set', { select: [4,30] } )
    ok( this.$input.pickatime( 'get', 'value' ) === '4:30 AM', 'Input has a value' )

    $holder.find( '.' + $.fn.pickatime.defaults.klass.buttonClear ).click()
    ok( this.$input.pickatime( 'get', 'value' ) === '', 'Input value has cleared' )
})




module( 'Keyboard events on the time picker', {
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
        ok( this.$input.pickatime( 'get', 'view' ).PICK === this.$input.pickatime( 'get', 'highlight' ).PICK, 'Updated "view" to: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )

        this.$input.trigger({ type: 'keydown', keyCode: 13 })
        ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { highlight: 'h:i A' } ), 'Selected value with "enter": ' + this.$input.pickatime( 'get', 'value' ) )
    }

    this.$input.focus()
    this.$input.trigger({ type: 'keydown', keyCode: 40 })
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 1410, 'Reached "down" limit: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )

    this.$input.trigger({ type: 'keydown', keyCode: 13 })
    ok( this.$input.pickatime( 'get', 'value' ) === this.$input.pickatime( 'get', { highlight: 'h:i A' } ), 'Selected value with "enter": ' + this.$input.pickatime( 'get', 'value' ) )

    for ( var i = 2; i < 49; i += 1 ) {

        this.$input.focus()
        this.$input.trigger({ type: 'keydown', keyCode: 38 })
        ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 1440 - 30 * i, 'Keyed "up" to: ' + this.$input.pickatime( 'get', { highlight: 'h:i A' } ) )

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




module( 'Time picker with `disable` collection', {
    setup: function() {
        this.$input = $( '<input type=time>' )
        $DOM.append( this.$input )
        this.$input.pickatime({
            disable: [ 0, 1, 10, 23, [4,30], [23,30] ]
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Confirming disabled times with integers & arrays...', function() {

    var $input = this.$input,
        $holder = $input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] ),
        interval = $input.pickatime( 'picker' ).component.i

    $holder.find( '.' + $.fn.pickatime.defaults.klass.listItem ).each( function( index, item ) {
        if ( index >= 0 && index < 4 || index >= 20 && index < 22 || index >= 46 && index < 48 || index === 9 || index === 48 ) {
            ok( $( item ).hasClass( $.fn.pickatime.defaults.klass.disabled ), 'Time is disabled: ' + item.innerHTML )
        }
        else if ( index === 4 ) {
            ok( index * interval === $input.pickatime( 'get', 'select' ).PICK, 'Time selected shifted to 2:00 AM' )
            ok( index * interval === $input.pickatime( 'get', 'highlight' ).PICK, 'Time highlighted shifted to 2:00 AM' )
            ok( index * interval === $input.pickatime( 'get', 'view' ).PICK, 'View shifted to 2:00 AM' )
        }
    })
})




module( 'Get and set time picker properties', {
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
        interval = this.$input.pickatime( 'picker' ).component.i

    this.$input.pickatime( 'set', { min: -3 } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === nowObject.PICK - interval * 3, 'Sets negative min limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === nowObject.PICK - interval * 3, 'Select updates accordingly' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === nowObject.PICK - interval * 3, 'Highlight updates accordingly' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === nowObject.PICK - interval * 3, 'View updates accordingly' )

    this.$input.pickatime( 'set', { max: 3 } )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === nowObject.PICK + interval * 3, 'Sets positive max limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === nowObject.PICK - interval * 3, 'Select unaffected' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === nowObject.PICK - interval * 3, 'Highlight unaffected' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === nowObject.PICK - interval * 3, 'View unaffected' )

    this.$input.pickatime( 'set', { min: 3 } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === nowObject.PICK + interval * 3, 'Sets positive min limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === nowObject.PICK + interval * 3, 'Select updates accordingly' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === nowObject.PICK + interval * 3, 'Highlight updates accordingly' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === nowObject.PICK + interval * 3, 'View updates accordingly' )

    this.$input.pickatime( 'set', { max: -3 } )
    // If the max is less than the min, we need the next day's max time so add 1440.
    ok( this.$input.pickatime( 'get', 'max' ).PICK === nowObject.PICK - interval * 3 + ( this.$input.pickatime( 'get', 'min' ).PICK > this.$input.pickatime( 'get', 'max' ).PICK ? 0 : 1440 ), 'Sets negative max limit correctly' )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === nowObject.PICK + interval * 3, 'Select unaffected' )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === nowObject.PICK + interval * 3, 'Highlight unaffected' )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === nowObject.PICK + interval * 3, 'View unaffected' )
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
        $holder = $input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] )

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

    var $holder = this.$input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] )

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















/* ==========================================================================
   Date picker tests
   ========================================================================== */


// module( 'Events on the date picker', {
//     setup: function() {
//         var thisModule = this
//         thisModule.$input = $( '<input type=date>' )
//         $DOM.append( thisModule.$input )
//         thisModule.$input.pickadate({
//             onStart: function() {
//                 thisModule.started = true
//                 thisModule.restarted = thisModule.stopped && thisModule.started
//                 thisModule.updatedType = thisModule.$input[ 0 ].type === 'text'
//             },
//             onRender: function() {
//                 thisModule.rendered = true
//             },
//             onOpen: function() {
//                 thisModule.opened = true
//             },
//             onClose: function() {
//                 thisModule.closed = true
//             },
//             onSet: function() {
//                 thisModule.selectedArray = this.get( 'select' ).PICK === 1365912000000
//                 thisModule.selectedNumber = this.get( 'select' ).PICK === 1366084800000
//                 thisModule.selectedDateObject = this.get( 'select' ).PICK === 1366257600000
//                 thisModule.clearedValue = this.get( 'value' ) === ''
//             },
//             onStop: function() {
//                 thisModule.stopped = true
//                 thisModule.restoredType = thisModule.$input[ 0 ].type === 'date'
//             }
//         })
//     },
//     teardown: function() {
//         delete this.$input
//         $DOM.empty()
//     }
// })

// test( 'Checking the basic events...', function() {

//     ok( this.started, 'Started up fine' )
//     ok( this.updatedType, 'Updated the element type' )

//     ok( this.rendered, 'Rendered correctly' )

//     this.$input.pickadate( 'open' )
//     ok( this.opened, 'Opened just fine with a trigger' )

//     this.$input.pickadate( 'close' )
//     ok( this.closed, 'Closed just fine with a trigger' )

//     this.$input.pickadate( 'stop' )
//     ok( this.stopped, 'Stopped just fine' )
//     ok( this.restoredType, 'Restored the element type' )

//     this.$input.pickadate( 'start' )
//     ok( this.restarted, 'Restarted just fine' )
//     ok( this.updatedType, 'Updated the element type' )
// })

// test( 'Checking the `set` events...', function() {

//     this.$input.pickadate( 'set', { select: [2013,3,14] } )
//     ok( this.selectedArray, 'Selected from an array' )

//     this.$input.pickadate( 'set', { select: 1366084800000 } )
//     ok( this.selectedNumber, 'Selected from a number' )

//     this.$input.pickadate( 'set', { select: new Date(2013,3,18) } )
//     ok( this.selectedDateObject, 'Selected from a JS date object' )

//     this.$input.pickadate( 'clear' )
//     ok( this.clearedValue, 'Cleared the input value' )
// })



// module( 'Set up the date picker stage', {
//     setup: function() {
//         this.$input = $( '<input type=date>' )
//         $DOM.append( this.$input )
//         this.$input.pickadate()
//     },
//     teardown: function() {
//         delete this.$input
//         $DOM.empty()
//     }
// })

// test( 'Checking holder states...', function () {

//     ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by default' )

//     this.$input.pickadate( 'open' )
//     ok( this.$input.pickadate( 'isOpen' ) === true, 'Opened with trigger' )

//     this.$input.pickadate( 'close' )
//     ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by trigger' )

//     this.$input.focus()
//     ok( this.$input.pickadate( 'isOpen' ) === true, 'Opened with focus' )

//     this.$input.blur()
//     $( 'body' ).focus()
//     ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by losing focus' )

//     this.$input.click()
//     ok( this.$input.pickadate( 'isOpen' ) === true, 'Opened with click' )

//     $( 'body' ).click()
//     ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by clicking outside' )
// })

// test( 'Checking input attributes...', function() {
//     ok( this.$input[ 0 ].type === 'text', 'Input type updated' )
//     ok( this.$input[ 0 ].readOnly === true, 'Input is readonly' )
//     ok( this.$input.pickadate( 'get', 'select' ).PICK === this.$input.pickadate( 'get', 'now' ).PICK, 'Default selected time is correct' )
// })

// test( 'Checking picker holder...', function() {
//     var $holder = this.$input.next( '.' + $.fn.pickadate.defaults.klass.holder.split( ' ' )[ 0 ] )
//     ok( $holder.length, 'There is a picker holder right after the input element' )
//     ok( $holder.find( '.' + $.fn.pickadate.defaults.klass.table + ' [data-pick]' ).length === 42, 'There are 42 dates on the calendar' )
// })

// test( 'Checking picker objects...', function() {
//     var nowDateObject = new Date()
//     nowDateObject.setHours( 0, 0, 0, 0 )
//     ok( this.$input.pickadate( 'get', 'now' ).PICK === nowDateObject.getTime(), 'Now date is correct at ' + this.$input.pickadate( 'get', 'now' ).YEAR + '/' + ( this.$input.pickadate( 'get', 'now' ).MONTH + 1 ) + '/' + this.$input.pickadate( 'get', 'now' ).DATE )
//     ok( !this.$input.pickadate( 'get', 'disable' ).length, 'No disabled dates' )
//     ok( this.$input.pickadate( 'get', 'min' ).PICK === -Infinity, 'Min date is negative Infinity' )
//     ok( this.$input.pickadate( 'get', 'max' ).PICK === Infinity, 'Max date is positive Infinity' )
// })




// module( 'Date picker with a `value`', {
//     setup: function() {
//         this.$input = $( '<input type=date value="14 August, 1988">' )
//         $DOM.append( this.$input )
//         this.$input.pickadate()
//     },
//     teardown: function() {
//         delete this.$input
//         $DOM.empty()
//     }
// })

// test( 'Checking input `value` to set date...', function() {
//     ok( this.$input.pickadate( 'get', 'select' ).PICK === 587534400000, 'Element value sets correct date' )
//     ok( this.$input.pickadate( 'get', 'highlight' ).PICK === 587534400000, 'Element value sets correct highlight' )
//     ok( this.$input.pickadate( 'get', 'view' ).PICK === 586411200000, 'Element value sets correct view' )
//     ok( !this.$input.siblings( '[type=hidden]' ).length, 'There is no hidden input' )
// })




// module( 'Date picker with a `data-value`', {
//     setup: function() {
//         this.$input = $( '<input type=date data-value="1988/08/14">' )
//         $DOM.append( this.$input )
//         this.$input.pickadate({
//             formatSubmit: 'yyyy/mm/dd'
//         })
//     },
//     teardown: function() {
//         delete this.$input
//         $DOM.empty()
//     }
// })

// test( 'Checking input `data-value` to set date...', function() {
//     ok( this.$input.pickadate( 'get', 'select' ).PICK === 587534400000, 'Selects correct date' )
//     ok( this.$input.pickadate( 'get', 'highlight' ).PICK === 587534400000, 'Highlights correct date' )
//     ok( this.$input.pickadate( 'get', 'view' ).PICK === 586411200000, 'Viewsets correct date' )
//     ok( this.$input.siblings( '[type=hidden]' )[ 0 ].type === 'hidden', 'There is a hidden input' )
//     ok( this.$input.siblings( '[type=hidden]' )[ 0 ].value === '1988/08/14', 'The hidden input has correct value' )
// })




// module( 'Get and set date picker properties', {
//     setup: function() {
//         this.$input = $( '<input type=date>' )
//         $DOM.append( this.$input )
//         this.$input.pickadate()
//     },
//     teardown: function() {
//         delete this.$input
//         $DOM.empty()
//     }
// })

// test( 'Setting properties with arrays...', function() {

//     this.$input.pickadate( 'set', { select: [1988,7,14] } )
//     ok( this.$input.pickadate( 'get', 'select' ).PICK === 587534400000, 'Selects date correctly' )

//     this.$input.pickadate( 'set', { highlight: [1988,7,16] } )
//     ok( this.$input.pickadate( 'get', 'highlight' ).PICK === 587707200000, 'Highlights date correctly' )

//     this.$input.pickadate( 'set', { view: [1988,7,18] } )
//     ok( this.$input.pickadate( 'get', 'view' ).PICK === 586411200000, 'Adjusts view correctly' )

//     this.$input.pickadate( 'set', { min: [1988,7,12] } )
//     ok( this.$input.pickadate( 'get', 'min' ).PICK === 587361600000, 'Sets min limit correctly' )

//     this.$input.pickadate( 'set', { max: [1988,7,20] } )
//     ok( this.$input.pickadate( 'get', 'max' ).PICK === 588052800000, 'Sets max limit correctly' )
// })

// test( 'Setting properties with integers...', function() {

//     var nowObject = this.$input.pickadate( 'get', 'now' )

//     this.$input.pickadate( 'set', { min: 3 } )
//     var minObject = this.$input.pickadate( 'get', 'min' )
//     ok( minObject.YEAR === nowObject.YEAR && minObject.MONTH === nowObject.MONTH && minObject.DATE === nowObject.DATE + 3, 'Sets positive min limit correctly' )

//     this.$input.pickadate( 'set', { min: -3 } )
//     minObject = this.$input.pickadate( 'get', 'min' )
//     ok( minObject.YEAR === nowObject.YEAR && minObject.MONTH === nowObject.MONTH && minObject.DATE === nowObject.DATE - 3, 'Sets negative min limit correctly' )

//     this.$input.pickadate( 'set', { max: 3 } )
//     var maxObject = this.$input.pickadate( 'get', 'max' )
//     ok( maxObject.YEAR === nowObject.YEAR && maxObject.MONTH === nowObject.MONTH && maxObject.DATE === nowObject.DATE + 3, 'Sets positive max limit correctly' )

//     this.$input.pickadate( 'set', { max: -3 } )
//     maxObject = this.$input.pickadate( 'get', 'max' )
//     ok( maxObject.YEAR === nowObject.YEAR && maxObject.MONTH === nowObject.MONTH && maxObject.DATE === nowObject.DATE - 3, 'Sets negative max limit correctly' )
// })

// test( 'Setting properties with booleans...', function() {

//     this.$input.pickadate( 'set', { min: true } )
//     ok( this.$input.pickadate( 'get', 'min' ).PICK === this.$input.pickadate( 'get', 'now' ).PICK, 'Sets min limit correctly' )

//     this.$input.pickadate( 'set', { max: true } )
//     ok( this.$input.pickadate( 'get', 'max' ).PICK === this.$input.pickadate( 'get', 'now' ).PICK, 'Sets max limit correctly' )
// })
