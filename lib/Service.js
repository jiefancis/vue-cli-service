class Service {
    constructor(context) {
        this.context = context
        // 指令集
        this.commands = {}
        
    }
    init(command) {
        const apply = require(`../scripts/${command}`)
        apply(new PluginApi(this))        
    }
    run(name) {
        this.init(name)
        let fn = this.commands[name]
        try{
            fn()
        } catch(err) {
            console.log(err)
        }
    }
    loaderUserOptions() {
        const userOptions = require(`${this.context}/vue.config.js`)
        
    }
}

export default Service