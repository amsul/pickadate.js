// Finnish
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'tänään',
        clear: 'tyhjennä',
        firstDay: 1,
        format: 'd.m.yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['tammikuu','helmikuu','maaliskuu','huhtikuu','toukokuu','kesäkuu','heinäkuu','elokuu','syyskuu','lokakuu','marraskuu','joulukuu'],
        monthsShort: ['tammi','helmi','maalis','huhti','touko','kesä','heinä','elo','syys','loka','marras','joulu'],
        weekdaysFull: ['sunnuntai','maanantai','tiistai','keskiviikko','torstai','perjantai','lauantai'],
        weekdaysShort: ['su','ma','ti','ke','to','pe','la']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'tyhjennä'
    });
}
