'use strict';

/**
 *  前端-微信H5 gulp打包配置
    @author yangjinlai 2019-01-19

    common-底层组件，conf--环境配置，打包配置，域名配置，接口路径配置，src--正式的项目文件

    不同的微信H5项目都可以放在这个环境中，项目按照域名区分，不同域名因运维需有不同的部署环境，需要放在不同文件夹下做映射

    所以在src中，用不同文件夹放不同项目（域名不同），如果有文件是多个域名下都需要的，放在commonResources文件夹中（比如模板页），方便运维部署时不用每次都新增文件夹映射

    因此一个项目打包时，打的是两个文件夹中的文件：一个是这个项目文件夹，一个是commonResource文件夹

    (commonResources文件夹下，有一个richModules文件夹，用来放所有不需要引入reset.less文件的模板页面)

    指定当前项目，使用命令行的project参数，如： gulp --env 1 --project ***，***表示当前项目src下的文件夹名称

    gulp会自动打出这个文件夹下的文件，以及commonResources文件夹下的文件
    
    命令行参数：
    1. 指定当前环境，在命令行中传 --env
    2. 指定当前打包项目，在命令行中传 --project

    注意事项：

    1. 打包图片时，除了打包当前项目和commonResources中的，还会把common文件夹下的图片打包出来，放在options.path路径下的common文件夹中
    路径不变

    2. 打包less文件时
        1）除了commonResources/richModules中的文件外，都会被自动引入baseClass.less和reset.less文件，因此这两个文件不需要在业务less文件中单独引用
        2）所有不需要单独打包的less文件需要放在common文件夹中，如src/newYear/static/less/common/getData.less
        3）所有不需要单独打包的区域section文件需要放在section文件夹中，如src/newYear/static/less/section/section1.less
        4）其他less文件都会单独打出一个css文件来
        5) 每个页面对应的less文件的名称需要和html文件名称一致，html文件无需引入，打包时会自动打上

    3. 打包js文件时
        打包root.js文件时，若接口不在当前项目所在的服务器，运维会做转发，因此不需配置接口域名，只需配置页面跳转域名，接口默认在当前域名下（不需加域名）
        打包其他文件时，会自动获取webpack的入口文件，规则如下：
            1）所有不需要单独打包的js文件需要放在common文件夹中，如src/newYear/static/js/common/getData.js
            2）所有不需要单独打包的区域section文件需要放在section文件夹中，如src/newYear/static/js/section/section1.js
            3）其他js文件都会被自动当作webpack打包js的入口文件
            4) 每个页面对应的js文件的名称需要和html文件名称一致，html文件无需引入，打包时会自动打上

    4. 打包html文件时
        默认引入的第三方文件有jQuery，zepto和mui，handlebars的js和css文件，其他第三方需在自己的html页面上单独引入


    联调环境，需自己修改nginx联调环境中的配置，将接口转发到联调服务器（或发布到前后端开发联调服务器上，此时需要发版）

    static中的image/less/js文件夹，
    

 */


//引入构建需要的插件
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(), //引入gulp插件
    
    //node模块
    os = require('os'),
    minimist = require('minimist'); //命令行替换变量

//默认环境变量
//env----变量活动
var knownOptions = {
    string: 'env', 
    default: { 
        env: process.env.NODE_ENV || '0', //默认开发环境
        project: '' //默认打包所有项目
    }
}; 


//将命令行的参数和knownOptions合并
var options = minimist(process.argv.slice(2), knownOptions);

//保存project变量
var project = options.project;

//获取当前电脑的ip
var localIp = (function(){
    // var osNet = os.networkInterfaces();
    // for(var devName in osNet){

    //     console.log( devName );

    //     var iface = osNet[devName];

    //     for(var i=0;i<iface.length;i++){
    //         var alias = iface[i];

    //         console.log( alias );

    //         if(alias.family === 'IPv4' && (devName == '本地连接'|| devName.indexOf('以太网') != -1)){
    //             console.log( '当前本地ip：' + alias.address );
    //             return alias.address;
    //         }
    //     }
    // }
    var interfaces = require('os').networkInterfaces();
        for(var devName in interfaces){
            var iface = interfaces[devName];
            for(var i=0;i<iface.length;i++){
                var alias = iface[i];
                if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                    return alias.address;
                }
            }
        }
})();
// var localIp = '172.16.192.210';

//给options增加其他属性
options.path = (function(){//web本地服务器配置
    //通过环境变量给host.path赋值
    if (options.env === '0') {
        //开发环境和联调环境的包进dist
        return 'dist/';
        //不需要打压缩包
    } else if (options.env === '1') {
        //测试环境的包进ht_test
        return 'ht_dev/';
    } else if (options.env === '2') {
        //测试环境的包进ht_test
        return 'ht_test/';
    } else if (options.env === '3') {
        //预生产的包进ht_pre_production
        return 'ht_pre_production/';
    } else if (options.env === '4') {
        //生产的包进ht_production
        return 'ht_production/';
    } else if(options.env === '5') {
        // proxy联调
        return 'dist/'; 
    }
})();
options.zip_name = (function(){  //用于zip包的压缩文件名
    if (options.env === '1') {
        //测试环境的包进ht_test
        return 'ht_dev';
    } else if (options.env === '2') {
        //测试环境的包进ht_test
        return 'ht_test';
    } else if (options.env === '3') {
        //预生产的包进ht_pre_production
        return 'ht_pre_production';
    } else if (options.env === '4') {
        //生产的包进ht_production
        return 'ht_production'; 
    }
})();
options.port = {
        server: 7000, //作为当前项目的本地服务的端口号
        mock: 7079 //当前项目本地Mock服务的端口号
    };
