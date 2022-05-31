const dotexpand = require('dotenv-expand')
const dotenv = require('dotenv')
class Service {
    constructor(context) {
        this.context = context
        // 指令集
        this.commands = {}
        // webpack配置
        this.config = {}
    }
    init(command) {
        // 加载对应的指令脚本
        const apply = require(`../scripts/${command}`)
        // 当前service实例传入api，通过api向service注册指令，并将api传入指令脚本完成指令注册
        apply(new PluginApi(this), this.config)        
    }
    // 注册指令
    // 根据注册指令获取指令对应的回调（serve -> webpack-dev-server启动项目）
    run(name) {
        this.init(name)
        let fn = this.commands[name]
        try{
            fn()
        } catch(err) {
            console.log(err)
        }
    }
    // dotenv-expand？拓展env
    // dotenv.config({path: envpath})读取env文件并将参数添加到process.env中
    // 文件命名规范：.env.dev .env.local .env
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
    // 加载用户的配置
    loaderUserOptions() {
        const userOptions = require(`${this.context}/vue.config.js`)

    }
}

export default Service