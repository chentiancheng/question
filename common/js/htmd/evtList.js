/**
	evt参数列表
	每一条都有type, evtid, topic, info四个参数，另外还有一个ctime参数需要在发送请求时，在htmd.js中设定
**/


var evtList = {
	
	'onload' : {type:'load', evtid:0,  topic:'页面加载', info: '页面加载' },
	'onbeforeunload' : {type:'beforeunload', evtid:1,  topic:'页面离开', info: '页面离开' },

	'register': {type:'click', evtid:2,  topic:'注册按钮点击', info: '注册页面-注册按钮点击' },
	'login': {type:'click', evtid:2,  topic:'登录按钮点击', info: '登录页面-登录按钮点击' },

}