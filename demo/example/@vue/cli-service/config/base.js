/**
 * 通过api向service.chainWebpackFns推入默认配置，提供在new Service初始化过程中生成webpack配置
 * webpackConfig是 webpack-chain的实例
 */
 const HtmlWbpackPlugin = require('html-webpack-plugin')

 module.exports = (api, options) => {
     api.chainWebpack((webpackConfig) => {
         webpackConfig
                 .mode('development')
                 .context(api.service.context)
                 .entry('app')
                     .add('./src/main.js')
                     .end()
                 .output
                     .path(api.service.context, options.outputDir)
                     .filename('[name].[contenthash:8].js')

         webpackConfig.resolve
             .extensions
                 .merge(['.js', '.jsx', '.vue', '.json', '.wasm'])
                 .end()
         /**
          * new HtmlWebpackPlugin({
          *  template: '模板所在目录',
          *  filename: '输出文件名',
          *  inject: true 是否将js注入scripts 
          * })
          */
         const htmlOptions = {
             template: api.resolve('public/index.html'),
             filename: 'index.html',
             inject: true
         }
         webpackConfig
                 .plugin('html-webpack-plugin')
                     .use(HtmlWbpackPlugin, [htmlOptions])
                     
 
     })
 }