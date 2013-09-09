module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'package.json', 'lib/*', 'tests/*.js', 'tests/*/*.js'],
			options: {

				// Enforcing
				bitwise: true,
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noempty: true,
				noarg: true,
				nonew: true,
				plusplus: true,
				undef: true,
				unused: true,
				trailing: true,

				// Relaxing
				expr: true,

				maxparams: 4,
				maxdepth: 4,
				maxstatements: 45, // Made this up
				maxcomplexity: 15, // Pulled from Steve McConnell
				maxlen: 160, // Two times 80 characters

				// Node
				globals: {

					'exports': true,
					'require': true,
					'process': true,
					'module': true,
					'setTimeout': true

				}

			}
		},
		nodeunit: {
			all: ['tests/*.js']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	/*
	 * Lint and test files as part of the default task
	 */
	grunt.registerTask('default', ['jshint', 'nodeunit']);
};
