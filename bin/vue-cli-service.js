#!/usr/bin/env node
const Service = require('../lib/Service.js')

// 初始化service实例，参数为当前node命令执行时所在的文件夹目录
// process.cwd()便于读取用户本地的环境变量文件和vue.config.js配置
const service = new Service(process.cwd())

console.log('执行到了这里123456', process.argv)
const argv = process.argv;
const name = argv[2]
// 传入运行指令 serve / build进行启动 / 打包
service.run(name)