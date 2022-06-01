/**
 * 通过api向service.chainWebpackFns推入默认配置，提供在new Service初始化过程中生成webpack配置
 * webpackConfig是 webpack-chain的实例
 */
module.exports = (api, webpackConfig) => {
    api.chainWebpack(() => {
        webpackConfig
                    .entry('app')
                    .add('./src/main.js')
                    .end()
    })
}