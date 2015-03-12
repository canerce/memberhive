// Generated on 2015-02-18 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    nggettext_extract: { // jshint ignore:line
      pot: {
        files: {
          'po/template.pot': ['app/**/*.html', 'app/_global/tpl/*.html', 'app/**/*.js']
        }
      }
    },

    nggettext_compile: { // jshint ignore:line
      all: {
        files: {
          '.tmp/scripts/translations.js': ['po/**/*.po']
        }
      }
    },

    loopback_sdk_angular: { // jshint ignore:line
      services: {
        options: {
          input: 'server/server.js',
          output: 'app/_global/scripts/lb-services.js',
          apiUrl: 'http://localhost:3000/api'

        }
      }
    },

    'loopback_auto': {
      'db_autoupdate': {
        options: {
          dataSource: 'db',
          app: './server/server',
          config: './server/model-config',
          method: 'autoupdate'
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      compass: {
        files: ['<%= yeoman.app %>/**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      translations: {
        files: ['po/**/*.po'],
        tasks: ['po2js']
      },
      babel: {
        files: ['<%= yeoman.app %>/**/*.es6.js'],
        tasks: ['newer:babel']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/styles/{,*/}*.css',
          '.tmp/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/_global/styles',
                connect.static('./app/_global/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          'app/**/*.js',
          '!app/_global/scripts/metronic/**/*.js',
          '!app/_global/scripts/lb-services.js'
        ]
      }
    },

    jscs: {
      src: 'app/**/*.js',
      options: {
        config: '.jscsrc'
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    'babel': {
      options: {
        sourceMap: true,
        experimental: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['**/*.es6.js'],
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/_global/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/_global/images',
        javascriptsDir: '<%= yeoman.app %>/_global/scripts',
        fontsDir: '<%= yeoman.app %>/_global/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/_global/images',
        httpGeneratedImagesPath: '/_global/images/generated',
        httpFontsPath: '/_global/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/_global/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: false
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/_global/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/_global/styles/{,*/}*.css',
          '<%= yeoman.dist %>/_global/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/_global/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/_global/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/_global/images',
          '<%= yeoman.dist %>/_global/styles'
        ]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/_global/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/_global/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/_global/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/_global/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', '_global/views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            '_global/tpl/{,*/}*.html',
            '**/views/*.html',
            '_global/images/{,*/}*.{webp}',
            '_global/styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/_global/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'babel',
        'compass:server'
      ],
      test: [
        'babel',
        'compass'
      ],
      dist: [
        'babel:dist',
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    githooks: {
      all: {
        'pre-commit': 'jshint'
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'githooks',
      'clean:server',
      'dbmigrate',
      'loopback_sdk_angular',
      'wiredep',
      'po2js',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'po2js',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'loopback_sdk_angular'
  ]);

  grunt.registerTask('default', [
    'githooks',
    'newer:jshint',
    'dbmigrate',
    'test',
    'build'
  ]);

  grunt.registerTask('updatepot', [
    'nggettext_extract'
  ]);

  grunt.registerTask('po2js', 'Create the JS translation file from the PO files', function () {
    // Workaround: Add 'Language' header to po files (Onesky App doesn't add it)

    var fs = require('fs');
    var path = require('path');

    var poDir = path.join(__dirname, '/po/');
    var dirs = fs.readdirSync(poDir);
    dirs.forEach(function(countryCode) {
      var xy = path.join(poDir, countryCode);
      if (!fs.lstatSync(xy).isDirectory())
        return;
      var poFiles = fs.readdirSync(xy);
      poFiles.forEach(function(poFile) {
        var poFilePath = path.join(poDir, countryCode, poFile);
        var content = fs.readFileSync(poFilePath, 'utf8');
        var searchStr = '\"Language: ' + poFile.replace('.po', '') + '\\n\"';
        var mimeStr = '\"MIME-Version: 1.0\\n\"';
        if (content.indexOf(searchStr) < 0) { // Language header not found, add it
          var result = content.replace(mimeStr, mimeStr + '\n' + searchStr);
          fs.writeFileSync(poFilePath, result, 'utf8');
        }
      });

    });

    grunt.task.run([
      'nggettext_compile'
    ]);
  });

  grunt.registerTask('dbmigrate', ['loopback_auto']);

  grunt.loadNpmTasks('grunt-angular-gettext');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadNpmTasks('grunt-loopback-auto');
  grunt.loadNpmTasks('grunt-jscs');
};
