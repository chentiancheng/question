
var gulp = require('gulp'),
	fs = require('fs'),
	glob = require('glob'),
	through = require('through2'),
	webpackConfig = require('../../webpack.config.js'), //webpack配置文件
	plugins = require('gulp-load-plugins')(), //引入gulp插件
	pathVar = require('../pathVar.js'), //打包公用路径配置
	projectConfig =  require('../project/config.js') , //获取当前项目配置的域名和环境
	erudaFile = fs.readFileSync('conf/eruda.js','utf-8'), //读取eruda.js内容
    CustomEventIeFile = fs.readFileSync('conf/CustomEventIE.js','utf-8'); //读取CustomEventIE.js文件内容
    //changeLocalHistoryFile = fs.readFileSync('conf/changeLocalHistory.js','utf-8'); //读取changeLocalHistory.js内容


//获取js入口文件
//每个文件夹中static/js里的文件，不包括static/
var getFiles = function( filesArr ){

  var files = {}; 
  glob.sync(filesArr).forEach(function (name) { 
      /*
      循环所有文件，对文件名做处理，并放入files数组中，返回files
       */
       	if( name.indexOf('section/') == -1 && name.indexOf('common/') == -1){
       		var n = name.substring((name.indexOf('/') + 1)).replace(/\.js$/, '');
      		files[n] = './' + name;
      	}
      
  }); 

  return files;

}


module.exports = function(options ){

	//调用projectConfig，给global.siteUrl的各项添加内容并转成字符串，用于添加到root.js文件中
	var siteUrl = projectConfig( options ),
		domainUrlStr = JSON.stringify( siteUrl.domainUrl ),
		apiUrlStr = JSON.stringify( siteUrl.apiUrl ),
		goUrlStr = JSON.stringify( siteUrl.goUrl ),
		filesArr = options.filesArr;

	if( filesArr.length == 0){
		//打包所有文件
		var jsArr = ['src/**/js/**/*.js' ];
	}
	else{
		//filesArr不为空，需要打包对应项目里的文件
		for( var jsArr = [], i = 0; i < filesArr.length; i++){
			jsArr.push( filesArr[i] + '**/js/**/*.js');
		}	
	}

	

	//设置所有Js入口文件，需要getFiles方法
	var jsObj = {};
	for( var m = 0; m < jsArr.length; m++){
		var gf = getFiles( jsArr[m] );
		for( var j in gf){
			jsObj[j] = gf[j];
		}
		
	}
	
	//root文件打包
	gulp.task( 'root', function() {
 
		return gulp.src(['conf/project/root.js'])

			//添加changeLocalHistory、eruda和CustomEventIeFile的文件内容
	        .pipe(
	            through.obj(function(file, enc, cb) {
	                var fileCon = file.contents.toString();

	                //替换gulpIp和gulpEnv
	                fileCon = fileCon.replace(/gulpEnv/g, options.env).replace(/gulpDomainUrl/g, domainUrlStr)
	                	.replace(/gulpApiUrl/g, apiUrlStr).replace(/gulpGoUrl/g, goUrlStr);

	                file.contents = new Buffer(fileCon);
	                this.push(file);
	                cb()
	            })
	        )

	        .pipe(gulp.dest(options.path+'commonResources/common/'))

	        .pipe(plugins.rev())
	        .pipe(plugins.rev.manifest())
	        .pipe(gulp.dest(options.middle + 'rev/root'))
	})


	// gulp.task( 'htmd', function() {
 
	// 	return gulp.src(['common/js/htmd/**/*'], {base:'common'})

	// 		.pipe(gulp.dest(options.path+'commonResources/common/'))
	// })


	//经过webpack的js文件打包（各项目里js文件的打包）
	//首先需要打包出root.js文件
	gulp.task("webpack", ['root'], function() {

		
		var changeObj = {};

		//判断文件修改地址
		if( options.changeFilePath.length != 0 ){
			//数组里有值，打包这里的文件
			changeObj = Object.assign({}, getFiles( options.changeFilePath[0] ));
		}

		var entryJs = Object.keys(changeObj).length == 0 ? jsObj : changeObj;

		console.log( "webpack入口文件：" +  JSON.stringify(entryJs));
		
		//设置webpack入口文件，如果changeObj为空，则使用jsObj，如果不为空用changeObj
		webpackConfig.entry = entryJs; 

	    return gulp.src(['src/**/*.js'], {base:'src'})

	    	.pipe(plugins.webpack(webpackConfig))

	        //与host.path中的内容做比对
	        .pipe(plugins.changed(options.middle+'project/', { hasChanged: plugins.changed.compareSha1Digest }))
	        .pipe(plugins.debug({ title: 'js-修改的文件:' }))

	        //打出到middle里一份
	        .pipe(gulp.dest(options.middle+'project/'))

	        //添加eruda和CustomEventIeFile的文件内容
	        .pipe(
	            through.obj(function(file, enc, cb) {
	                var fileCon = file.contents.toString();
	                fileCon = fileCon + erudaFile + CustomEventIeFile ;
	                file.contents = new Buffer(fileCon);
	                this.push(file);
	                cb()
	            })
	        )

	        //预上线环境时，去掉Log并压缩
	        // .pipe(plugins.if(options.env === '3' || options.env === '4', plugins.removelogs()))
	        .pipe(plugins.if(options.env === '3' || options.env === '4', plugins.uglify({ //压缩
	            mangle: false, //类型：Boolean 默认：true 是否修改变量名
	            compress: false
	        })))

	       
	        .pipe(gulp.dest(options.path))

	        //版本号
	        .pipe(plugins.rev())
	        .pipe(plugins.rev.manifest())
	        .pipe(gulp.dest(options.middle + 'rev/js'))
	});
}