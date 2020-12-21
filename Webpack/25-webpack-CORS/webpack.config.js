const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: "./bundle",
        open: true,
        port: 9090,
        /*
        proxy: {
            // 以下配置的含义:
            // 当我们在代码中发送请求到/user的时候, devServer就会自动将我们请求的地址替换为
            // http://127.0.0.1:3000/user
            "/user": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,     // 域名跨域
                secure: false,          // https跨域
            },
            "/login": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,     // 域名跨域
                secure: false,          // https跨域
            },
        }
         */
        proxy: [{
            context: ["/user", "/login"],
            target: "http://127.0.0.1:3000",
            changeOrigin: true,     // 域名跨域
            secure: false,          // https跨域
            pathRewrite:{"": "/api"} // 路径重写, 将路径中的api替换为空
        }]
        /*
        注意点:
        devServer只能解决开发阶段的跨域问题, 并不能解决项目上线之后的跨域问题
        原因非常简单, 因为项目上线之后是将打包好的文件上传到服务器, 而打包好的文件中并没有devServer
        所以项目上线之后要想解决跨域问题还是需要依赖后端开发人员
        * */
    },
    /*
    optimization: 配置webpack的优化项
    * */
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    /*
    配置sourcemap
    development: cheap-module-eval-source-map
    production: cheap-module-source-map
    * */
    devtool: "cheap-module-eval-source-map",
    /*
    mode: 指定打包的模式, 模式有两种
    一种是开发模式(development): 不会对打包的JS代码进行压缩
    还有一种就是上线(生产)模式(production): 会对打包的JS代码进行压缩
    * */
    mode: "production", // "production" | "development"
    /*
    entry: 指定需要打包的文件
    * */
    entry: "./src/js/index.js",
    /*
    output: 指定打包之后的文件输出的路径和输出的文件名称
    * */
    output: {
        /*
        filename: 指定打包之后的JS文件的名称
        * */
        filename: "js/bundle.js",
        /*
        path: 指定打包之后的文件存储到什么地方
        * */
        path: path.resolve(__dirname, "bundle")
    },
    /*
    module: 告诉webpack如何处理webpack不能够识别的文件
    * */
    module: {
        rules: [
            // 打包字体图标规则
            {
                test: /\.(eot|json|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // 指定打包后文件名称
                            name: '[name].[ext]',
                            // 指定打包后文件存放目录
                            outputPath: 'font/',
                        }
                    }
                ]
            },
            // 打包图片规则
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 指定图片限制的大小
                            limit: 1024,
                            // 指定打包后文件名称
                            name: '[name].[ext]',
                            // 指定打包后文件存放目录
                            outputPath: 'images/',
                        }
                    }
                ]
            },
            // 打包CSS规则
            {
                test: /\.css$/,
                use:[
                    {
                        // loader: "style-loader"
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            // modules: true // 开启CSS模块化
                        }
                    },
                    {
                        loader: "postcss-loader"
                    }
                ]
            },
            // 打包LESS规则
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                },{
                    loader: "postcss-loader"
                }]
            },
            // 打包SCSS规则
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                },{
                    loader: "postcss-loader"
                }]
            },
        ]
    },
    /*
    plugins: 告诉webpack需要新增一些什么样的功能
    * */
    plugins: [
        new HtmlWebpackPlugin({
        // 指定打包的模板, 如果不指定会自动生成一个空的
        template: "./src/index.html",
        minify: {
            // 告诉htmlplugin打包之后的html文件需要压缩
            // collapseWhitespace: true,
        }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: "./doc",
            to: "doc"
        }]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
    ]
};