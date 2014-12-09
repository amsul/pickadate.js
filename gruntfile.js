var grunt = require('grunt')
var shell = require('shelljs')

grunt.registerTask('default', function() {

  var version = grunt.option('get')
  if (!version) {
    grunt.fail.fatal('The version to install is required!')
  }

  shell.exec('bower uninstall --save pickadate')
  shell.exec('bower install --save "pickadate#' + version + '"')

  var regex = /^(project:\s*version:\ *)([\d\.]{5})/m
  var content = grunt.file.read('./_config.yml')

  var match = content.match(regex)
  if (!match) {
    grunt.fail.fatal('Unable to find a version in _config.yml ' +
      '(it must be the first "project" property)')
  }

  content = content.replace(regex, '$1' + version)
  grunt.file.write('./_config.yml', content)

})
