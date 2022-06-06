const Webpack = require('webpack')

// 注册build指令
module.exports = (api, options) => {
    api.registerCommand('build', function() {
        const webpackConfig = api.resolveWebpackConfig()
        console.log('webpackConfig', webpackConfig)
        webpackConfig.mode = "production"
        const compiler = Webpack(webpackConfig)

        compiler.run((err, stats) => {
            console.log('打包完成', stats.toString())
        })
    })
}