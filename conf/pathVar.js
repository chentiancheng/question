/**
 * less、js、html文件的公用路径变量
 * @author yangjinlai 2018-10-19
 *
 * 此文件被gulpfile.js和webpack.conf.js引用
 *
 * gulpfile.js中，处理less和html文件的公用路径
 * webpack.conf.js中，处理js文件的公用路径
 *
 * 为统一处理，所有文件中的公用路径前面都使用@，如@pathInclude，@pathCommonJs
 *
 * 若需新增或修改公用路径变量，改动pathVar变量即可
 */

var path = require('path');

//此处配置less、html文件的公用路径变量
//从src下面的文件夹开始
var pathVar = {

    '@commonLess': '/common/less', //common/less文件夹
    '@commonJs': '/common/js',
    '@commonComponents': '/common/components',
    '@projectApi': '/conf/project/api',

	// '@pathInclude': '/include',  //include文件夹
	// '@pathIncludJs': '/include/js',  //include文件夹
 //    '@pathCommonJs': '/common/js', //common/js
 //    '@pathCommonJsCom': '/common/js/components', //common/js/components
 //    '@pathCommonJsComBus': '/common/js/components/businessUtil', // components/businessUtil
 //    '@pathCommonLess': '/common/less', //common/less
 //    '@pathCommonLessCom': '/common/less/components',  // common/less/components
 //    '@pathCommonViews': '/common/views', //common/views
    //以下两个只是在js中用的，为zepto需要单独引入的库
    '@callback' : '/include/js/vendor/zepto/callback.js',
    '@deferred' : '/include/js/vendor/zepto/deferred.js',
};

var arr = []
for (var  i in pathVar) {
    arr.push({
        key: i,
        value: pathVar[i]
    })
}
//将pathVar按索引长度从长到短排序，防止先替换了短的，长的会出错
arr = arr.sort (function(a,b){
    return a.key.length < b.key.length
});
//arr = arr.reverse();
// console.log(arr);

var newPathVar = {};
for( var j in arr){
    newPathVar[arr[j].key] = arr[j].value;
}
// console.log(newPathVar);

module.exports = {

	//由于webpack自带公用路径变量的处理（别名alias），可以不使用changePathVar方法
	//因此把pathVar导出，给webpack用，需要处理成webpack.config.js中需要的格式
	pathVarObj : function(){
        var pathVorObj = {};

        for( var i in newPathVar ){
            pathVorObj[i] = path.join(__dirname, '..', newPathVar[i]).replace(/\\/g, '/')
        }

        return pathVorObj;
    },

	//gulpfile.js中，需使用changePathVar方法
	changePathVar: function( file ){
		//挑出文件中@@include的代码，如果其中有@@pathCommonViews等
        //公用路径变量，替换为相对路径
        var fileCon = file.contents.toString(),
            //relativePath为本文件的相对路径
            relativePath = path.relative( path.dirname(file.path), 'src').replace(/\\/g, '/');

        //开始替换
        //if( fileCon.indexOf('@path') != -1){
            for ( var i in newPathVar ){
                var re = new RegExp(i, 'g');
                fileCon = fileCon.replace(re, relativePath + newPathVar[i] );
            }
        //}
        
        file.contents = new Buffer(fileCon);

        return file;
	}
	
}