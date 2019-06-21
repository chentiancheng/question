
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(), //引入gulp插件

	//node模块
    del = require('del'); //删除文件


module.exports = function( options ){

	//清空打包相关文件
	gulp.task('clean', function() {
	    return del.sync([options.path + '*', options.middle + '*']);
	});

	//清空css\js版本号文件
	gulp.task('cleanRev', function() {
	    return del.sync(options.path + 'rev/');
	});

	//清空middle里的js文件
	gulp.task('cleanMiddleProjectJs', function() {
	    return del.sync(options.middle + 'project/**/*.js');
	});


	gulp.task('cleanMiddleCss', function() {
	    return del.sync(options.middle + 'project/**/*.css');
	});
}

