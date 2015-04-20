/*jshint node: true*/

var grunt = require('grunt')
var exec = require('shelljs').exec

var pkg = require('./package')


var isSuccessful = commitAndTag(pkg.version)
if (!isSuccessful) {
  grunt.fail.fatal('Unable to commit and tag version')
}

return


function commitAndTag(version) {
  var code = exec([
    'git add .',
    'git commit -m "Release v' + version + '"',
    'git tag ' + version,
  ].join(' && ')).code
  return !code
}