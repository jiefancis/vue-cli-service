# 深入了解vue-cli-service

## vue-cli-service是什么？
vue-cli-service是一个提供项目启动、打包等命令的cli服务；其内部封装了vue项目所需的基本的webpack配置。用户在项目根目录下新建.env文件拓展项目的process.env环境变量，可以根据项目自定义webpack配置。

## vue-cli-service解决了什么问题？
在之前vue-cli低版本vue-cli没有使用vue-cli-service的项目中，开发者需要在**build**和**config**文件夹去定义项目的配置，新开一个项目就需要重新配置一遍，无法做到复用；如果对webpack配置不了解，那么需要花额外的时间去查资料，增加了时间成本。因此有部分开发通过新建一个空项目模板推送到公司内部git仓库中，新项目的开发只要拉取这个项目模板到本地install即可进行开发打包。   

react-scripts内部定义了webpack配置，同时允许用户通过.env(.mode)来定义项目环境变量，但缺点是不支持项目的自定义配置，用户只能按照react-scripts内部定义的webpack配置来开发，使得项目的开发和构建部署受限。   

vue-cli-service内部使用**webpack-chain**封装了默认的webpack配置，允许用户通过vue.config.(c)js文件自定义配置，这些配置优先级优于cli-service内部的默认配置，vue-cli-service实现为一个可执行程序


## 可执行程序
有vue开发经验的人在启动项目时，几乎都遇见过这些类型的异常：'vue-cli-service 不是可执行程序' 'xxx not found the module'等。在node_modules中的依赖包有：可执行程序和模块两种类型，npm install xxx如果下载的是一个可执行程序，npm会在包下载完成后，在node_modules/.bin目录中注册一个脚本文件，这个文件有三种格式：vue-cli-service、vue-cli-service.cmd、vue-cli-service.ps1，分别代表项目运行在unix环境、cmd命令行终端、powershell终端。文件中有node指令：node xxx-cli.js args，所以npm run serve接收到 vue-cli-service serve 的指令，会去node_modules/.bin目录下找到对应的vue-cli-service脚本执行脚本内部的脚本：node vue-cli-service.js


## 问题总结
1. node包中有依赖包，如何让
## vue-cli-service的实现 

### 功能点
1. webpack与webpack-dev-server的node api实现项目启动和打包
2. webpack-chain生成配置，优先给以用户自定义配置为主，没有的配置取默认配置
3. dotenv与dotenv-expand实现env环境变量定义与拓展

### 源码实现
- bin/vue-cli-service.js创建service实例  
```
const Service = require('../lib/Service')
const service = new Service(process.cwd())
service.run(command)
```
- lib/Service.js  
```

```