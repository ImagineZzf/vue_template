# vue前端基础框架

## 项目包含配置
- 基于vue-cli3搭建基础框架
- 增加scss编译、以及全局scss主题颜色变量
- 增加 vuex状态管理
- axios全局封装
- cdn加载，打包优化（去除console/开启gzip压缩）
- 增加middlewares中间件
- element-ui按需加载
- 增加mixins混入
- api接口抽离，便于统一管理

## Project setup
```
# 本地运行
npm install
npm run serve

# 测试打包
npm install
npm run build:test

# 正式打包
npm install
npm run build:prod
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
