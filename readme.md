# 前言
vue-cli-service现在几乎是每个vue项目内置的cli服务插件，对webpack进行了高度的封装让用户能够专注于业务开发，但是随着我们对技术认知的增长及在向高级前端进阶时，都要求我们对webpack有更加深入的了解，同时阅读优秀的开源代码也能促进我们的技术能力。本篇文章的代码已提交github，地址

1. **vue-cli-service是什么？**

vue-cli-service是一个提供项目启动、打包等命令的cli服务；其内部封装了vue项目开发和打包所需的基本的webpack配置。用户可以通过.env和vue.config.js文件实现拓展项目的环境变量和webpack配置。

2. **vue-cli-service解决了什么问题？**

vue-cli-service出现之前，开发者需要在build和config文件夹定义vue项目的配置，新开一个项目就需要重新配置一遍，无法做到复用；如果对webpack配置不了解，那么需要花额外的时间去查资料，增加了时间成本。因此有的公司则是会通过新建一个空项目模板推送到公司内部git仓库中，新项目的开发只要拉取这个项目模板到本地install即可进行开发打包。vue-cli-service则是通过插件封装webpack配置的方式实现服务复用，同时也允许用户通过vue.config.js文件自定义项目的配置。

3. **react-scripts的缺点**

react-scripts内部定义了webpack配置，同时允许用户通过.env(.mode)来定义项目环境变量，但缺点是不支持项目的自定义配置，用户只能按照react-scripts内部定义的webpack配置来开发，使得项目的开发和构建部署的灵活性受限。

4. **需要了解的知识点**

- 可执行程序与模块
有vue开发经验的人在启动项目时，几乎都遇见过这些类型的异常：'vue-cli-service 不是可执行程序' 'xxx not found the module'等。在node_modules中的依赖包有：可执行程序和模块两种类型，vue-cli-service是一个可执行程序。


- 软链接
npm install xxx如果下载的是一个可执行程序，npm会在包下载完成后，在node_modules/.bin目录中生成这个可执行程序的软链接文件，这个文件有三种格式：
vue-cli-service（项目在unix环境运行）
vue-cli-service.cmd（项目在cmd命令行终端运行）
vue-cli-service.ps1（项目在powershell终端运行）
文件中有node指令：node xxx-cli.js args，所以当执行npm run serve脚本时npm实际执行的脚本是vue-cli-service serve指令，npm会去node_modules/.bin目录下找到对应的vue-cli-service脚本执行脚本内部的脚本：node vue-cli-service.js。这一点可以通过在项目中执行 console.log(process.argv)查看命令行参数验证，例子中打印的结果如下图：



# vue-cli-service的实现
**核心思想**

webpack与webpack-dev-server的node api实现项目启动和打包
webpack-chain生成配置，优先给以用户自定义配置为主，没有的配置取默认配置
dotenv与dotenv-expand实现env环境变量定义与拓展

**源码实现**

1. bin/vue-cli-service.js创建service实例执行对应的脚本执行

2. lib/Service.js与lib/PluginApi.js

service服务类，注册服务指令与后期运行。PluginApi通过api的方式向service中注册对应的指令和webpackChain处理函数。

dotenv与dotenv-expand拓展process.env环境变量。


3. config/*

通过webpack-chain链式api生成webpack的默认配置，具体的细节可以查看webpack-chain的官方文档。
