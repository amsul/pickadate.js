
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */


/**
 * To do:
 * – disabled times & dates
 * – selection out of view/disabled
 */


var $DOM = $( '#qunit-fixture' )



/* ==========================================================================
   Time picker tests
   ========================================================================== */


module( 'Events on the time picker', {
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

    var thisModule = this

    ok( thisModule.started, 'Started up fine' )
    ok( thisModule.updatedType, 'Updated the element type' )

    ok( thisModule.rendered, 'Rendered correctly' )

    thisModule.$input.pickatime( 'open' )
    ok( thisModule.opened, 'Opened just fine with a trigger' )

    thisModule.$input.pickatime( 'close' )
    ok( thisModule.closed, 'Closed just fine with a trigger' )

    thisModule.$input.pickatime( 'stop' )
    ok( thisModule.stopped, 'Stopped just fine' )
    ok( thisModule.restoredType, 'Restored the element type' )

    thisModule.$input.pickatime( 'start' )
    ok( thisModule.restarted, 'Restarted just fine' )
    ok( thisModule.updatedType, 'Updated the element type' )
})

test( 'Checking the `set` events...', function() {

    var thisModule = this

    thisModule.$input.pickatime( 'set', { select: [10,0] } )
    ok( thisModule.selectedArray, 'Selected from an array' )

    thisModule.$input.pickatime( 'set', { select: 120 } )
    ok( thisModule.selectedNumber, 'Selected from a number' )

    thisModule.$input.pickatime( 'clear' )
    ok( thisModule.clearedValue, 'Cleared the input value' )
})



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
    ok( this.$input.pickatime( 'get', 'min' ).PICK === 0, 'Min time is midnight' )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === 1410, 'Max time is 23:30' )
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

test( 'Setting properties with arrays...', function() {

    this.$input.pickatime( 'set', { select: [9,0] } )
    ok( this.$input.pickatime( 'get', 'select' ).PICK === 540, 'Selects time correctly' )

    this.$input.pickatime( 'set', { highlight: [14,0] } )
    ok( this.$input.pickatime( 'get', 'highlight' ).PICK === 840, 'Highlights time correctly' )

    this.$input.pickatime( 'set', { view: [16,0] } )
    ok( this.$input.pickatime( 'get', 'view' ).PICK === 960, 'Adjusts view correctly' )

    this.$input.pickatime( 'set', { min: [2,0] } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === 120, 'Sets min limit correctly' )

    this.$input.pickatime( 'set', { max: [20,0] } )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === 1200, 'Sets max limit correctly' )
})

test( 'Settings properties with integers...', function() {

    var nowObject = this.$input.pickatime( 'get', 'now' ),
        interval = this.$input.pickatime( 'picker' ).component.i

    this.$input.pickatime( 'set', { min: -3 } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === nowObject.PICK - interval * 3, 'Sets negative min limit correctly' )

    this.$input.pickatime( 'set', { max: 3 } )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === nowObject.PICK + interval * 3, 'Sets positive max limit correctly' )

    this.$input.pickatime( 'set', { min: 3 } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === nowObject.PICK + interval * 3, 'Sets positive min limit correctly' )

    this.$input.pickatime( 'set', { max: -3 } )
    // We add 1440 here because the min is greater than the max. So we essentially get the next day's max time.
    ok( this.$input.pickatime( 'get', 'max' ).PICK === nowObject.PICK - interval * 3 + 1440, 'Sets negative max limit correctly' )
})

test( 'Settings properties with booleans...', function() {

    this.$input.pickatime( 'set', { min: true } )
    ok( this.$input.pickatime( 'get', 'min' ).PICK === this.$input.pickatime( 'get', 'now' ).PICK, 'Sets min limit correctly' )

    this.$input.pickatime( 'set', { max: true } )
    ok( this.$input.pickatime( 'get', 'max' ).PICK === this.$input.pickatime( 'get', 'now' ).PICK, 'Sets max limit correctly' )
})












/* ==========================================================================
   Date picker tests
   ========================================================================== */


