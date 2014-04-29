module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
      // Metadata
      pkg: grunt.file.readJSON('package.json'),
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= props.license %> */\n',
      watch: {
        scripts: {
          files: ['lib/moxi.combobox.coffee'],
          tasks: ['coffee', 'uglify'],
          options: {
            spawn: false,
          }
        }
      },
      coffee: {
        bare: {
          options: {
            bare: true
          },
          files: {
            'src/moxi.combobox.js': 'lib/moxi.combobox.coffee'
          }
        }
      },
      uglify: {
        my_target: {
          files: {
            'src/moxi.combobox.min.js': ['src/moxi.combobox.js']
          }
        }
      }

    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task
    grunt.registerTask('default', ['watch']);
};
