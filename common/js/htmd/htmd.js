/**
	前端埋点js

	参数在加载js后便获取
	但发送请求需在所有dom结构修改完毕之后调用
	防止title是js设置的，页面一开始时获取不到

**/

(function(){

	var md = {}, 
		//存放埋点过程中的各种数据
		param = {
			time : {
				nTime: 0, //newTime，进入页面的时间
				rTime: 0 //removeTime，离开时间
			}, //用来存放进入页面的时间和离开时间，计算页面停留时长
			tm: '', //存放外部传进来的tm参数
			pf: '', //存放外部传进来的pf参数
			//domain : '', //存放cookie设置时的平台对应的域名 
			url : '', //存放接口路径
			data : {}, //data用来存放给接口提供的所有参数
			scout : 0 , //同一个session会话期内访问的次数，请求一次日志scount加1
		},
		//存放最后提交给接口的数据
		fData = {};
		

	//提交给接口的数据
	md.json = {};
	//提交给接口的数据（不同端的公共参数）默认配置
	md.json.common = {
		evt : {}, //事件相关
		st: 0, //页面停留时长
		scroll: 0, //页面滚动次数
		uvid: '', //用户访问id（需前端创建）
		ds: '', //屏幕分辨率
		cn: '', //客户编号（sso接口返回，前端保存到cookie中）
		tm: '', //终端类型，1.PC 2.WAP 3.APP 4.微信
		pf: '' //平台，1.金服 2.理顾宝 3.新app
		
	}
	//pc/wap/微信共用
	md.json.browser = {
		sstat: '', //会话状态
		tt: '', //页面title
		cl: '', //颜色质量
		ln: '', //网页字符集
		v : '1.0.0', //前端埋点版本号
		ck: '', //是否启用cookie，0-否，1-是
		ja: '', //是否支持Java，0-否，1-是
		fv: '', //浏览器支持的flash版本，0-无，其他-版本号
		lst: '', //是否支持localStorage, 0-不支持，1-支持
		rv: '', //随机数 
		sf: '' //页面来源地址（上一个页面地址），非必传
	}
	//app使用
	md.json.app = {
		pid: '', //页面id，每个app页面对应一个全局唯一id
		ls: '', //是否登录，0-否，1-是
		nt: '', //wifi/流量，0-网络异常；1-wifi；2-2G；3-3G；4-4G；5-5G
		mno: '', //电信运营商，1. 中国移动 2.中国联通 3.中国电信 4.其他
		mb: '', //设备品牌
		mt: '', //设备型号
		sv: '', //当前设备操作系统版本
		v: '', //当前APP应用版本号
		sf: '' //上一个页面pid

	}

	//数据处理
	md.util = {};
	md.util.getType = function( obj ){

		if( Object.prototype.toString.call(obj) === '[object Number]' ){
			//数字
			return 'Number';
		}
		else if (Object.prototype.toString.call(obj) === '[object String]') {
		    //字符串
		    return 'String';
		}
		else if( Object.prototype.toString.call(obj) === '[object Array]' ){
			//数组
			return 'Array'
		}
		else if( Object.prototype.toString.call(obj) === "[object Function]") {
		    //函数
		    return 'Function';
		}
		else if( Object.prototype.toString.call(obj) === "[object Boolean]" ){
			//Boolean
			return 'Boolean';
		}
		else if( Object.prototype.toString.call(obj) === "[object Null]" ){
			//Null
			return 'Null';
		}
		else if( Object.prototype.toString.call(obj) === "[object Object]" ){
			//Object
			return 'Object';
		}
		else if( Object.prototype.toString.call(obj) === "[object Undefined]" ){
			//Undefined
			return 'Undefined';
		}
	}
	//对象clone
	md.util.clone = function( obj ){
		var dataCopy = md.util.getType(obj)  == 'Array' ? [] : {};
	    for (var item in obj) {
	        dataCopy[item] = typeof obj[item] === 'object' ? md.util.clone(obj[item]) : obj[item];
	    }
	    return dataCopy;  
	}
	//两个对象合并，data_2复制到data_1上
	md.util.objCombine = function( obj_1, obj_2){
		var d_1 = md.util.clone( obj_1 ),
			d_2 = md.util.clone( obj_2 );

		for(var key in d_2){
		    if( !d_1.hasOwnProperty(key) || (d_1[key] != d_2[key])){
		　　　　d_1[key] = d_2[key]
		　　}
		}
		return d_1;
	}
	//将obj转化为get请求可以直接拼的参数
	md.util.objToUrl = function( data ){
		var params = '?';
		for ( var i in data ){
			var t;
			if( md.util.getType(data[i]) == 'Object' ){
				//如果是对象，需要再转一次
				t = md.util.objToUrl( data[i]);
			}
			else{
				t = md.util.isChinese(data[i]) ? encodeURIComponent(data[i]) : data[i];
			}
			params += i + '=' + t + '&';
		}
		//循环后将最后一个&去掉
		params = params.substr(0, params.length-1);
		return params;
	}
	//判断字符串是否含有中文
	md.util.isChinese = function( str ){
		if(/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
			return true;
		}
		return false;
	}

	//埋点请求相关
	md.log = {};
	//发送埋点请求的方法
	md.log.commit = function() {

    	var tm = param.tm,
    		data = md.util.objToUrl(fData);

		if( tm == 'pc' || tm == 'wap' || tm == 'wx'){
			var img = new Image();
			img.onload = img.onerror = img.onabort = function() {
			    img = img.onload = img.onerror = img.onabort = null;
			    param.scout++;
			};
			img.src = 'https://dc.baidu.com/dc.gif' + data;
		}
		else if( tm == 'app'){
			param.url = 'https://dc.baidu.com/mdc';

		}
    };
    md.log.getData = function(){
		//设置此处可以直接取到的参数的值
		//公共参数(除evt，st和scroll之外的)
		fData.tm = param.tm;
		fData.pf = param.pf;
		fData.ds = (window.screen.width || 0) + "x" + (window.screen.height || 0);
		fData.cn = '客户编号，从sso接口获取';
		fData.uvid = md.cookie.get('uvid');
		//browser参数
		(fData.tt === '') && (fData.tt = (document.title ? document.title : '') );
		(fData.cl === '') && (fData.cl = (window.screen.colorDepth || 0) );
		(fData.ln === '') && (fData.ln = (navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "" ));
		(fData.ck === '') && (fData.ck = (navigator.cookieEnabled ? 1 : 0));
		(fData.ja === '') && (fData.ja = (navigator.javaEnabled() ? 1 : 0));
		(fData.fv === '') && (fData.fv = (function() {
	        var a = "";
	        if (navigator.plugins && navigator.mimeTypes.length) {
	            var b = navigator.plugins["Shockwave Flash"];
	            b && b.description && (a = b.description.replace(/^.*\s+(\S+)\s+\S+$/, "$1"))
	        } else if (window.ActiveXObject) try {
	            if (b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))(a = b.GetVariable("$version")) && (a = a.replace(/^.*\s+(\d+),(\d+).*$/, "$1.$2"))
	        } catch(d) {}
	        return a
	    })());
	    (fData.lst === '') && (fData.lst = (function (){
			var ls = ('localStorage' in window && window['localStorage'] !== null) ? 1 : 0;
		    return ls; 
		})());
		(fData.rv === '') && (fData.rv = md.num.getRandom());
		(fData.sf === '') && (fData.sf = encodeURIComponent(document.referrer));
		//app参数
		//拿到app传给H5参数的方式，需要和app约定
		(fData.pid === '') && (fData.pid = '');
		(fData.ls === '') && (fData.ls = '');
		(fData.nt === '') && (fData.nt = '');
		(fData.mno === '') && (fData.mno = '');
		(fData.mb === '') && (fData.mb = '');
		(fData.mt === '') && (fData.mt = '');
		(fData.sv === '') && (fData.sv = '');
		(fData.v === '') && (fData.v = '');
		(fData.sf === '') && (fData.sf = '');
    }

	//数字
	md.num = {};
	//获取8位随机数
	md.num.getRandom = function(){
		return parseInt( Math.random() * (99999999-10000000) + 10000000 );
	}

    //时间相关
    md.time = {};
    //获取当前时间戳
    md.time.getTime = function(){
    	return new Date().getTime();
    };
    (function(){
    	//设置当前时间，用于后面计算页面停留时长
    	param.time.nTime = md.time.getTime();
	})();


    //判断不同终端，进行参数和接口路径的不同处理
    md.tm = {};
    //判断终端，返回提交数据的接口路径
    //app内嵌H5的路径与其他不同
 //    md.tm.commitUrl = function( ){
 //    	var tm = param.tm;
	// 	if( tm == 'pc' || tm == 'wap' || tm == 'wx'){
	// 		param.url = 'https://dc.baidu.com/dc.gif';
	// 	}
	// 	else if( tm == 'app'){
	// 		param.url = 'https://dc.baidu.com/mdc';
	// 	}
	// }
	//判断不同端，设置不同参数
	md.tm.getData = function( tm ){

		var bData = md.json.browser,
			aData = md.json.app;

		if( tm == 'app'){
			//合并md.json.common与md.json.app
			fData = md.util.clone( md.util.objCombine( md.json.common, md.json.app ));
		}
		else{
			//合并md.json.common与md.json.browser
			fData = md.util.clone( md.util.objCombine( md.json.common, md.json.browser ));
		}
	}

    //平台相关
	md.pf = {};
	//判断平台，设置当前cookie存放的域名
	md.pf.domain = function(pf){	
		if( pf == 'htjf_pc' || pf == 'htjf_wap' || pf == 'htjf_wx' || pf == 'htjf_app'){
			param.domain = 'chtwm.com' 
		}
		else if( pf == 'lgb_app'){
			param.domain = '';
		}
	}

    //cookie相关
    md.cookie = {};
    //设置cookie
    md.cookie.set = function(name, value){
    	//设置cookie过期时间，默认10年
    	var expires = new Date(); 
    	expires.setTime(param.time.nTime + 10*24*60*60*1000);

    	//过期时间为10年，且为secure
    	document.cookie = name + "=" + value + (param.domain ? "; domain=" + param.domain: "; domain=" + document.domain) 
    		//+ "; path=/; expires=" + expires.toGMTString()
    		+ "; secure";
    }
    //获取cookie
    md.cookie.get = function( name ){
    	var strcookie = document.cookie, //获取cookie字符串
    		arrcookie = strcookie.split("; ");//分割
    	//遍历匹配
    	for ( var i = 0; i < arrcookie.length; i++) {
	    	var arr = arrcookie[i].split("=");
	    	if (arr[0] == name){
	    		return arr[1];
	    	}
    	}
    	return ""; 
    }


    //获取外部文件（所有evt参数列表、app页面id列表）
    md.file = {};
    md.file.get = function( tm ){
    	//引入所有evt参数列表
    	var k = document.createElement("script");
    	k.src = '/commonResources/common/js/htmd/evtList.js';
    	var m = document.getElementsByTagName("script")[0];
    	m.parentNode.insertBefore(k, m);

    	if( tm == 'app'){
    		//app的时候，还需要引入appHtmlList.js
    		var k_2 = document.createElement("script");
	    	k_2.src = 'appHtmlList.js';
	    	var m_2 = document.getElementsByTagName("script")[0];
	    	m_2.parentNode.insertBefore(k_2, m_2);
    	}
    };

    //事件监听
    (function(){

    	//设置发送埋点请求前获得的数据
    	function commit( type , htmdEvt){
    		if( type == 'onload'){
    			fData.evt = evtList['load'];
    			fData.evt.ctime = md.time.getTime();
    			fData.st = 0; //初次进入页面，st为0
    		}
    		else if( type == 'onbeforeunload'){
    			fData.evt = evtList['beforeunload'];
    			fData.evt.ctime = md.time.getTime();
    			fData.st = fData.evt.ctime - param.time.nTime;
    		}
    		else if( type == 'onclick'){
    			fData.evt = evtList[ htmdEvt ];   
    			fData.evt.ctime = md.time.getTime(); 			
    			fData.st = fData.evt.ctime - param.time.nTime;
    		}
    		(fData.sstat === '') && ( fData.sstat = md.cookie.get('uvid') + '_' + md.time.getTime() + '_' + param.scout );
    		fData.scroll = md.json.common.scroll;
    		//发送请求
    		md.log.commit();
    	}

    	window.onload = function () {
    		//所有dom结构处理完毕,发送一次请求
    		commit( 'onload' );
    	};

    	window.onbeforeunload = function () {
    		//离开页面，获取当前时间，得到页面停留时长
    		commit( 'onbeforeunload' );
    	};


    	window.onscroll = function () {
    		//页面滚动，滚动次数+1
    		md.json.common.scroll++;
    	};

    	//点击事件监听，使用事件代理的方式绑定到body上
    	var body = document.getElementsByTagName("body")[0]; 
    	body.onclick = function (event) { 
    		event = event || window.event; 
    		var target = event.target || evt.srcElement; 
    		// 获取目标元素，如果有htmdEvt属性，拿到evt列表中对应的数据，并提交一次埋点请求
    		var htmdEvt = target.getAttribute('htmdEvt'); 
    		if( !!htmdEvt ){
    			commit( 'onclick', htmdEvt);
    		}
    	} 
    })();

	//_htmd方法为外部调用
	//需传参tm-终端，pf-平台
	window._htmd = function( tm, pf){

		param.tm = tm;
		param.pf = pf;

		//执行pf.domain方法，设置cookie需要的域名
		md.pf.domain( pf );

		//设置uvid
		var uvid = md.num.getRandom();
		//如果cookie里没有uvid，重新设置一个
		if(!md.cookie.get('uvid') ){
			md.cookie.set( 'uvid', uvid );
		}

		//获取其他埋点文件
		md.file.get( tm );
		//判断当前终端所需要提供的所有参数，设置给fData
		md.tm.getData( tm );
		//获取此处可以直接设置的参数值
		md.log.getData();
		

	}

})();



