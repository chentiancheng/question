/*
 * @page: 取得url地址的参数值  公用js，返回一个包含当前地址中参数的数组
 * @Author: yangjinlai
 * @Date:   2017-05-23 11:07:02
 * @Last Modified by:   songxiaoyu
 * @Last Modified time: 2018-05-23 11:09:31
 * @description: 5-23：configString,可覆盖其他需要取参数的情况
 */


module.exports = function(configString){

	var arg = [],
		url = [],
		path = configString || window.location.href;

	//如果path中没有?，获取url会报错，所以要先判断一下
	if(path.indexOf('?') != -1){
		//有?的情况
		var s = path.substring(path.indexOf('?') + 1);

		var ss = s.split('&');
		
		for( var i = 0; i< ss.length; i++){

			var index = ss[i].indexOf('=');
			
			if( index != -1 ){
				
				if( !arg[ ss[i].substring(0, index) ] ){
					//地址栏url上可能有经过base64加密的参数，此处不处理
					arg[ ss[i].substring(0, index) ] = ss[i].substring( index+1 );
				}
			}


		}

	}

	return arg;

  	
};