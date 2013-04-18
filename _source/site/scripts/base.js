
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */

$('.picker--date').pickadate()
$('.picker--time').pickatime()


// $.ajax('https://api.github.com/repos/amsul/pickadate.js').done( function( resp ) {

//     console.log( resp.watchers_count, resp.forks_count )

//     $( '[data-github]' ).each( function() {
//         var thing = resp[ $( this ).data( 'github' ) ]
//         this.innerHTML += '<span class=button__callout>' + thing + '</span>'
//     })
// })