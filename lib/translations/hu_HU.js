// Hungarian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Ma',
        clear: 'Törlés',
        firstDay: 1,
        format: 'yyyy. mmmm dd.',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['január','február','március','április','május','június','július','augusztus','szeptember','október','november','december'],
        monthsShort: ['jan','febr','márc','ápr','máj','jún','júl','aug','szept','okt','nov','dec'],
        weekdaysFull: ['vasárnap','hétfő','kedd','szerda','csütörtök','péntek','szombat'],
        weekdaysShort: ['V','H','K','SZe','CS','P','SZo']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'Törlés'
    });
}
