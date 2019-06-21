/**
	对象操作工具类
**/

module.exports = {

	//获取数据类型
	getType: getType,

	//判定数据是否为空
	isEmpty: isEmpty,

	//对象clone
	clone: clone,

	//对象合并
	combine: combine
    
}




//获取数据类型
function getType( obj ){

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

//判定数据是否为空
function isEmpty( obj ){

	var type = getType(obj);

	if( type == 'String' || type == 'Boolean' || type == 'Null' || type == 'Undefined') {
		//字符串,boolean,null,undefined
		if( !type ){
			return true;
		}
		return false;
	}
	else if( type == 'Array'){
		if( type.length == 0){
			return true;
		}
		return false;
	}
	else if( type == 'Object'){
		for (var i in obj) {
            return false; //如果不为空，则会执行到这一步，返回false
        }
        return true;
	}
	//number和function，直接返回true
	return true;
}

//对象clone
function clone( obj ){
    var dataCopy = getType(obj)  == 'array' ? [] : {};
    for (var item in obj) {
        dataCopy[item] = typeof obj[item] === 'object' ? clone(obj[item]) : obj[item];
    }
    return dataCopy;
}

//对象合并
function combine( obj_1, obj_2){
	var d_1 = clone( obj_1 ),
		d_2 = clone( obj_2 );

	for(var key in d_2){
	    if( !d_1.hasOwnProperty(key) || (d_1[key] != d_2[key])){
	　　　　d_1[key] = d_2[key]
	　　}
	}
	return d_1;
}


