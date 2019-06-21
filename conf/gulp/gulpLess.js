
var gulp = require('gulp'),
	through = require('through2'),
	fs = require('fs'),
	plugins = require('gulp-load-plugins')(), //引入gulp插件
	pathVar = require('../pathVar.js'); //打包公用路径配置


module.exports = function( options ){

	var filesArr = options.filesArr;

	if( filesArr.length == 0){
		//打包所有文件
		var lessArr = ['src/**/less/**/*' ];
	}
	else{
		//filesArr不为空，需要打包对应项目里的文件
		for( var lessArr = [], i = 0; i < filesArr.length; i++){
			lessArr.push( filesArr[i] + '**/less/**/*.less');
		}	
	}

	//入口文件不包括section和common里的
	lessArr.push(  '!src/**/less/section/**/*.less');
	lessArr.push(  '!src/**/less/common/**/*.less');




	//color.less, baseClass.less, resetLess三个文件的打包
	//合并为base.less打出到middle/common/css中
	//在less任务中直接引入，使每个less文件都可以引入这几个样式
	gulp.task('baseLess', function(){

		return gulp.src(['common/less/color.less', 'common/less/baseClass.less', 'common/less/reset.less'])
			
			.pipe( plugins.concat('base.less') )

			.pipe(plugins.less())

			.pipe(gulp.dest(options.middle+'common/less/'))
	})

	//先Less处理，然后比对文件，修改的文件会打包到options.dest中
	//并且生成版本号文件
	gulp.task("less", ['baseLess'], function() {

		var changeObj = [];

		//判定changeFilePath是否为空
		if( options.changeFilePath.length != 0 ){
			//不为空时，打包修改的文件
			changeObj = options.changeFilePath;
		}
		else {
			//为空打包所有文件
			changeObj = lessArr;
		}

	    return gulp.src( changeObj , {base:'src'})

	       	//编译less
	        .pipe(plugins.less())

	    	//替换公共路径
	    	//将文件路径中的less目录改为css
	        .pipe(
	            through.obj(function(file, enc, cb) {
	                file = pathVar.changePathVar( file );
	                file.path = file.path.replace(/less/g, 'css');
	                this.push(file);
	                cb()
	            })
	        )

	        //与options.middle中的内容做比对
	        .pipe(plugins.changed( options.middle+'project/', { hasChanged: plugins.changed.compareSha1Digest }))
	        .pipe(plugins.debug({ title: 'less-修改的文件:' }))

			//修改的文件打入options.middle中一份，放在project文件夹中
	       	.pipe(gulp.dest(options.middle+'project/'))

	        //判断是否为富文本模板，不是的话，和base.css文件合并
	        //（因reset.less会影响富文本样式）
	        .pipe(
	        	through.obj( function(file, enc, cb){
	        		var filePath = file.path;

	        		if( filePath.indexOf('commonResources\\richModules') == -1){
    					//读取base.css内容
    					var baseCss = fs.readFileSync( options.middle + 'common/less/base.css','utf-8');
    					var fileCon = file.contents.toString();
    			        fileCon = baseCss + fileCon ;
    			        file.contents = new Buffer(fileCon);
	        		}
	        		
	                this.push(file);
	                cb()
	        	})
	        )

	        //预上线/线上环境时，压缩css
	        //设置这两个参数，防止去掉浏览器前缀和z-index值的变化
	        .pipe(plugins.if( options.env === '3' || options.env === '4', plugins.cssnano({autoprefixer: false, zindex: false})) )

	        //打出到options.path
	        .pipe(gulp.dest(options.path))

	        //打版本号，放到options.middle中
	        .pipe(plugins.rev())
	        .pipe(plugins.rev.manifest())
	        .pipe(gulp.dest(options.middle + 'rev/css/'))
	})
	
}



