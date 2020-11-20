# PADLOCAL-HTTP
[![NPM Version](https://badge.fury.io/js/padlocal-http.svg)](https://www.npmjs.com/package/padlocal-http)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
![Stage](https://img.shields.io/badge/Stage-beta-yellow)

## 关于项目

参考QQ机器人 [OneBot](https://github.com/howmanybots/onebot) 实现标准，为wechat机器人 [padloacl](https://github.com/padlocal/padlocal-client-ts) 提供通过 HTTP 或 WebSocket 接收事件和调用 API 的能力

## 如何使用

- 安装模块
```
npm install padlocl-http
```
  
- 开箱即用
```
import PadLocalHTTP from "padlocal-http"

const padLocalOptions = {
    "serverHost": "serverHost", // padlocal服务器地址
    "serverPort": "serverPort", // padlocal服务器端口
    "token": "你的token",//token需要申请
    "serverCAFilePath": "./config/ca.pem" // padlocal服务器证书文件
};

const serverOptions = {
    "port": "5030", // http服务请求端口
    "postUrl": "http://127.0.0.1:5031" // 事件回调端口
}

PadLocalHTTP.install(padLocalOptions, serverOptions);

```

## 接口文档
[接口文档](./doc/index.md)

## 申请Padlocal token

 Padlocal is in **beta testing** stage, granting tokens to limited partners. If you want to apply, please [contact admin](mailto:oxddoxdd@gmail.com) for further information.

## TODO[FLAG]

- [ ] 增加websocket协议
- [ ] 多账号管理
  