/**
 * 操作service
 */
class PluginApi{
    constructor(service) {
        this.service = service
    }
    registerCommand(name, fn) {
        this.service[name] = fn
    }
    chainWebpack(fn) {
        this.service.webpackChainFns.push(fn)
    }
    resolveWebpackConfig() {
        return this.service.resolveWebpackConfig()
    }
    resolve(path) {
        return this.service.resolve(path)
    }
}
module.exports = PluginApi