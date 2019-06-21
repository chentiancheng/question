
var gulp = require('gulp'),
	fs = require('fs'),
	glob = require('glob'),
	through = require('through2'),
	path = require('path'),
	merged = require('merge-stream')(),
	pathVar = require('../pathVar.js'), //打包公用路径配置
	//htmlHeader = fs.readFileSync('../../common/views/template/header.html'),
	//htmlFooter = fs.readFileSync('../../common/views/template/footer.html'),
	plugins = require('gulp-load-plugins')(); //引入gulp插件


module.exports = function( options, host , filesArr ){

	var filesArr = options.filesArr;

	if( filesArr.length == 0){
		//打包所有文件
		var htmlArr = ['src/**/*.html' ];
	}
	else{
		//filesArr不为空，需要打包对应项目里的文件
		for( var htmlArr = [], i = 0; i < filesArr.length; i++){
			htmlArr.push( filesArr[i] + '**/*.html');
		}	
	}

 	//html文件打包
 	//需要先处理@@include的文件
	gulp.task('html', function() {
		return htmlTaskArr( options, htmlArr );
	})

}


//获取所有要打包的html文件路径
function getFiles( filesArr ){

	var files = []; 

	for( var i = 0; i< filesArr.length; i++){

		glob.sync(filesArr[i]).forEach(function (name) { 
			/*
			  循环所有文件，对文件名做处理，并放入files数组中，返回files
			  不打包section和common里的html文件
		   	*/
		   	if( name.indexOf('section/') == -1 && name.indexOf('common/') == -1){
				files.push(name);
		  	}
		  
	  	}); 
	}

	return files;
}


function htmlTaskArr(options, htmlArr ){

	var changeObj = [];

	//判定changeFilePath是否为空
	if( options.changeFilePath.length != 0 ){
		//不为空时，打包修改的文件
		changeObj = options.changeFilePath;
	}
	else {
		//为空打包所有文件
		changeObj = htmlArr;
	}

	//因为要使用gulp-template，需要获取每个文件的路径
	var htmlPath = getFiles(changeObj);

	//循环并对每个文件做处理
	for( var j = 0; j < htmlPath.length ; j++){

		(function( filePath ){

			console.log( '当前html：' + filePath);
		
			var titleReg = new RegExp("(\<title\>){1}[^(\<title)(\</title\>)]+(\</title\>){1}", "i"), //title标签
				//f = filePath[i].replace('src/', 'middle/htmlBf/'), 
				vendorReg = new RegExp("(\<vendor\>){1}.+(\</vendor\>){1}", "i");  //vendor标签
		
			//读取当前html文件的内容
			var htmlContent = fs.readFileSync( filePath,'utf-8');
		
			//当前文件名
			var fileName = filePath.substring( filePath.lastIndexOf('/')+1, filePath.lastIndexOf('.'));
			//当前页面的title
			var title = htmlContent.match(titleReg) && htmlContent.match(titleReg).length ? htmlContent.match(titleReg)[0] : '';
			//当前页面引用的第三方
			var vendor = htmlContent.match(vendorReg) && htmlContent.match(vendorReg).length ? htmlContent.match(vendorReg)[0] : '';
			//当前页面的less文件
			var lessFile = filePath.substring( filePath.indexOf('src/')+4, filePath.lastIndexOf('.')).replace('views', 'static/css') + '.css';
			//当前页面的js文件
			var jsFile = filePath.substring( filePath.indexOf('src/')+4, filePath.lastIndexOf('.')).replace('views', 'static/js') + '.js';
			//当前页面的内容去掉title和vendor
			htmlContent = htmlContent.replace(title, '').replace(vendor, '');
		
		
			//循环vendor，配置引入的第三方文件
			var scriptHtml = '<script src="/commonResources/common/root.js"></script>';
			vendor = vendor.substring( vendor.indexOf('<vendor>')+8, vendor.indexOf('</vendor>')).split(',');


			//console.log( '第三方：' + vendor );
			for( var m = 0; m < vendor.length; m++){
				
				var v = vendor[m].trim();

				switch(v){
					
					case 'handlebars':
						scriptHtml += '<script src="/commonResources/common/vendor/handlebars/handlebars.js"></script>';
						global.vendorArr.push("common/vendor/handlebars/handlebars.js" );
						break;
					case 'zepto':
						scriptHtml += '<script src="/commonResources/common/vendor/zepto/zepto.js"></script>';
						scriptHtml += '<script src="/commonResources/common/vendor/zepto/callback.js"></script>';
						scriptHtml += '<script src="/commonResources/common/vendor/zepto/deferred.js"></script>';
						
						global.vendorArr.push("common/vendor/zepto/zepto.js");
						global.vendorArr.push("common/vendor/zepto/callback.js");
						global.vendorArr.push("common/vendor/zepto/deferred.js");
						break;
					case 'jquery':
						scriptHtml += '<script src="/commonResources/common/vendor/jquery/jquery1.12.3.js"></script>';
						global.vendorArr.push("common/vendor/jquery/jquery1.12.3.js");
						break;
					case 'mui':
						scriptHtml += '<script src="/commonResources/common/vendor/mui/js/mui.min.js"></script>';
						global.vendorArr.push("common/vendor/mui/js/mui.min.js");
						break;
					default: 
						break;
				}
		
			}
		
			var newTask = function( file ){
		
				return gulp.src( 'common/views/template/template.html', {base:'src'} )
					
					.pipe(plugins.template({
						'title': title,
						'less': '<link rel="stylesheet" type="text/css" href="/'+lessFile+'"></link>',
						'content': htmlContent,
						'script': scriptHtml + '<script src="/'+jsFile+'"></script>',
					})) 
		
					.pipe( plugins.rename(function(path){
						//console.log( filePath.substring('src/'+4)  );
						//if( path.dirname.indexOf('..\\common\\') != -1){
							path.dirname = filePath.substring( filePath.indexOf('src/')+4, filePath.lastIndexOf('/')) ;
							path.basename = fileName;
						//}	  
						//console.log( path );  	
					}))
		
					//处理公共路径变量
					.pipe(
						through.obj(function(file, enc, cb) {
							file = pathVar.changePathVar( file );
							this.push(file);
							cb()
						})
					)

					//@@include的文件
					.pipe(plugins.advancedFileInclude({ 
						prefix: '@@',
					}))

					//清除HTML注释
					.pipe(plugins.htmlmin({
						removeComments: true, 
					}))
		
					//与host.middleHtmlPath中的内容做比对
					.pipe(plugins.changed(options.middle, { hasChanged: plugins.changed.compareSha1Digest }))
					.pipe(plugins.debug({ title: 'html-修改的文件:' }))
			
					//这里打出到middle中，用于版本号替换
					.pipe(gulp.dest(options.middle+'project/'))

					//.pipe(gulp.dest(options.path))
			}
			
			merged.add(newTask(filePath));

		})( htmlPath[j] );

	}
}
