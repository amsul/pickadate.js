// Estonian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'täna',
        clear: 'kustutama',
        firstDay: 1,
        format: 'd. mmmm yyyy. a',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['jaanuar','veebruar','märts','aprill','mai','juuni','juuli','august','september','oktoober','november','detsember'],
        monthsShort: ['jaan','veebr','märts','apr','mai','juuni','juuli','aug','sept','okt','nov','dets'],
        weekdaysFull: ['pühapäev','esmaspäev','teisipäev','kolmapäev','neljapäev','reede','laupäev'],
        weekdaysShort: ['püh','esm','tei','kol','nel','ree','lau']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'kustutama'
    });
}
