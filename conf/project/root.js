/**
	浏览器下js的配置文件

	gulpEnv替换成真正的env

	

	//gulpEnv、gulpDomain在gulp打包时替换为真正的数据
**/


//环境变量
//0-本地 1-联调 2-测试 3-预生产 4-生产
window.env = gulpEnv;

//domainUrl
window.domainUrl = gulpDomainUrl;

//apiUrl
window.apiUrl = gulpApiUrl;

//goUrl
window.goUrl = gulpGoUrl;

/*window.apiUrl = '/api';
window.apisUrl = '/apis';*/

