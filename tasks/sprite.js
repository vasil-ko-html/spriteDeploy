'use strict';
var themes = {};

module.exports = function(grunt) {
  //load helpers
  var helpers = require('../lib/helpers')(grunt);
  //add configs for grunt-spritesmith
  helpers.addSprites(themes);

  /* 
  * !!! add config to grunt.initConfig !!!
  * -------------------------------------------
  * If you call helpers.addConfig(prop, value)
  * then you'll set that property and its corresponding
  * value on the grunt.initConfig object
  */
  helpers.addConfig('sprite', themes);

  //load task for spritesmith
  grunt.loadNpmTasks('grunt-spritesmith');
}