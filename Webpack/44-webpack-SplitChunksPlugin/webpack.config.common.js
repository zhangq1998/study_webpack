const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    /*
    告诉webpack需要对代码进行分割
    * */
    optimization: {
        splitChunks: {
            chunks: 'all', // 对那些代码进行分割 async(只分割异步加载模块)、all(所有导入模块)
            minSize: 30, // 表示被分割的代码体积至少有多大才分割(单位是字节)
            minChunks: 1, // 表示至少被引用多少次数才分割，默认为1
            maxAsyncRequests: 5, // 异步加载并发最大请求数(保持默认即可)
            maxInitialRequests: 3, // 最大的初始请求数(保持默认即可)
            automaticNameDelimiter: '+', // 指定被分割出来的文件名称的连接符
            name: true, // 拆分出来块的名字使用0/1/2... 还是指定名称
            /*
            cacheGroups: 缓存组
            缓存组的作用: 将当前文件中导入的所有模块都缓存起来统一处理
            * */
            cacheGroups: {
                /*
                vendors: 专门用于处理从node_modules中导入的模块
                         会将所有从node_modules中导入的模块写入到一个文件中去
                * */
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10 // 抽取公共代码的优先级，数字越大，优先级越高
                },
                /*
                default: 专门用于处理从任意位置导入的模块
                         会将所有从任意位置导入的模块写入到一个文件中去
                * */
                /*
                注意点: 如果我们导入的模块同时满足了两个条件, 那么就会按照优先级来写入
                例如: 我们导入了jQuery, jQuery存放在了node_modules目录中
                所以满足vendors的条件, 也满足default条件, 但是vendors的条件的优先级高于default的优先级
                所以就只会执行vendors规则, 只会写入到vendors对应的文件中去
                * */
                default: {
                    minChunks: 1, // 表示至少被引用多少次数才分割，默认为1
                    priority: -20,
                    reuseExistingChunk: true // 是否复用分割的代码
                }
            }
        }
    },
    /*
    entry: 指定需要打包的文件
    * */
    entry: {
        main: './src/js/index.js',
        // b: './src/js/b.js'
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
        rules: [
            // 检查编码规范的规则
            {
                // enforce: "pre"作用: 让当前的loader再其它loader之前执行
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'index.js'),
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
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
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: './doc',
            to: 'doc'
        }]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css'
        })
    ]
};
