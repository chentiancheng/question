/**
    zepto发送ajax请求

    适用于不使用JSON.stringify转参数的，且成功状态为0000的接口请求

    0000-接口成功
    4000-跳转接口返回的链接
    其他情况全部为接口异常，有msg显示msg，没有msg显示'系统异常'

    不考虑跨域请求，如果是跨域了，运维ningx做转发
**/

//黑色提示条的显示和隐藏
var tipAction = require("../tipAction.js");
//obj工具类
var objUtil = require("../util/objUtil.js");

;
(function($) {

    $.extend($, { 

        ajaxNoStringify: function( param ) { 

        	var obj = {
        		cache: true,
        		type: param.type ? param.type : 'post',  //默认为Post请求
        		url: param.url,
        		dataType: "json",
                async: param.async ? param.async : 'true', //默认异步
        		success: function(data){

        			if( data.status == '0000'){
        				//接口正常返回数据
        				param.callbackDone && (param.callbackDone(data));
        			}
        			else if(data.status == 4000){ 
        				//跳转返回的链接
        			    window.location.href = data.data;
        			}
        			else{
        				//数据请求失败的情况
                        if (!data.msg) {
                            data.msg = '系统异常';
                        }
                        param.callbackFail ? param.callbackFail(data) : tipAction( data.msg  ); 
                        return false;
        			}
        		},
        		error : function( data ){
        		    if (!data.msg) {
				        data.msg = '系统异常';
				    }
				    param.callbackFail ? param.callbackFail(data) : tipAction( data.msg  ); 
        		}
        	};

        	if( param.data ){
        		obj.data = param.data;
        	}

        	//发送请求
			$.ajax(obj);
        }

    })

})(Zepto);