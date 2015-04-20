/*jshint node: true*/

var program = require('commander')
var semver = require('semver')
var grunt = require('grunt')
var glob = require('glob').sync


program
  .option('-p, --patch', 'set the version as the next patch')
  .option('-m, --minor', 'set the version as the next minor')
  .option('-M, --major', 'set the version as the next major')
  .parse(process.argv)


if (program.patch) {
  bumpVersion('patch')
  return
}

if (program.minor) {
  bumpVersion('minor')
  return
}

if (program.major) {
  bumpVersion('major')
  return
}

grunt.fail.fatal('No release type specified')
return


function bumpVersion(release) {
  grunt.log.writeln('Bumping package version by a ' + release)
  var version = readPackageVersion()
  grunt.log.writeln('Current package version: ' + version)
  version = semver.inc(version, release)
  grunt.log.writeln('Updated package version: ' + version)
  writePackageVersion(version)
  grunt.log.writeln('Done updating the package version')
  updateLibraryFiles(version)
  grunt.log.writeln('Done updating the library files')
}


function readPackageVersion() {
  var pkg = require('./package')
  return pkg.version
}


function writePackageVersion(version) {
  var pkg = require('./package')
  pkg.version = version
  grunt.file.write('./package.json', JSON.stringify(pkg, null, '  '))
}


function updateLibraryFiles(version) {

  var versionRegex = /^(\s*\/\*![^\/]+?v)(\d+\.\d+\.\d+)(([^\n]+?)(\d+\/\d+\/\d+))?/
  var today = grunt.template.today('yyyy/mm/dd')
  var files = glob('lib/*.js')

  files.forEach(updateLibraryFile)

  function updateLibraryFile(filePath) {
    var content = grunt.file.read(filePath)
    if (versionRegex.test(content)) {
      content = content.split(versionRegex)
      content = content[1] + version + (content[4] || '') + (content[5] ? today : '') + (content[6] || '')
    }
    grunt.file.write(filePath, content)
  }

}