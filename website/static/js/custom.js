if (window.location.pathname === '/pickadate.js/') {
  document.getElementById('footer').style.display = 'none'
} else {
  document.getElementById('footer').style.display = ''
}
document.body.dataset.pathname = window.location.pathname

//

var element = document.getElementById('index-datepicker')
if (element) {
  var picker = window.pickadate.create()
  picker.render(element)
}
