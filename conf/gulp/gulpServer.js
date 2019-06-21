/**
存放gulp任务中与服务相关的任务
**/

var gulp = require('gulp'),
	proxy = require('http-proxy-middleware'),
	plugins = require('gulp-load-plugins')(); //引入gulp插件

module.exports = function( options ){

	//gulp本地服务
	gulp.task('connect', function() {
	    plugins.connect.server({
	        root: options.path,
	        port: options.port.server,
			livereload: true,
	    });
	})

	gulp.task('proxyConf', function() {
	    plugins.connect.server({
	        root: options.path,
	        port: options.port.server,
			livereload: true,
			middleware: function(connect, opt) {
                return [
                    proxy('/api',  {
						// target: 'http://172.16.191.210:8080',
						// target: 'http://172.16.191.221:8080',//罗洋
						target: 'http://172.16.191.221:8899',//罗洋
                        changeOrigin:true,
                        secure: false,
					}),
					proxy('/oauth',  {
						// target: 'http://172.16.192.151:8080',
						// target: 'http://172.16.191.221:8080',//罗洋
						target: 'http://172.16.191.221:8899',//罗洋
						// target: 'http://172.16.192.83:8080', // 申贺龙
                        changeOrigin:true,
                        secure: false,
                    }),
                ]
            }
	    });
	})
	
	//gulp-mock-server   mock模拟假数据
	gulp.task('mock', function() {
	    gulp.src('.')
	        .pipe(plugins.mockServer({
	            //livereload: false,
	            host: options.ip,
	            // host: '172.16.191.124',
	            directoryListing: true,
	            port: options.port.mock,
	            open: false,
	            //https: true,
	            allowCrossOrigin: true
	        }));
	})
	
}
