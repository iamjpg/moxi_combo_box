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
          tasks: ['coffee', 'uglify', 'copy'],
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
      },
      copy: {
        main: {
          src: 'src/moxi.combobox.js',
          dest: '../Search.Closure/sre.application/contrib/moxi.combobox.js',
        },
        sec: {
          src: 'src/moxi.combobox.js',
          dest: '../Search.Closure/public/javascripts/sre.search/contrib/moxi.combobox.js',
        },
      },
      docco: {
        debug: {
          src: ['lib/*.coffee'],
          options: {
            output: 'docs/'
          }
        }
      }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-docco');

    // Default task
    grunt.registerTask('default', ['watch']);
};
