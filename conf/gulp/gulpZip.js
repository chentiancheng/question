/**
存放gulp任务中与部署前zip包相关的任务
**/

var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(); //引入gulp插件


module.exports = function( options ){

	//zip做服务器部署的时候讲我们打包出的文件压缩成一个zip包
	gulp.task('zip', ['initialTask'], function() {
	    return gulp.src(options.path + '**')
	        .pipe(plugins.zip(options.zip_name + '.zip'))
	        .pipe(gulp.dest(options.path));
	});
	
}