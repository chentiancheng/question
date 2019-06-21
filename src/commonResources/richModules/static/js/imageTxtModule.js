/**
	带图片的富文本模板页面js
**/

require('@commonJs/ajax/zeptoStringify.js');

var imgTxt = {

	init: function(){
		var that = this;

		that.getData();
	},

	getData: function(){ 

		var obj = {
			param: {
				url: apiUrl.openApi,
				data:{
				    hmac: "", //预留的加密信息 非必填项
				    params:{}//请求的参数信息
				},
				needDataEmpty: false,
				callbackDone:function(json){
				    var data = json.data;
				    var status = json.status;
				    var message = json.message;
				    if(status === "0000"){
				        $(".content").html(data.remark);

				        $('img').attr('src', '/commonResources/richModules/static/image/bg.png')
				    }else{
				        tipAction(message);
				    }
				},
				callbackFail:function(json){
				    var message = json.message;
				    tipAction(message);
				}
			}
		    
		};
		$.ajaxStringify(obj);
	}
}

imgTxt.init();