
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */


var $DOM = $( '#qunit-fixture' )



/* ==========================================================================
   Date picker tests
   ========================================================================== */


module( 'Date picker stage setup', {
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
    ok( this.$input.pickadate( 'get', 'select' ).PICK === this.$input.pickadate( 'get', 'now' ).PICK, 'Default selected date is correct' )
})

test( 'Checking picker holder...', function() {
    var $holder = this.$input.pickadate( 'picker' ).$holder
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




module( 'Date picker general events', {
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

                var today = new Date(),
                    dateObject = this.get( 'select' )

                today.setHours(0,0,0,0)
                thisModule.selectedNumber = dateObject.PICK === today.getTime()

                thisModule.selectedArray = [dateObject.YEAR,dateObject.MONTH,dateObject.DATE].toString() === [1988,7,14].toString()

                thisModule.selectedDateObject = [dateObject.YEAR,dateObject.MONTH,dateObject.DATE].toString() === [2013,7,14].toString()

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

    ok( this.started, 'Started up fine' )
    ok( this.updatedType, 'Updated the element type' )

    ok( this.rendered, 'Rendered correctly' )

    this.$input.pickadate( 'open' )
    ok( this.opened, 'Opened just fine with a trigger' )

    this.$input.pickadate( 'close' )
    ok( this.closed, 'Closed just fine with a trigger' )

    this.$input.pickadate( 'stop' )
    ok( this.stopped, 'Stopped just fine' )
    ok( this.restoredType, 'Restored the element type' )

    this.$input.pickadate( 'start' )
    ok( this.restarted, 'Restarted just fine' )
    ok( this.updatedType, 'Updated the element type' )
})

test( 'Checking the `set` events...', function() {

    this.$input.pickadate( 'set', { select: new Date().getTime() } )
    ok( this.selectedNumber, 'Selected from a number' )

    this.$input.pickadate( 'set', { select: [1988,7,14] } )
    ok( this.selectedArray, 'Selected from an array' )

    this.$input.pickadate( 'set', { select: new Date(2013,7,14) } )
    ok( this.selectedDateObject, 'Selected from a JS date object' )

    this.$input.pickadate( 'clear' )
    ok( this.clearedValue, 'Cleared the input value' )
})




module( 'Date picker mouse events', {
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

test( 'Checking click to open and close...', function() {

    ok( !this.$input.pickadate( 'isOpen' ), 'Closed to start with' )

    this.$input.click()
    ok( this.$input.pickadate( 'isOpen' ), 'Opened after click' )
})

test( 'Checking click to select...', function() {

    var $holder = this.$input.pickadate( 'picker' ).$holder,
        viewsetObject = this.$input.pickadate( 'get', 'view' ),
        interval = 86400000,
        monthStart = viewsetObject.DAY,
        monthEnd = new Date()

    monthEnd.setMonth( monthEnd.getMonth() + 1 )
    monthEnd.setDate( 0 )

    for ( var i = monthStart; i <= monthEnd.getDate(); i += 1 ) {
        $holder.find( '.' + $.fn.pickadate.defaults.klass.day ).eq( i ).click()
        ok( this.$input.pickadate( 'get', 'select' ).PICK === viewsetObject.PICK + ( i - 1 ) * interval, 'Selected ' + this.$input.pickadate( 'get', { select: 'yyyy-mm-dd' } ) )
        ok( this.$input.pickadate( 'get', 'value' ) === this.$input.pickadate( 'get', { select: $.fn.pickadate.defaults.format } ), 'Input value updated to ' + this.$input.pickadate( 'get', 'value' ) )
    }
})

test( 'Checking click to clear...', function() {

    var $holder = this.$input.pickadate( 'picker' ).$holder

    this.$input.pickadate( 'set', { select: [2013,3,20] } )
    ok( this.$input.pickadate( 'get', 'value' ) === '20 April, 2013', 'Input has a value' )

    $holder.find( '.' + $.fn.pickadate.defaults.klass.buttonClear ).click()
    ok( this.$input.pickadate( 'get', 'value' ) === '', 'Input value has cleared' )
})




module( 'Date picker keyboard events', {
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

test( 'Checking keydown to open and close...', function() {

    ok( !this.$input.pickadate( 'isOpen' ), 'Closed to start with' )

    this.$input.trigger({ type: 'keydown', keyCode: 40 })
    ok( this.$input.pickadate( 'isOpen' ), 'Opened after pressing "down"' )

    this.$input.trigger({ type: 'keydown', keyCode: 27 })
    ok( !this.$input.pickadate( 'isOpen' ), 'Closed after pressing "escape"' )

    this.$input.trigger({ type: 'keydown', keyCode: 38 })
    ok( this.$input.pickadate( 'isOpen' ), 'Opened after pressing "up"' )

    this.$input.trigger({ type: 'keydown', keyCode: 8 })
    ok( !this.$input.pickadate( 'isOpen' ), 'Closed after pressing "backspace"' )

    this.$input.trigger({ type: 'keydown', keyCode: 37 })
    ok( this.$input.pickadate( 'isOpen' ), 'Opened after pressing "left"' )

    this.$input.trigger({ type: 'keydown', keyCode: 46 })
    ok( !this.$input.pickadate( 'isOpen' ), 'Closed after pressing "alt. backspace"' )

    this.$input.trigger({ type: 'keydown', keyCode: 39 })
    ok( this.$input.pickadate( 'isOpen' ), 'Opened after pressing "right"' )
})

test( 'Checking keydown to highlight, viewset, and select...', function() {

    var playDate = new Date()

    this.$input.focus()
    ok( this.$input.pickadate( 'get', 'highlight' ).PICK === new Date().setHours(0,0,0,0), 'Focused in: ' + this.$input.pickadate( 'get', { highlight: 'yyyy-mm-dd' } ) )

    this.$input.trigger({ type: 'keydown', keyCode: 13 })
    ok( this.$input.pickadate( 'get', 'value' ) === this.$input.pickadate( 'get', { highlight: $.fn.pickadate.defaults.format } ), 'Selected value with "enter": ' + this.$input.pickadate( 'get', 'value' ) )
    ok( !this.$input.pickadate( 'isOpen' ), 'Closed after selecting' )


    // Open the picker
    this.$input.focus()

    // Down
    for ( var i = 0; i < 10; i += 1 ) {

        this.$input.trigger({ type: 'keydown', keyCode: 40 })
        playDate.setDate( playDate.getDate() + 7 )
        ok( this.$input.pickadate( 'get', 'highlight' ).DATE === playDate.getDate(), 'Keyed "down" to: ' + this.$input.pickadate( 'get', { highlight: 'yyyy-mm-dd' } ) )
        ok( this.$input.pickadate( 'get', 'view' ).MONTH === this.$input.pickadate( 'get', 'highlight' ).MONTH, 'Updated "view" to: ' + this.$input.pickadate( 'get', { view: 'yyyy-mm-dd' } ) )
    }

    // Up
    for ( var j = 0; j < 10; j += 1 ) {

        this.$input.trigger({ type: 'keydown', keyCode: 38 })
        playDate.setDate( playDate.getDate() - 7 )
        ok( this.$input.pickadate( 'get', 'highlight' ).DATE === playDate.getDate(), 'Keyed "up" to: ' + this.$input.pickadate( 'get', { highlight: 'yyyy-mm-dd' } ) )
        ok( this.$input.pickadate( 'get', 'view' ).MONTH === this.$input.pickadate( 'get', 'highlight' ).MONTH, 'Updated "view" to: ' + this.$input.pickadate( 'get', { view: 'yyyy-mm-dd' } ) )
    }

    // Left
    for ( var k = 0; k < 10; k += 1 ) {

        this.$input.trigger({ type: 'keydown', keyCode: 37 })
        playDate.setDate( playDate.getDate() - 1 )
        ok( this.$input.pickadate( 'get', 'highlight' ).DATE === playDate.getDate() && this.$input.pickadate( 'get', 'highlight' ).DAY === playDate.getDay(), 'Keyed "left" to: ' + this.$input.pickadate( 'get', { highlight: 'yyyy-mm-dd' } ) )
        ok( this.$input.pickadate( 'get', 'view' ).MONTH === this.$input.pickadate( 'get', 'highlight' ).MONTH, 'Updated "view" to: ' + this.$input.pickadate( 'get', { view: 'yyyy-mm-dd' } ) )
    }

    // Right
    for ( var l = 0; l < 10; l += 1 ) {

        this.$input.trigger({ type: 'keydown', keyCode: 39 })
        playDate.setDate( playDate.getDate() + 1 )
        ok( this.$input.pickadate( 'get', 'highlight' ).DATE === playDate.getDate() && this.$input.pickadate( 'get', 'highlight' ).DAY === playDate.getDay(), 'Keyed "right" to: ' + this.$input.pickadate( 'get', { highlight: 'yyyy-mm-dd' } ) )
        ok( this.$input.pickadate( 'get', 'view' ).MONTH === this.$input.pickadate( 'get', 'highlight' ).MONTH, 'Updated "view" to: ' + this.$input.pickadate( 'get', { view: 'yyyy-mm-dd' } ) )
    }
})

test( 'Checking keydown to highlight, viewset, and select with disabled dates...', function() {

    var inputPicker = this.$input.pickadate( 'picker' ).open()

    inputPicker.set({
        disable: [
            1, 4, 7,
            [2013,3,29]
        ]
    })
    deepEqual( inputPicker.get( 'disable' ), [1,4,7,[2013,3,29]], 'Correct dates disabled' )

    inputPicker.disableAll()
    ok( inputPicker.get( 'enable' ) === -1, 'Enabled dates flipped' )

    inputPicker.set({ highlight: [2013,3,29] })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,29).getTime(), 'Highlighted ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    this.$input.trigger({ type: 'keydown', keyCode: 40 })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,4,8).getTime(), 'Highlight keyed "down" to ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    inputPicker.set({ highlight: [2013,3,29] })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,29).getTime(), 'Highlighted ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    this.$input.trigger({ type: 'keydown', keyCode: 38 })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,21).getTime(), 'Highlight keyed "up" to ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    inputPicker.set({ highlight: [2013,3,29] })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,29).getTime(), 'Highlighted ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    this.$input.trigger({ type: 'keydown', keyCode: 39 })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,4,1).getTime(), 'Highlight keyed "right" to ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    inputPicker.set({ highlight: [2013,3,29] })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,29).getTime(), 'Highlighted ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    this.$input.trigger({ type: 'keydown', keyCode: 37 })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,28).getTime(), 'Highlight keyed "left" to ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    this.$input.trigger({ type: 'keydown', keyCode: 37 })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,27).getTime(), 'Highlight keyed "left" to ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )

    this.$input.trigger({ type: 'keydown', keyCode: 37 })
    ok( inputPicker.get( 'highlight' ).PICK === new Date(2013,3,24).getTime(), 'Highlight keyed "left" to ' + inputPicker.get({ highlight: 'yyyy-mm-dd' }) )
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

    ok( !this.$input.siblings( '[type=hidden]' ).length, 'There is no hidden input' )

    var selectedObject = this.$input.pickadate( 'get', 'select' )
    ok( [selectedObject.YEAR,selectedObject.MONTH,selectedObject.DATE].toString() === [1988,7,14].toString(), 'Sets correct date' )

    var highlightedObject = this.$input.pickadate( 'get', 'highlight' )
    ok( [highlightedObject.YEAR,highlightedObject.MONTH,highlightedObject.DATE].toString() === [1988,7,14].toString(), 'Highlights correct date' )

    var viewsetObject = this.$input.pickadate( 'get', 'view' )
    ok( [viewsetObject.YEAR,viewsetObject.MONTH,viewsetObject.DATE].toString() === [1988,7,1].toString(), 'Viewsets correct date' )
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

    var hiddenElement = this.$input.siblings( '[type=hidden]' )[ 0 ]
    ok( hiddenElement.type === 'hidden', 'There is a hidden input' )
    ok( hiddenElement.value === '1988/08/14', 'The hidden input has correct value' )

    var selectedObject = this.$input.pickadate( 'get', 'select' )
    ok( [selectedObject.YEAR,selectedObject.MONTH,selectedObject.DATE].toString() === [1988,7,14].toString(), 'Selects correct date' )

    var highlightedObject = this.$input.pickadate( 'get', 'highlight' )
    ok( [highlightedObject.YEAR,highlightedObject.MONTH,highlightedObject.DATE].toString() === [1988,7,14].toString(), 'Highlights correct date' )

    var viewsetObject = this.$input.pickadate( 'get', 'view' )
    ok( [viewsetObject.YEAR,viewsetObject.MONTH,viewsetObject.DATE].toString() === [1988,7,1].toString(), 'Viewsets correct date' )
})




module( 'Date picker `get` and `set` properties', {
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

test( 'Setting `min` & `max` with arrays...', function() {

    this.$input.pickadate( 'set', { select: [1988,7,14] } )
    var selectedObject = this.$input.pickadate( 'get', 'select' )
    ok( [selectedObject.YEAR,selectedObject.MONTH,selectedObject.DATE].toString() === [1988,7,14].toString(), 'Selects date correctly' )

    this.$input.pickadate( 'set', { highlight: [1988,7,16] } )
    var highlightedObject = this.$input.pickadate( 'get', 'highlight' )
    ok( [highlightedObject.YEAR,highlightedObject.MONTH,highlightedObject.DATE].toString() === [1988,7,16].toString(), 'Highlights date correctly' )

    this.$input.pickadate( 'set', { view: [1988,7,18] } )
    var viewsetObject = this.$input.pickadate( 'get', 'view' )
    ok( [viewsetObject.YEAR,viewsetObject.MONTH,viewsetObject.DATE].toString() === [1988,7,1].toString(), 'Adjusts view correctly' )

    this.$input.pickadate( 'set', { min: [1988,7,12] } )
    var minObject = this.$input.pickadate( 'get', 'min' )
    ok( [minObject.YEAR,minObject.MONTH,minObject.DATE].toString() === [1988,7,12].toString(), 'Sets min limit correctly' )

    this.$input.pickadate( 'set', { max: [1988,7,20] } )
    var maxObject = this.$input.pickadate( 'get', 'max' )
    ok( [maxObject.YEAR,maxObject.MONTH,maxObject.DATE].toString() === [1988,7,20].toString(), 'Sets max limit correctly' )
})

test( 'Setting `min` & `max` with integers...', function() {

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

test( 'Setting `min` & `max` with booleans...', function() {

    this.$input.pickadate( 'set', { min: true } )
    ok( this.$input.pickadate( 'get', 'min' ).PICK === this.$input.pickadate( 'get', 'now' ).PICK, 'Sets min limit correctly' )

    this.$input.pickadate( 'set', { max: true } )
    ok( this.$input.pickadate( 'get', 'max' ).PICK === this.$input.pickadate( 'get', 'now' ).PICK, 'Sets max limit correctly' )
})

test( 'Setting `disable` with integers...', function() {

    var //today = new Date(),
        disableCollection = [1,4,7],
        $input = this.$input,
        $holder = $input.pickadate( 'picker' ).$holder

    if ( disableCollection.indexOf( $input.pickadate( 'get', 'select' ).DAY + 1 ) > -1 ) {
        console.log( 'check if will move', $input.pickadate( 'get', 'select' ) )
    }

    $input.pickadate( 'set', { disable: disableCollection } )

    ok( $input.pickadate( 'get', 'disable' ).toString() === disableCollection.toString(), 'Disabled dates added to collection' )

    $holder.find( 'tr' ).each( function( indexRow, tableRow ) {
        $( tableRow ).find( '[data-pick]' ).each( function( indexCell, tableCell ) {
            if ( disableCollection.indexOf( indexCell + 1 ) > -1 ) {
                ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Disabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
            else {
                ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Enabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
        })
    })

    $input.pickadate( 'set', { enable: [1] } )
    ok( $input.pickadate( 'get', 'disable' ).toString() === [4,7].toString(), 'Disabled time removed from collection' )

    $holder.find( 'tr' ).each( function( indexRow, tableRow ) {
        $( tableRow ).find( '[data-pick]' ).each( function( indexCell, tableCell ) {
            if ( [4,7].indexOf( indexCell + 1 ) > -1 ) {
                ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Disabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
            else {
                ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Enabled as day of week: ' + ( indexCell + 1 ) + '. Date: ' + tableCell.innerHTML )
            }
        })
    })
})

test( 'Setting `disable` with arrays...', function() {

    var now = new Date()
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth(),
        disableCollection = [ [nowYear,nowMonth,1],[nowYear,nowMonth,17],[nowYear,nowMonth,25] ],
        firstDay = this.$input.pickadate( 'get', 'view' ).DAY,
        $holder = this.$input.pickadate( 'picker' ).$holder


    this.$input.pickadate( 'set', { disable: disableCollection } )
    ok( this.$input.pickadate( 'get', 'disable' ).toString() === disableCollection.toString(), 'Disabled dates added to collection' )

    $holder.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - 1 + firstDay
        if ( index === 1 || index === 17 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })


    this.$input.pickadate( 'set', { enable: [ [nowYear,nowMonth,17] ] } )
    ok( this.$input.pickadate( 'get', 'disable' ).toString() === [ [nowYear,nowMonth,1],[nowYear,nowMonth,25] ].toString(), 'Disabled date removed from collection' )

    $holder.find( 'td [data-pick]' ).each( function( indexCell, tableCell ) {
        var index = indexCell - 1 + firstDay
        if ( index === 1 || index === 25 ) {
            ok( $( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is disabled: ' + tableCell.innerHTML )
        }
        else {
            ok( !$( tableCell ).hasClass( $.fn.pickadate.defaults.klass.disabled ), 'Date is enabled: ' + tableCell.innerHTML )
        }
    })
})

test( 'Setting `select` with arrays...', function() {

    var now = new Date()
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth()

    this.$input.pickadate( 'set', { select: [nowYear,nowMonth,9] } )
    ok( this.$input.pickadate( 'get', 'select' ).PICK === new Date(nowYear,nowMonth,9).getTime(), 'Selects date correctly' )
})

test( 'Setting `highlight` with arrays...', function() {

    var now = new Date()
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth()

    this.$input.pickadate( 'set', { highlight: [nowYear,nowMonth,13] } )
    ok( this.$input.pickadate( 'get', 'highlight' ).PICK === new Date(nowYear,nowMonth,13).getTime(), 'Highlights date correctly' )
})

test( 'Setting `view` with arrays...', function() {

    var now = new Date()
        nowYear = now.getFullYear(),
        nowMonth = now.getMonth()

    this.$input.pickadate( 'set', { view: [nowYear,nowMonth,-10] } )
    ok( this.$input.pickadate( 'get', 'view' ).MONTH === nowMonth - 1, 'View month updated correctly' )
    ok( this.$input.pickadate( 'get', 'view' ).DATE === 1, 'View date updated correctly' )
})
