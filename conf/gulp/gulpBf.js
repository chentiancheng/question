
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(); //引入gulp插件

module.exports = function( options  ){

	/**
	 * 版本号文件的备份
	 * 第一次打包时，需要打包css\js文件的rev文件备份，用于后期修改html文件时添加版本号
	 */
	gulp.task('bfRev', function() {
	    return gulp.src([options.path + 'rev/**/*.json'])
	        .pipe(gulp.dest(options.middle + 'rev/'))
	})
	
}