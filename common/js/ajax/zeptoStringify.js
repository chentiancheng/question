/**
 * ajax请求的封装
 * @author  yangjinlai  

   适用于使用JSON.stringify转参数的，且成功状态为4000的接口请求

   传参：
   {
    type: '' || formData' || 'crossDomain', 可不传，不传默认为普通请求
    param: {
        //ajax请求需要的参数
        url: ***,
        type: ***,
        data: ***
        ……
        callbackDone: function，接口成功时调用
        callbackFail：function，接口失败时调用
        callbackLoginFunc: 接口未登录，且不跳转时调用，与loginNotJump参数配合使用
    },
    loginNotJump: true || false, 默认false, 未登录时不跳转 
   }

   code--CF0004，未登录

 *
 */


//黑色提示条的显示和隐藏
var tipAction = require("../tipAction.js");
//obj工具类
var objUtil = require("../util/objUtil.js");


;
(function($) {

    $.extend($, {

        ajaxStringify: function( ajaxObj ) { 

            var ajaxJson = {},
                param = ajaxObj.param;

            //先对contentType和data做处理
            //如果是本地，需要用JSON.stringify处理
            var contentType = window.env == 0 ? 'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json; charset=UTF-8',
                data = window.env != 0 && ajaxObj.type != 'formData' ? 
                    ( param.data ? JSON.stringify(param.data) : false) : 
                    ( param.data ? param.data : false); 

            //不同类型的ajax请求公用参数及成功失败处理
            var defaultObj = {
                type: param.type ? param.type : 'post', //默认post
                url: param.url, 
                dataType: param.dataType ? param.dataType : "json",
                contentType: contentType,
                async: param.async ? param.async : 'true', //默认异步
                success: function(data){

                    // if (data.status == '4007') { 
                    //     //不知道是什么状态码
                    //     //window.jsObj.toLogin();
                    //     return false;
                    // }
                    // if ( param.loginNotJump && data.data.isLogin == '2') { 
                    //     //如果未登录，且不需要跳转,sso接口未登录code也是cf0004,需要通过islogin判断
                    //     param.callbackLoginFunc && param.callbackLoginFunc(data);
                    //     return false;
                    // } 

                    // if ( data.code == 'CF0004') {
                    //     //黑名单接口未登录，跳转data.data
                    //     window.location.href = data.data;
                    //     //防止window.location.href在执行完请求里的所有代码之后再跳转
                    //     throw 'jump login';
                    //     return false;
                    // }
                    // debugger
                    //接口请求失败
                    if (data.status != '0000' && data.status != '4007' && data.status != '1000') { 
                        // if (!data.msg) {
                        //     data.msg = '系统异常';
                        // }
                        param.callbackFail ? param.callbackFail(data) : tipAction( data.msg  ); 
                        return false;
                    };
                    
                    //走到此处，接口请求成功
                    param.callbackDone && (param.callbackDone(data) );
                },
                error : function( ){

                    // if (!data.msg) {
                    //     data.msg = '系统异常';
                    // }
                    param.callbackFail ? param.callbackFail(data) : tipAction( data.msg  ); 
                    
                }
            }

            if( ajaxObj.type == 'crossDomain' ){
                //跨域请求，将跨域请求需要的参数和defaultObj合并
                ajaxJson = objUtil.combine( objUtil.clone( defaultObj, {
                    //跨域需要以下配置
                    jsonp: "callback",
                    crossDomain: true,
                    //这段代码不能注释，否则跨域时cookie带不过去
                    xhrFields: {
                        withCredentials: env != 0 ? true : false
                    },
                    headers: {
                        "X-Requested-With": 'XMLHttpRequest',
                    }
                }) );
                if (env == 0) {
                    //如果是本地开发则使用模拟数据，不需要添加headers
                    delete ajaxJson["headers"];
                };
            }
            else if ( ajaxObj.type == 'formData' ) {
                //使用formData格式上传
                ajaxJson = objUtil.combine( objUtil.clone( defaultObj, {
                    contentType: false,
                    processData: false
                }) );
            }
            else{
                //普通ajax请求
                ajaxJson = objUtil.clone( defaultObj);
            }
            
            //data的设置放在这里
            if( data ){
                ajaxJson.data = data;
            }

            //发送请求
            $.ajax(ajaxJson);
        }

    })

})(Zepto);
