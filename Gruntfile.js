module.exports = function(grunt) {

  grunt.initConfig({

    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    watch: {
      files: ['./*.js', './**/*.js', 'lib/**/*.js', 'test/**/*.js'],
      tasks: ['test']
    },

    nodemon: {
      dev: {
        script: 'app.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', 'mochaTest');

  grunt.registerTask('exec', 'nodemon');

  grunt.registerTask('default', 'exec');

};