module( 'Events on the date picker', {
    setup: function() {
        var thisModule = this
        thisModule.$input = $( '<input type=date>' )
        $DOM.append( thisModule.$input )
        thisModule.$input.pickadate({
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
                thisModule.selectedArray = this.get( 'select' ).PICK === 1365912000000
                thisModule.selectedNumber = this.get( 'select' ).PICK === 1366084800000
                thisModule.selectedDateObject = this.get( 'select' ).PICK === 1366257600000
                thisModule.clearedValue = this.get( 'value' ) === ''
            },
            onStop: function() {
                thisModule.stopped = true
                thisModule.restoredType = thisModule.$input[ 0 ].type === 'date'
            }
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking the basic events...', function() {

    var thisModule = this

    ok( thisModule.started, 'Started up fine' )
    ok( thisModule.updatedType, 'Updated the element type' )

    ok( thisModule.rendered, 'Rendered correctly' )

    thisModule.$input.pickadate( 'open' )
    ok( thisModule.opened, 'Opened just fine with a trigger' )

    thisModule.$input.pickadate( 'close' )
    ok( thisModule.closed, 'Closed just fine with a trigger' )

    thisModule.$input.pickadate( 'stop' )
    ok( thisModule.stopped, 'Stopped just fine' )
    ok( thisModule.restoredType, 'Restored the element type' )

    thisModule.$input.pickadate( 'start' )
    ok( thisModule.restarted, 'Restarted just fine' )
    ok( thisModule.updatedType, 'Updated the element type' )
})

test( 'Checking the `set` events...', function() {

    var thisModule = this

    thisModule.$input.pickadate( 'set', { select: [2013,3,14] } )
    ok( thisModule.selectedArray, 'Selected from an array' )

    thisModule.$input.pickadate( 'set', { select: 1366084800000 } )
    ok( thisModule.selectedNumber, 'Selected from a number' )

    thisModule.$input.pickadate( 'set', { select: new Date(2013,3,18) } )
    ok( thisModule.selectedDateObject, 'Selected from a JS date object' )

    thisModule.$input.pickadate( 'clear' )
    ok( thisModule.clearedValue, 'Cleared the input value' )
})



module( 'Set up the date picker stage', {
    setup: function() {
        this.$input = $( '<input type=date>' )
        $DOM.append( this.$input )
        this.$input.pickadate()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking holder states...', function () {

    ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by default' )

    this.$input.pickadate( 'open' )
    ok( this.$input.pickadate( 'isOpen' ) === true, 'Opened with trigger' )

    this.$input.pickadate( 'close' )
    ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by trigger' )

    this.$input.focus()
    ok( this.$input.pickadate( 'isOpen' ) === true, 'Opened with focus' )

    this.$input.blur()
    $( 'body' ).focus()
    ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by losing focus' )

    this.$input.click()
    ok( this.$input.pickadate( 'isOpen' ) === true, 'Opened with click' )

    $( 'body' ).click()
    ok( this.$input.pickadate( 'isOpen' ) === false, 'Closed by clicking outside' )
})

test( 'Checking input attributes...', function() {
    ok( this.$input[ 0 ].type === 'text', 'Input type updated' )
    ok( this.$input[ 0 ].readOnly === true, 'Input is readonly' )
    ok( this.$input.pickadate( 'get', 'select' ).PICK === this.$input.pickadate( 'get', 'now' ).PICK, 'Default selected time is correct' )
})

test( 'Checking picker holder...', function() {
    var $holder = this.$input.next( '.' + $.fn.pickadate.defaults.klass.holder.split( ' ' )[ 0 ] )
    ok( $holder.length, 'There is a picker holder right after the input element' )
    ok( $holder.find( '.' + $.fn.pickadate.defaults.klass.table + ' [data-pick]' ).length === 42, 'There are 42 dates on the calendar' )
})

test( 'Checking picker objects...', function() {
    var nowDateObject = new Date()
    nowDateObject.setHours( 0, 0, 0, 0 )
    ok( this.$input.pickadate( 'get', 'now' ).PICK === nowDateObject.getTime(), 'Now date is correct at ' + this.$input.pickadate( 'get', 'now' ).YEAR + '/' + ( this.$input.pickadate( 'get', 'now' ).MONTH + 1 ) + '/' + this.$input.pickadate( 'get', 'now' ).DATE )
    ok( !this.$input.pickadate( 'get', 'disable' ).length, 'No disabled dates' )
    ok( this.$input.pickadate( 'get', 'min' ).PICK === -Infinity, 'Min date is negative Infinity' )
    ok( this.$input.pickadate( 'get', 'max' ).PICK === Infinity, 'Max date is positive Infinity' )
})




module( 'Date picker with a `value`', {
    setup: function() {
        this.$input = $( '<input type=date value="14 August, 1988">' )
        $DOM.append( this.$input )
        this.$input.pickadate()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking input `value` to set date...', function() {
    ok( this.$input.pickadate( 'get', 'select' ).PICK === 587534400000, 'Element value sets correct date' )
    ok( this.$input.pickadate( 'get', 'highlight' ).PICK === 587534400000, 'Element value sets correct highlight' )
    ok( this.$input.pickadate( 'get', 'view' ).PICK === 586411200000, 'Element value sets correct view' )
    ok( !this.$input.siblings( '[type=hidden]' ).length, 'There is no hidden input' )
})




module( 'Date picker with a `data-value`', {
    setup: function() {
        this.$input = $( '<input type=date data-value="1988/08/14">' )
        $DOM.append( this.$input )
        this.$input.pickadate({
            formatSubmit: 'yyyy/mm/dd'
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking input `data-value` to set date...', function() {
    ok( this.$input.pickadate( 'get', 'select' ).PICK === 587534400000, 'Selects correct date' )
    ok( this.$input.pickadate( 'get', 'highlight' ).PICK === 587534400000, 'Highlights correct date' )
    ok( this.$input.pickadate( 'get', 'view' ).PICK === 586411200000, 'Viewsets correct date' )
    ok( this.$input.siblings( '[type=hidden]' )[ 0 ].type === 'hidden', 'There is a hidden input' )
    ok( this.$input.siblings( '[type=hidden]' )[ 0 ].value === '1988/08/14', 'The hidden input has correct value' )
})




module( 'Get and set date picker properties', {
    setup: function() {
        this.$input = $( '<input type=date>' )
        $DOM.append( this.$input )
        this.$input.pickadate()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Setting properties with arrays...', function() {

    this.$input.pickadate( 'set', { select: [1988,7,14] } )
    ok( this.$input.pickadate( 'get', 'select' ).PICK === 587534400000, 'Selects date correctly' )

    this.$input.pickadate( 'set', { highlight: [1988,7,16] } )
    ok( this.$input.pickadate( 'get', 'highlight' ).PICK === 587707200000, 'Highlights date correctly' )

    this.$input.pickadate( 'set', { view: [1988,7,18] } )
    ok( this.$input.pickadate( 'get', 'view' ).PICK === 586411200000, 'Adjusts view correctly' )

    this.$input.pickadate( 'set', { min: [1988,7,12] } )
    ok( this.$input.pickadate( 'get', 'min' ).PICK === 587361600000, 'Sets min limit correctly' )

    this.$input.pickadate( 'set', { max: [1988,7,20] } )
    ok( this.$input.pickadate( 'get', 'max' ).PICK === 588052800000, 'Sets max limit correctly' )
})

test( 'Settings properties with integers...', function() {

    var nowObject = this.$input.pickadate( 'get', 'now' )

    this.$input.pickadate( 'set', { min: 3 } )
    var minObject = this.$input.pickadate( 'get', 'min' )
    ok( minObject.YEAR === nowObject.YEAR && minObject.MONTH === nowObject.MONTH && minObject.DATE === nowObject.DATE + 3, 'Sets positive min limit correctly' )

    this.$input.pickadate( 'set', { min: -3 } )
    minObject = this.$input.pickadate( 'get', 'min' )
    ok( minObject.YEAR === nowObject.YEAR && minObject.MONTH === nowObject.MONTH && minObject.DATE === nowObject.DATE - 3, 'Sets negative min limit correctly' )

    this.$input.pickadate( 'set', { max: 3 } )
    var maxObject = this.$input.pickadate( 'get', 'max' )
    ok( maxObject.YEAR === nowObject.YEAR && maxObject.MONTH === nowObject.MONTH && maxObject.DATE === nowObject.DATE + 3, 'Sets positive max limit correctly' )

    this.$input.pickadate( 'set', { max: -3 } )
    maxObject = this.$input.pickadate( 'get', 'max' )
    ok( maxObject.YEAR === nowObject.YEAR && maxObject.MONTH === nowObject.MONTH && maxObject.DATE === nowObject.DATE - 3, 'Sets negative max limit correctly' )
})
