const dotexpand = require('dotenv-expand')
const dotenv = require('dotenv')
const defaultsDeep = Object.assign

const path = require('path')
const PluginApi = require('./PluginApi.js')
// 链式api创建/修改wepback配置，跨项目共享
const Config = require('webpack-chain')
// webpack默认配置
const { defaults } = require('./options.js')
class Service {
    constructor(context) {
        this.context = context
        // 指令集
        this.commands = {}
        // webpack配置
        this.config = {}

        // vue.config.js中用户自定义的chain链式api
        this.webpackChainFns = []
        // vue.config.js中用户自定义的configureWebpack
        this.webpackConfigureWebpackFns = []
    }
    /**
     * 1. 加载用户自定义webpack配置
     * 2. 自定义wepback配置与vue-cli-service默认配置合并，重复的属性以用户配置优先
     * 3. 加载对应环境的脚本，实现脚本指令的注册
     */
    init(command) {
        const userOptions = this.loaderUserOptions()
        this.config = defaultsDeep(userOptions, defaults())

        this.resolvePlugins()
        this.webpackChainFns(this.config.chainWebpack)
        this.webpackConfigureWebpackFns(this.config.configureWebpack)

        // 加载对应的指令脚本
        const apply = require(`../scripts/${command}`)
        // 当前service实例传入api，通过api向service注册指令，并将api传入指令脚本完成指令注册
        apply(new PluginApi(this), this.config)        
    }

    /**
     * 1. 加载.env环境变量
     * 2. 注册指令
     * 3. 根据注册指令获取指令对应的回调（serve -> webpack-dev-server启动项目）
     */
    run(name, mode) {
        this.loadEnv(mode)
        this.init(name)
        let fn = this.commands[name]
        try{
            fn()
        } catch(err) {
            console.log(err)
        }
    }
    /**
     * 1. dotenv.config({path: envpath})读取env文件并将参数添加到process.env中
     * 2. dotenv-expand？拓展env
     * 3. 文件命名规范：.env.dev .env.local .env。可根据用户指定的mode模式来实现自定义支持
     */
    loadEnv(mode) {
        let basePath = path.resolve(this.context, `.env${mode ? `.${mode}` : ''}`)
        let localPath = `${basePath}.local`

        const load = (path) => {
            try{
                const env = dotenv.config({path})
                dotenvExpand(env)
            } catch(e) {
                console.error(e)
            }
        }
        // 加载顺序决定了local的被其它模式覆盖
        load(localPath)
        load(basePath)

    }

    /**
     * 1. 加载用户的配置
     * 这里只考虑vue.config.js文件的情况
     */
    loaderUserOptions() {
        let optionFile = './vue.config.js';
        let path = path.resolve(this.context, optionFile)
        const userOptions = require(path)
        return userOptions
    }

    /**
     * webpack-chain链式api传递给用户，用户通过chainWebpack: (config) => {}的方式配置
     */
    resolveChainWebpackConfig() {
        const config = new Config()
        this.webpackChainFns.forEach(fn => fn(config))
        return config
    }

    /**
     * chainWebpack与configureWebpack合并
     * 获取webpack配置
     */
     resolveWebpackConfig(config = this.resolveChainWebpackConfig()) {
        const webpackconfig = config.toConfig()

        this.webpackConfigureWebpackFns.forEach(fn => {
            if(typeof fn === 'function') {
                let res = fn(webpackconfig)
                if(res) merge(webpackconfig, res)
            } else {
                webpackconfig = merge(webpackconfig, fn)
            }
        })
        return webpackconfig
     }

     /**
      * 加载默认配置
      */
     resolvePlugins() {
        const files = [
            '../config/base',
            // '../config/app', // 用户配置覆盖默认配置
        ]

        const plugins = files.map(path => require(path))
        this.webpackChainFns.push(plugins)
     }

     /**
      * 获取文件的绝对路径
      */
    resolve(path) {
        return path.resolve(this.context, path)
    }
}

module.exports = Service