# 

## 内容目录

- **API**
  - [HTTP API](api.md)
- **消息**
  - [消息概述](message.md)



## 接口请求示例
CURL
```
curl --location --request POST 'http://127.0.0.1:5030/api/get_contact' \
--header 'Content-Type: application/json' \
--data-raw '{"userName":"wxid_k2e13zvb44521"}'
```

fetch[WEB]
```
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"userName":"wxid_k2e13zvb44521"});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://127.0.0.1:5030/api/get_contact", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```
## 接口响应示例
```
{
    "result": {
        "contact": {
            "wrappers_": {
                "102": []
            },
            "arrayIndexOffset_": -1,
            "array": [
                "wxid_k2e13zvb44521",
                "ko~",
                "https://wx.qlogo.cn/mmhead/ver_1/L57OS4sa5jZHf7iaO0lbc0uDv4H4osqmzZeA5LnNZVkTibmRZUSNgQ61KRIOT2kevOg3zuALkonqFvuAbvkwoichZXTnkR4gheTrc06Xxl0WiaM/0",
                2,
                ....
                []
            ],
            "pivot_": 1.7976931348623157e+308,
            "convertedPrimitiveFields_": {}
        }
    },
    "success": true
}
```
