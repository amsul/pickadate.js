// Ukrainian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'сьогодні',
        clear: 'викреслити',
        firstDay: 1,
        format: 'dd mmmm yyyy p.',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['січень','лютий','березень','квітень','травень','червень','липень','серпень','вересень','жовтень','листопад','грудень'],
        monthsShort: ['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру'],
        weekdaysFull: ['неділя','понеділок','вівторок','середа','четвер','п‘ятниця','субота'],
        weekdaysShort: ['нд','пн','вт','ср','чт','пт','сб']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'викреслити'
    });
}
