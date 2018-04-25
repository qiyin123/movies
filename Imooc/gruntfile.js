module.exprots=function (grunt) {

    grunt.initConfig({
        watch:{
            jade:{
                files:['view/**'],
                options:{
                    livereload:true
                }
            },
            js:{
                files:['public/js/**','models/**/*.js','schemas/**/*.js'],
                //tasks:['jshint'],
                options:{
                    livereload:true
                }
            }
        },
        nodemon:{
            dev:{
                options:{
                    files:'app.js',
                    args:[],
                    ignoredFiles:['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions:['js'],
                    watchedFolders:['app','config'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT:3000
                    },
                    cwd:__dirname
                }
            }
        },
        concurrent:{
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    })
    //只要有文件修改，添加，删除都会重新执行里面注册好的任务
    grunt.loadNpmTasks('grunt-contrib-watch');
    //实时监听入口文件(app.js)
    grunt.loadNpmTasks('grunt-nodemon');
    //针对慢任务的插件
    grunt.loadNpmTasks('grunt-concurrent');

    //不要因为语法的错误而中断当前grunt任务
    grunt.option('force',true);
    //注册默认执行的任务
    grunt.registerTask("default",['concurrent'])
}