
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(); //引入gulp插件


module.exports = function( options ){

	var filesArr = options.filesArr;

	if( filesArr.length == 0){
		//打包所有文件
		var imgArr = ['src/**/image/**/*', 'common/image/**/*' ];
	}
	else{
		//filesArr不为空，需要打包对应项目里的文件
		for( var imgArr = [], i = 0; i < filesArr.length; i++){
			imgArr.push( filesArr[i] + '**/image/**/*');
		}	
	}
	
	//common里的图片打出到commonResources里
	gulp.task('commonImages', function() {

	    return gulp.src( 'common/image/**/*', {base:'common/'})

	    	// .pipe( plugins.rename(function(path){
	    	// 	//如果图片是common中的
	    	// 	path.dirname = path.dirname.replace(/\.\.\\/, '');	    	
	    	// }))
	    	
	        .pipe(gulp.dest(options.path + 'commonResources/common/'));
	});

	//图片打包任务，全部打包和单独打包可共用
	gulp.task('images', ['commonImages'], function() {

	    return gulp.src( imgArr , {base:'src'})

	    	// .pipe( plugins.rename(function(path){
	    	// 	//如果图片是common中的
	    	// 	if( path.dirname.indexOf('..\\common\\') != -1){
	    	// 		path.dirname = path.dirname.replace(/\.\.\\/, '');
	    	// 	}	    	
	    	// }))
	    	
	        .pipe(gulp.dest(options.path));
	});
	
}