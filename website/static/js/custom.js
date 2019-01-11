if (window.location.pathname === '/pickadate.js/') {
  document.getElementById('footer').style.display = 'none'
} else {
  document.getElementById('footer').style.display = ''
}
document.body.dataset.pathname = window.location.pathname

//

var element = document.getElementById('pickadate--datepicker')
if (element) {
  var picker = window.pickadate.create()
  window.pickadate.render(element, picker)
}
