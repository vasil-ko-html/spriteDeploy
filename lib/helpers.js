'use strict';

var fs = require('fs'),
    path = require('path');
/**
* Grunt helpers
*
* @package    GruntJS
* @category   Helpers
* @author     Vasil Oksamitniy <vasil_ko_html@mail.ru>
* @license    ISC
*/
module.exports = function(grunt) {
  var list = [],
      root = path.resolve(__dirname, './../', 'site/spriteFactory');

  list = initThemesList();
  
  /**
  * return grunt.registerTask(alias, type)
  * 
  * registerTask('LVH', ['mobSite', 'webSite']);
  *
  * @param string alias - name of task for run by Grunt
  * @param array type - array of sprites type.
  */
  function registerTask(alias, type) {
    alias = alias || 'default';
    type = type || [];
    var typeLength = type.length;
    if(typeLength == 1) {
      return grunt.registerTask(alias, ['sprite:' + type + alias]);
    }
    else {
      for(var i = 0; i < typeLength; i++) {
        type[i] = 'sprite:' + type[i] + alias;
      }
      return grunt.registerTask(alias, type);
    }
  }
  /**
  * return grunt.config.set(prop, value);
  * 
  * addConfig('sprite', themes);
  *
  * @param string prop - config name
  * @param object value - object name for access to config value
  */
  function addConfig(prop, value) {
    prop = prop || '';
    value = value || {};
    return grunt.config.set(prop, value);
  }
  /**
  * Use for add custom config in sprite
  *
  * @param object obj - extend object name 
  * @param string type - type of sprite: 'mobSite', 'webSite', 'payment'
  * @param string theme - shortcut name of theme: Loveaholics LVH
  */
  function addSprite(obj, type, theme) {
    obj = obj || {};
    type = type || '';
    theme = theme || '';
    var basePath = './site/spriteFactory',
        options = {
          'cssTemplate': 'spritesmith-template.mustache',
          'padding': 2,
          'imgPath': '../images/sprite.png',
          'cssFormat': 'less',
          'algorithm': 'binary-tree',
          'src': [basePath + '/' + theme + '/_' + type +'/images/*.png'],
          'destImg': basePath + '/' + theme + '/_' + type +'/sprite/sprite.png',
          'destCSS': basePath + '/' + theme + '/_' + type +'/sprite/sprite.less'
        };
    return obj[type + theme] = options;
  }
  /**
  * Use for add multi custom config in sprite
  *
  * @param obj - extend object name
  *
  * Inside use addSprite(obj, type, theme)
  */
  function addSprites(obj) {
    obj = obj || {};
    list.forEach(function(directory) {
      var subDir = path.resolve(root, directory);

      var subDirectories = fs.readdirSync(subDir).filter(function(file) {
        return fs.statSync(path.resolve(subDir, file)).isDirectory();
      });

      subDirectories.forEach(function(subDirectory){
        addSprite(obj, subDirectory.substr(1), directory);
      });
    });
  }
  /**
  * Additional method
  * Get list of themes
  */
  function initThemesList() {
    return fs.readdirSync(root).filter(function(file) {
      return fs.statSync(path.resolve(root, file)).isDirectory();
    });
  }
  /**
  * Return object with themes and list of type sprites
  * 
  * Additional method
  */
  function initSpriteTypeList() {
    var typeSprites = {};
    list.forEach(function(directory) {
      var subDir = path.resolve(root, directory);

      var subDirectories = fs.readdirSync(subDir).filter(function(file) {
        return fs.statSync(path.resolve(subDir, file)).isDirectory();
      });

      typeSprites[directory] = subDirectories;
    });

    return typeSprites;
  }
  /**
  * Use for show list of themes and type of sprites in themes
  */
  function getThemesList() {
    var themes = initSpriteTypeList();
    console.log('\n====== Start of list ======\n');
    for(var key in themes) {
      console.log(key + ': ' + themes[key]);
    }
    return '\n======= End of list =======\n';
  }
  /**
  * Use for multi grunt.registerTask()
  * inside use initSpriteTypeList()
  *
  */
  function registerMultiSprite() {
    var obj;
    obj = initSpriteTypeList();
    for(var key in obj) {
      var objKeyLength = obj[key].length;
      if(objKeyLength == 1) {
        grunt.registerTask(key, ['sprite:' + obj[key].toString().substr(1) + key]);
      }
      else {
        for(var i = 0; i < objKeyLength; i++) {
          obj[key][i] = 'sprite:' + obj[key][i].substr(1) + key;
        }
        grunt.registerTask(key, obj[key]);
      }
    }
  }
  
  return {
    addConfig: addConfig,
    getThemesList: getThemesList,
    addSprites: addSprites,
    registerMultiSprite: registerMultiSprite
  };
}