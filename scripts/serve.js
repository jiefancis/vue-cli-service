const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack.config.dev.js')
module.exports = (api) => {
    api.registerCommand('serve', function() {
        const compiler = Webpack(webpackConfig)

        const devOptions = {...webpackConfig.devServer, open: true}
        const server = WebpackDevServer(compiler, devOptions)
        server.startCallback(() => {
            console.log('启动')
        })
    })
}