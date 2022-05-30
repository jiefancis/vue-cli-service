class PluginApi{
    constructor(service) {
        this.service = service
    }
    registerCommand(name, fn) {
        this.service[name] = fn
    }
}

export default PluginApi