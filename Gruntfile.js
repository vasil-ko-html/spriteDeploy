'use strict';
module.exports = function(grunt) {
  //load helpers
  var helpers = require('./lib/helpers')(grunt);

  //load tasks
  grunt.loadTasks('./tasks');
  //register default task
  grunt.registerTask('default', ['sprite']);
  //register custom multi task for grunt-spritesmith
  helpers.registerMultiSprite();

  grunt.registerTask('spriteList', 'Get list of themes...', function() {
    grunt.log.write(helpers.getThemesList());
  });
};