options.ip =  localIp, //本地ip
options.middle =  'middle/' //打包中文件存放地址，供任务中直接使用

//判断文件路径，如果project是空，打包所有项目，其他情况下，打包project指定项目下的文件和commonResources文件夹下的
options.filesArr = [];
if ( !project ){
    options.filesArr.push('src/**/');
}
else{
    options.filesArr.push( 'src/' + project + '/' );
    options.filesArr.push( 'src/commonResources/' );
}

//给options添加一个changeFilePath，用于每次修改文件时设置修改的文件路径
//根据js数组复制的关联性，在后面修改了changeFilePath时，传递到各gulp打包文件中的options也会跟着改变
options.changeFilePath = [];


console.log( '当前项目配置options：' + JSON.stringify(options) );



//gulp任务直接require并执行
require('./conf/gulp/gulpServer.js')( options );
require('./conf/gulp/gulpZip.js')( options );
require('./conf/gulp/gulpClean.js')(options  );
//先打包html文件，拿到vendor配置
require('./conf/gulp/gulpHtml.js')(options);

require('./conf/gulp/gulpVendor.js')(options  );
require('./conf/gulp/gulpImage.js')(options);
require('./conf/gulp/gulpLess.js')(options);
require('./conf/gulp/gulpJs.js')(options);
require('./conf/gulp/gulpBf.js')(options);

require('./conf/gulp/gulpRev.js')(options);

//默认执行的任务
//开发环境、联调环境需启动本地和mock服务
if (options.env === '0') { 

    console.log("开发环境执行mock模拟数据服务器");
    //gulpServe();
    gulp.task('default', ['initialTask', 'connect', 'mock'])
    
} else if(options.env === '5'){
    gulp.task('default', ['initialTask', 'proxyConf'])

} else {

    console.log("不启动服务器，做运维环境部署打包用");
    gulp.task('default', ['initialTask','zip'])

}


/**
    打包所有文件的命令
    先清除所有文件
    然后打包第三方文件，非第三方的图片、字体文件、js、css、html
**/
gulp.task('initialTask', function(cb) {
    plugins.sequence(
        'clean', 
        'images', 
        'less', 
        'webpack', 
        'html', 
        'vendor',
        'rev', 
        cb);
});



//该变量用于标识是否是watch任务监听的打包
//因为替换html中的版本号时，如果不用这个变量控制，会导致gulp刚启动时的默认打包所有文件的任务
//中替换全部版本号，浏览器一直在不停刷新
//所以这里用此变量控制
//默认为false---不是watch的监听
//在watch任务中，如果进了该任务，会将此变量重置为true
//替换版本号时，如果此变量为true时，才会重启浏览器，达到控制的目的
global.isWatch = false;


/*********************一些默认变量设置  end******************************/




/***************************watch监听打包任务******************************/
//开发环境/联调环境监听打包
if (options.env === '0' || options.env === '5') { 

    gulp.watch( ['src/**/*' , 'common/**/*'], function(event) {

        //监听到的修改的文件         
        var filePath = event.path,
            fileExt = filePath.substring( filePath.indexOf('.') + 1 );

        //将此变量设置为true，表示进入watch监听状态
        global.isWatch = true;

        filePath = filePath.substring( filePath.indexOf('src'));
        
        console.log('当前修改文件：' + filePath);

        //判断文件类别
        if( fileExt == 'js'){
            //js文件
            if( filePath.indexOf('common\\') != -1 || filePath.indexOf('section\\') != -1) {
                //common文件夹下，或src中section文件夹下的文件,打包所有js文件
                plugins.sequence('webpack', 'rev', function() {});
            }
            else {
                //其他情况，打包当前修改的文件
                options.changeFilePath = [filePath];
                plugins.sequence('webpack', 'rev', function() {
                    options.changeFilePath = [];
                });
            }
        }
        else if( fileExt == 'less') {
            //less文件
            if( filePath.indexOf('common\\') != -1 || filePath.indexOf('section\\') != -1) {
                //common文件夹下，或src中section文件夹下的文件,打包所有less文件
                plugins.sequence('less', 'rev', function() {});
            }
            else {
                //其他情况，打包当前修改的文件
                options.changeFilePath = [filePath];
                plugins.sequence('less', 'rev', function() {
                    //打包后将changeFilePath重置为空
                    options.changeFilePath = [];
                });
            }
        }
        else if( fileExt == 'html' ){
            //html文件
            if( filePath.indexOf('common\\') != -1 || filePath.indexOf('section\\') != -1) {
                //common文件夹下，或src中section文件夹下的文件,打包所有less文件
                plugins.sequence('html', 'rev', function() {});
            }
            else {
                //其他情况，打包当前修改的文件
                options.changeFilePath = [filePath];
                plugins.sequence('html', 'rev', function() {
                    options.changeFilePath = [];
                });
            }
        }
    })


}