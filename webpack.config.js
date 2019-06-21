var webpack = require('webpack'),
    path = require("path"),
    //assign  = require('object-assign'),
    //公用路径变量配置
    pathVar = require('./conf/pathVar.js').pathVarObj();

//var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"); 
 
module.exports = {
    //devtool: "source-map",  //生成sourcemap,便于开发调试
    entry: {},
    output: {
        path: path.join(__dirname, "dist/"), //文件输出目录
        //publicPath: "test/js/",     //html引用路径，在这里是本地地
        filename: "[name].js",      //根据入口文件输出的对应多个文件名
    },
    module: {
        //各种加载器，即让各种文件格式可用require引用
        loaders: [
          { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
          { test: /vux.src.*?js$/,loader: 'babel'},
          { test: /\.vue$/, loader: 'vue'}
          // {test: /\.less$/, loader: 'style-loader!css-loader?minimize&-autoprefixer!postcss-loader!less-loader'}
        ]
    },
    resolve: {
        //配置别名，在项目中可缩减引用路径，
        //@callback和@deferred是webpack独有的，用于js中引用zepto的库，因此不写到pathVar.js中
        //需要在这里合并一下
        alias: pathVar,
        extensions: ['', '.js'],
    },
    plugins: [
        //提供全局的变量，在模块中使用无需用require引入
        /*new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery",
            // nie: "nie"
        }),*/
        //将公共代码抽离出来合并为一个文件
        //new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
        //new CommonsChunkPlugin("common.js", ["page1", "page2"]),
        //new CommonsChunkPlugin("commons.js", ["p1", "p2", "admin-commons.js"]),
        //js文件的压缩
        /*new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })*/
    ]
};

/*function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    return files;
}*/

