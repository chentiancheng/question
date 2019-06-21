

var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(); //引入gulp插件


module.exports = function( options){

	//打包CSS、JS时的版本号替换，只替换rev文件夹里版本号文件中的版本号
	//并输出到 host.path
	gulp.task('rev', function() {

	    return gulp.src( [options.middle + 'rev/**/*.json', options.middle + 'project/**/*.html'] ) //- 读取 rev-manifest.json 文件


	        .pipe(plugins.revCollector()) //- 执行html内版本号的替换
	        //.pipe(plugins.debug({ title: '替换版本号的文件' }))

	        //替换后的文件输出的目录
	        .pipe(gulp.dest(options.path))

	        //如果是监听文件修改的，重启connect
	        .pipe(plugins.if( global.isWatch, plugins.connect.reload()))
	});
	
}




