module.exports = function (grunt) {
    var bannerTemplate = '' +
        '// <%= pkg.name %> version <%= pkg.version %>\n' +
        '// <%= pkg.repository.url %>\n' +
        '// (<%= pkg.license %>) <%= grunt.template.today("dd-mm-yyyy") %>\n' +
        '// <%= pkg.author %>\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: '\n',
                banner: bannerTemplate
            },
            dist: {
                src: [
                    'src/intro.js',
                    'src/lib.js',
                    'src/main.js',
                    'src/outro.js'
                ],
                dest: '<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: { banner: bannerTemplate },
            dist: {
                files: { '<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'] }
            }
        },

        nodeunit: {
            all: ['test/*']
        },

        watch: {
            scripts: {
                files: ['**/*', '!bootstrap-input.js', '!bootstrap-input.min.js'],
                tasks: ['concat', 'uglify', 'nodeunit'],
                options: { spawn: true }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('default', ['concat', 'uglify', 'nodeunit']);
    grunt.registerTask('test', ['concat', 'uglify', 'nodeunit']);
};