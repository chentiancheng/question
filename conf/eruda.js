/**
 * eruda手机端调试
 *
 * 在url上添加参数eruda=true，即可出现eruda控制台
 *
 * gulp打包js的时候，添加在文件末尾
 *
 * @author yangjinlai 2018-09-06
 */

(function () { 
    if( window.env != 4 && window.location.href.indexOf('eruda=true') != -1){
        //非生产环境且url上eruda参数为true
        var script = document.createElement('script'); 
        script.src="//cdn.jsdelivr.net/npm/eruda"; 
        document.body.appendChild(script); 
        script.onload = function () { eruda.init() } 
    }
})();

