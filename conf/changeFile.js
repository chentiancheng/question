/**
 * npm init命令执行的脚本
 *
 * 本文件代码在npm install后执行，用来复制项目需要的node_modules里的文件到
 * 刚刚下载的nodu_moduels里
 *
 * @author yangjinlai 
 */


var path = require('path'),
    fs = require('fs'),
    os = require('os'),
    type = os.type(); //操作系统类型

console.log('当前操作系统类型：' + type);

//这里使用操作系统判断，是因为这几个文件在运维那边发布时，
//运维的命令里复制这几个文件，因此本文件只在前端使用
//而npm intall时，又没有设置环境变量，所以使用操作系统判定

if( type.toLowerCase().indexOf('windows') != -1 ){
	//windows系统，进行文件的复制
	console.log('install后，复制需要的文件');

	//读取文件夹
	fs.readdir('doc/replaceFile', function(err, files) {

	    if (err) {
	        throw err;
	    }
	    for( var i = 0; i< files.length; i++){
	    	(function(i){
	    		if( files[i].indexOf('.') != -1){
	    			return false;
	    		}

	    		var dataFile = fs.readFileSync('doc/replaceFile/'+files[i]+'/index.js','utf-8'),
	    			n_rev,
	    			filePath;

	    		try {
	    			//直接去node_modules里这个目录下读取文件
	    		    n_rev = fs.readFileSync('node_modules/'+files[i]+'/index.js','utf-8'),
	    		    filePath = 'node_modules/'+files[i]+'/index.js' ;
	    		} catch (err) {
	    			//如果没有，去目录下的/lib/目录下读取文件
	    		    n_rev = fs.readFileSync('node_modules/'+files[i]+'/lib/index.js','utf-8');
	    		    filePath = 'node_modules/'+files[i]+'/lib/index.js';
	    		}

		    	//if( n_rev.indexOf('//已复制') == -1){
		    		//没有复制过，复制
		    		console.log( '复制' + files[i] + '文件');

		    		fs.writeFile(filePath, '//已复制\n' + dataFile, function(err){
		    			if (err) 
		    			 	console.error(files[i]+'/index.js文件复制失败，错误：' + err);
		    		})
		    	//}
		    })(i);
	    }
	});


}	
