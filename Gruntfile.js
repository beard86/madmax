module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'styles/app.css' : 'styles/app.scss'
                }
            }
        },
        watch: {
            css: {
                files: 'styles/*.scss',
                tasks: ['sass']
            }
        },
        uglify: {
            my_target: {
                files: [{
                    expand: true,
                    src: [
                        'common/**/*.js',
                        'directives/**/*.js',
                        'enroll/**/*.js',
                        'modules/**/*.js'
                    ],
                    dest: '../dist/'
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: [
                        '**/*.js',
                        'bower_components/**',
                        'img/**',
                        'lib/**',
                        'styles/**',
                        '**/*.html',
                        '!**/*.scss',
                        '!node_modules/**'
                    ],
                    dest: '../dist/'
                }]
            }
        },
        'http-server': {
 
            'dev': {

                root: './',
     
                // the server port 
                // can also be written as a function, e.g. 
                // port: function() { return 8282; } 
                port: 9000,
                
     
                // the host ip address 
                // If specified to, for example, "127.0.0.1" the server will  
                // only be available on that ip. 
                // Specify "0.0.0.0" to be available everywhere 
                host: "0.0.0.0",
     
                showDir : false,
                autoIndex: true,
     
                // server default file extension 
                ext: "html",
     
                // run in parallel with other tasks 
                runInBackground: true,
     
                // specify a logger function. By default the requests are 
                // sent to stdout. 
                logFn: function(req, res, error) { }
     
            }
     
        },

        mustache_render: {
            options: {
                template: 'template/buy-online/index.html'
            },
            your_target: {
                files : {
                    'gb/buy-online/index.html': 'data/gb.json',
                    'fr/acheter-en-ligne/index.html': 'data/fr.json',
                    'de/online-kaufen/index.html': 'data/de.json',
                    'se/kop-online/index.html': 'data/se.json',
                    'fi/Osta-verkosta/index.html': 'data/fi.json',
                    'dk/kob-online/index.html': 'data/dk.json',
                    'no/kjop-online/index.html': 'data/no.json',
                    'au/buy-online/index.html': 'data/au.json',
                    'it/compra-online/index.html': 'data/it.json',
                    'es/comprar-online/index.html': 'data/es.json',
                    'be/acheter-en-ligne/index.html': 'data/be-fr.json',
                    'be/online-kopen/index.html': 'data/be-nl.json',
                    'nl/online-kopen/index.html': 'data/nl.json',
                    'at/online-kaufen/index.html': 'data/at.json',
                    'ch/online-kaufen/index.html': 'data/ch.json',
                }
            },
        },

    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-keepalive');
    grunt.loadNpmTasks('grunt-mustache-render');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('serve',['http-server','keepalive']);
    grunt.registerTask('build',['sass','mustache_render']);
}