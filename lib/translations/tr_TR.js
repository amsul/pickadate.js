// Turkish
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Bugün',
        clear: 'Sil',
        close: 'Kapat',
        firstDay: 1,
        format: 'dd mmmm yyyy dddd',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
        monthsShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
        weekdaysFull: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
        weekdaysShort: ['Pzr','Pzt','Sal','Çrş','Prş','Cum','Cmt']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'sil'
    });
}
