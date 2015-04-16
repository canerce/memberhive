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
    app: 'client/app',
    dist: 'dist',
    api: {
      development: 'http://0.0.0.0:3000/api/',
      production: '/api/'
    }
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,
    concat: {
        notes: {
          src: ['client/app/modules/note/**.js'],
          dest: 'client/app/modules/note.js'
        }
    },

    nggettext_extract: { // jshint ignore:line
      pot: {
        files: {
          'po/template.pot': ['<%= yeoman.app %>/**/*.html', '<%= yeoman.app %>/**/*.js']
        }
      }
    },

    nggettext_compile: { // jshint ignore:line
      all: {
        files: {
          '<%= yeoman.app %>/scripts/translations.js': ['po/**/*.po']
        }
      }
    },

    loopback_sdk_angular: { // jshint ignore:line
      services: {
        options: {
          input: 'server/server.js',
          output: '<%= yeoman.app %>/modules/core/services/lb-services.js',
          apiUrl: 'http://localhost:3000/api'

        }
      }
    },

    loopback_angular_addModelData: { // jshint ignore:line
      services: {
        options: {
          modelConfig: 'server/model-config.json',
          serviceFile: '<%= yeoman.app %>/modules/core/services/lb-services.js',
          modelDir: 'common/models/'
        }
      }
    },

    docularserver: {
      targetDir: 'docs',
      livereload: true,
      port: 8000
    },

    docular: {
      docular_webapp_target: 'docs', // jshint ignore:line
      groups: [
        {
          groupTitle: 'LoopBack',
          groupId: 'loopback',
          sections: [
            {
              id: 'lbServices',
              title: 'LoopBack Services',
              scripts: ['<%= yeoman.app %>/modules/core/services/lb-services.js']
            }
          ]
        }
      ]
    },

    uploadTranslations: {
      options: {
        templateFile: 'po/template.pot',
        platformId: '22316',
        format: 'GNU_POT'
      }
    },

    downloadTranslations: {
      options: {
        locales: ['de', 'en']
      }
    },

    downloadSingleTranslation: {
      options: {
        poDir: 'po/',
        platformId: '22316',
        format: 'GNU_POT',
        tag: 'template.pot'
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
      compass: {
        files: ['<%= yeoman.app %>/**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      lbservices: {
        files: ['common/models/*'],
        tasks: ['lbservices']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '<%= yeoman.app %>/**/*.js',
          '.tmp/**/*.css',
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
              connect.static(appConfig.app),
              connect.static('.tmp'),
              connect().use(
                '/jspm_packages',
                connect.static('./jspm_packages')
              )
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
          '<%= yeoman.app %>/**/*.js',
          'tasks/*.js',
          '!<%= yeoman.app %>/scripts/metronic/**/*.js',
          '!<%= yeoman.app %>/modules/core/services/lb-services.js',
          '!<%= yeoman.app %>/scripts/translations.js',
          '!<%= yeoman.app %>/config.js'
        ]
      }
    },

    jscs: {
      src: '<%= yeoman.app %>/**/*.js',
      options: {
        config: '.jscsrc'
      }
    },

    ngconstant: {
      // Options for all targets
      options: {
        name: 'gem.config',
        dest: '<%= yeoman.app %>/scripts/config.js',
        wrap: 'export var gemConfigModule = {%= __ngModule %}',
        constants: {
          productName: 'MemberHive'
        }
      },
      server: {
        constants: {
          apiUrl: '<%= yeoman.api.development %>'
        }
      },
      dist: {
        constants: {
          apiUrl: '<%= yeoman.api.production %>'
        }
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
          map: true
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

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/',
        cssDir: '.tmp/',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './jspm_packages',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated',
          cssDir: appConfig.dist
        }
      },
      server: {
        options: {
          sourcemap: false
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
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
          src: ['*/**.html'],
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
            'templates/{,*/}*.html',
            '**/views/*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    githooks: {
      all: {
        'pre-commit': 'newer:jshint:all'
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'githooks',
      'clean:server',
      'dbmigrate',
      'lbservices',
      'ngconstant:server',
      'nggettext_compile',
      'concat',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'lbservices',
    'ngconstant:server',
    'nggettext_compile',
    'concurrent:dist',
    'autoprefixer',
    'ngAnnotate',
    'copy:dist',
    'htmlmin',
    // TODO: `jspm bundle app dist/app.js`
  ]);

  grunt.registerTask('default', [
    'githooks',
    'dbmigrate',
    'build'
  ]);

  grunt.registerTask('updateWords', [
    'nggettext_extract',
    'uploadTranslations'
  ]);

  grunt.registerTask('updateTranslations', [
      'downloadTranslations',
      'nggettext_compile'
    ]);

  grunt.registerTask('dbmigrate', ['loopback_auto']);
  grunt.registerTask('lbservices', ['loopback_sdk_angular','loopback_angular_addModelData']);
  grunt.registerTask('restApiDocs', ['lbservices', 'docular', 'docularserver']);

  grunt.loadNpmTasks('grunt-angular-gettext');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadNpmTasks('grunt-docular');
  grunt.loadNpmTasks('grunt-loopback-auto');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Load custom tasks from tasks/ directory
  grunt.loadTasks('tasks');
};
