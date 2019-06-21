.
├── package.json                 
├── README.md                    
├── gulpfile.js                  // gulp 配置文件
├── webpack.config.js            // webpack 配置文件
├── doc                          // doc   目录：放置应用文档
├── test                         // test  目录：测试文件
├── dist                         // dist  目录：放置开发/测试时候的打包文件
├── build                        // build 目录：放置 prodcution（线上）打包文件
├── data                         // 数据 mock 相关  
├── src                          // 源文件目录
│   ├── views                    // html 目录 
│   │   ├── common				 // 公用结构 html 目录 可能包含共享组件，共享工具类
│   │   ├── ... 				 // 业务模块 html 目录 
│   │   └── index.html 			 // 首页 html 目录 
│   ├── js                       // js 目录 
│   │   ├── common               // 所有页面的共享区域，可能包含共享组件，共享工具
│   │   │   ├── components		 // 包含共享组件，共享工具
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   ├── root.js          // 域名配置文件
│   │   │   └── ... 			 
│   │   ├── vendor               // 公用第三方 js 目录
│   │   │   ├── bootstrap
│   │   │   ├── jquery         
│   │   │   └── ...
│   │   ├── ...                  // 业务文件夹目录
│   │   │   
│   ├── less                     // less 目录
│   │   ├── common 
│   │   │   ├── components       // 共享组件，共享工具
│   │   │   ├── footer.less      
│   │   │   ├── header.less       
│   │   │   └── ... 
│   │   ├── ...                 // 业务 页面样式目录
│   │   │     
│   │   ├── index.less   		// 首页样式目录
│   │   │
│   └── img 					// 图片 目录
│       ├──common
└──     └── ...
