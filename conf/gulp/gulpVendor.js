/**
	第三方所有文件复制到host.path中

	打包html文件后，按照html中的vendor标签里的第三方文件夹名称，打包common/vendor里的第三方文件夹里的所有文件
	直接将这些文件输出到options.path中的vendor文件夹
**/


var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(); //引入gulp插件



//html文件打包后，拿到html里引用的第三方文件，
//再打包对应的vendor，此时global.vendorArr已经不是空数组了
global.vendorArr = [];

module.exports = function(options) {

    //图片打包任务，全部打包和单独打包可共用
    gulp.task('vendor', function() {

    	//如果global.vendorArr为空，打包所有vendor里的文件
    	var src = global.vendorArr.length == 0 ? ['common/vendor/**/*'] : global.vendorArr;

        //return gulp.src(['common/vendor/**/*'])
       	return gulp.src( src ,  {base: 'common'} )
            .pipe(gulp.dest( options.path + 'commonResources/common/'));
    });

}