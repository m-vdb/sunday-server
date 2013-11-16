module.exports = function(grunt) {
    grunt.initConfig({
	mochaTest: {
	    test: {
		options: {
		    reporter: 'spec'
		},
		src: ['tests/**/*.js', 'tests/*.js']
	    }
	}
    });
 
    // load tasks
    grunt.loadNpmTasks('grunt-mocha-test');

    // my tasks
    grunt.registerTask('test', 'mochaTest');
};
