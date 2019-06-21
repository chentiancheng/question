/**
	//项目与域名的对应配置文件

	//因该环境代码中可能有多个项目对应不同域名，需要将项目与域名对应起来

	//此处的域名只是项目内跳转需要，接口域名不需在此配置（默认以当前域名请求，若接口不在当前项目所在的服务器，运维会做转发）
	
	项目内所有跳转到不属于当前项目的链接的配置（因不在当前项目中，链接需要带域名）

**/

//引入所有链接列表
var dUrl = require('./apiUrl/domainUrl.js');

//引入所有接口列表和当前项目链接列表

//所有api接口（不带域名）
var aUrl = require('./apiUrl/api.js');

//所有apis接口（不带域名）
var asUrl=  require('./apiUrl/apis.js');

// 不区分api和apis的接口
var allUrl = require('./apiUrl/post.js');

//所有当前环境中的页面链接（不带域名）
var gUrl = require('./apiUrl/goUrl.js');


//项目与跳转链接的对应配置
//key--src下的项目文件夹
//value--域名列表中对应的那一条的key
var projectConfig = {
	'redPacket' : ['rpkpGiveRedEnvelopesUrl']
}



module.exports = function( options ){

	var domainUrl = {},  //存放需要域名的跳转链接
		apiUrl  = {}, //存放所有接口地址（没有域名）
		
		goUrl = {}, //存放不需要域名的跳转链接
		project = options.project;
		//env = options.env;

	//给siteUrl增加domainUrl
	if( project.length == 0){
		//如果没有配置，打包所有的
		for( var i in projectConfig ){
			
			//拿到projectConfig中当前项目的这一条，此时p是一个数组
			var p = projectConfig[ i ];

			if( p && p.length ){
				//循环并将对应的domainUrl中的每一条链接设置到siteUrl.domainUrl中
				for( var j = 0; j < p.length ; j++ ){
					domainUrl[p[j]] = dUrl[p[j]];
				}
			}
		}
	}
	else{
		//project有配置
		for( var i = 0; i< project.length; i++ ){
			
			//拿到projectConfig中当前项目的这一条，此时p是一个数组
			var p = projectConfig[ project[i] ];

			if( p && p.length ){
				//循环并将对应的domainUrl中的每一条链接设置到domainUrl中
				for( var j = 0; j < p.length ; j++ ){
					domainUrl[p[j]] = dUrl[p[j]];
				}
			}

			
		}
	}
	
	//给siteUrl添加allApi
	for( var i in aUrl ){
		//判断是否为本地
		if( options.env == 0){
			apiUrl[i] = 'http://' + options.ip + ':' + options.port.mock + '/api'  + aUrl[i];
		}
		else{
			apiUrl[i] = '/api'  + aUrl[i];
		}
		
	}

	for( var j in asUrl ){
		//判断是否为本地
		if( options.env == 0){
			apiUrl[j] = 'http://' + options.ip + ':' + options.port.mock + '/apis'  + asUrl[j];
		}
		else{
			apiUrl[j] = '/apis'  + asUrl[j];
		}
	}

	for( var f in allUrl ){
		//判断是否为本地
		if( options.env == 0){
			apiUrl[f] = 'http://' + options.ip + ':' + options.port.mock + allUrl[f];
		}
		else{
			apiUrl[f] = allUrl[f];
		}
	}

	//添加不需要域名的跳转链接
	for( var s in gUrl ){
		goUrl[s] = gUrl[s];
	}

	return {
		domainUrl: domainUrl,
		apiUrl: apiUrl,
		goUrl: goUrl
	};


}