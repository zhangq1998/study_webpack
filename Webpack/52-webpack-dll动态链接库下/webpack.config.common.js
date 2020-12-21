const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const fs = require('fs');

const plugins = [
    new HtmlWebpackPlugin({
        // 指定打包的模板, 如果不指定会自动生成一个空的
        template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
        from: './doc',
        to: 'doc'
    }]),
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
    }),
    /*
    以下代码的含义:
    在打包moment这个库的时候, 将整个locale目录都忽略掉
    * */
    new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];
/*
new AddAssetHtmlPlugin({
    filepath: path.resolve(__dirname, 'dll/jquery.dll.js')
}),
new Webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, 'dll/jquery.manifest.json')
}),
* */
const dllPath = path.resolve(__dirname, 'dll');
const files = fs.readdirSync(dllPath);
files.forEach(function (file) {
   if(file.endsWith(".js")){
       plugins.push(new AddAssetHtmlPlugin({
           filepath: path.resolve(__dirname, 'dll', file)
       }));
   }else if(file.endsWith(".json")){
       plugins.push(new Webpack.DllReferencePlugin({
           manifest: path.resolve(__dirname, 'dll', file)
       }));
   }
});

module.exports = {
    /*
    resolve: 告诉webpack如何解析导入的模块
    * */
    resolve: {
        // alias: {
        //     // 创建 import 或 require 的别名，来确保模块引入变得更简单
        //     bootstrapcss: 'bootstrap/dist/css/bootstrap.css'
        // }
        // 指定模块入口的查找顺序
        // mainFields: ['style', 'main']

        // 指定导入模块查找顺序
        // extensions: ['.css', '.js', '.joson']
    },
    /*
    告诉webpack需要对代码进行分割
    * */
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    /*
    entry: 指定需要打包的文件
    * */
    entry: {
        main: './src/js/index.js'
    },
    /*
    output: 指定打包之后的文件输出的路径和输出的文件名称
    * */
    output: {
        /*
        filename: 指定打包之后的JS文件的名称
        * */
        filename: 'js/[name].[contenthash:8].js',
        /*
        path: 指定打包之后的文件存储到什么地方
        * */
        path: path.resolve(__dirname, 'bundle')
    },
    /*
    module: 告诉webpack如何处理webpack不能够识别的文件
    * */
    module: {
        noParse: /jquery/,
        rules: [
            // 打包JS规则
            {
                test: /\.js$/,
                exclude: /node_modules/, // 告诉webpack不处理哪一个文件夹
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', {
                        targets: {
                            // "chrome": "58",
                        }
                        // useBuiltIns: "usage"
                    }]],
                    plugins: [
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                absoluteRuntime: false,
                                corejs: 2,
                                helpers: true,
                                regenerator: true,
                                useESModules: false
                            }
                        ]
                    ]
                }
            },
            // 打包字体图标规则
            {
                test: /\.(eot|json|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // 指定打包后文件名称
                            name: '[name].[contenthash:8].[ext]',
                            // 指定打包后文件存放目录
                            outputPath: 'font/'
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
                            name: '[name].[contenthash:8].[ext]',
                            // 指定打包后文件存放目录
                            outputPath: 'images/',
                            publicPath: 'http://127.0.0.1:9090/images'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },
            // 打包CSS规则
            {
                test: /\.css$/,
                use: [
                    {
                        // loader: "style-loader"
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // modules: true // 开启CSS模块化
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            // 打包LESS规则
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }, {
                    loader: 'postcss-loader'
                }]
            },
            // 打包SCSS规则
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }, {
                    loader: 'postcss-loader'
                }]
            }
        ]
    },
    /*
    plugins: 告诉webpack需要新增一些什么样的功能
    * */
    plugins: plugins
};
