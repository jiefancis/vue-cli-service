const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

// 注册serve指令，run运行时执行webpack-dev-server启动本地服务
module.exports = (api, options) => {
    api.registerCommand('serve', function() {
        const webpackConfig = api.resolveWebpackConfig()
        const compiler = Webpack(webpackConfig)

        const devOptions = {...webpackConfig.devServer, open: true }
        const server = WebpackDevServer(compiler, devOptions)
        server.startCallback(() => {
            console.log('启动')
        })
    })
}