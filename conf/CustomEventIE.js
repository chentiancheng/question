/**
 * CustomEvent适配IE浏览器的处理
 *
 * gulp打包js的时候，添加在文件末尾
 *
 * @author yangjinlai 2018-09-06
 */

(function () {
  if ( typeof window.CustomEvent === "function" ) return false; //If not IE
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
