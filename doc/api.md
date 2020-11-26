# HTTP API

<details>
<summary>目录</summary>
<p>

- [HTTP API](#http-api)
  - [`login` 登录微信](#login-登录微信)
    - [参数](#参数)
    - [响应数据](#响应数据)
      - [等待确定](#等待确定)
      - [等待扫码](#等待扫码)
      - [登录成功](#登录成功)
  - [`logout` 退出微信](#logout-退出微信)
    - [参数](#参数-1)
    - [响应数据](#响应数据-1)
  - [`send_private_msg` 发送私聊消息](#send_private_msg-发送私聊消息)
    - [参数](#参数-2)
    - [响应数据](#响应数据-2)
  - [`send_chatroom_msg` 发送群消息](#send_chatroom_msg-发送群消息)
    - [参数](#参数-3)
    - [响应数据](#响应数据-3)
  - [`revoke_message` 撤回消息](#revoke_message-撤回消息)
    - [参数](#参数-4)
    - [响应数据](#响应数据-4)
    - [响应数据](#响应数据-5)
  - [`send_image` 发送图片](#send_image-发送图片)
    - [参数](#参数-5)
    - [响应数据](#响应数据-6)
  - [`send_voice` 发送语音](#send_voice-发送语音)
    - [参数](#参数-6)
    - [响应数据](#响应数据-7)
  - [`send_video` 发送视频](#send_video-发送视频)
    - [参数](#参数-7)
    - [响应数据](#响应数据-8)
  - [`send_file` 发送文件](#send_file-发送文件)
    - [参数](#参数-8)
    - [响应数据](#响应数据-9)
  - [`send_share_link` 分享链接](#send_share_link-分享链接)
    - [参数](#参数-9)
    - [响应数据](#响应数据-10)
  - [`send_share_miniprogram` 分享小程序](#send_share_miniprogram-分享小程序)
    - [参数](#参数-10)
    - [响应数据](#响应数据-11)
  - [`send_contact_card` 分享名片](#send_contact_card-分享名片)
    - [参数](#参数-11)
    - [响应数据](#响应数据-12)
  - [`get_contact_qrcode` 获取我的二维码名片](#get_contact_qrcode-获取我的二维码名片)
    - [参数](#参数-12)
    - [响应数据](#响应数据-13)
  - [`search_contact` 获取微信用户信息](#search_contact-获取微信用户信息)
    - [参数](#参数-13)
    - [响应数据](#响应数据-14)
  - [`add_contact` 发起朋友请求](#add_contact-发起朋友请求)
    - [参数](#参数-14)
    - [响应数据](#响应数据-15)
  - [`delete_contact` 单向删除朋友](#delete_contact-单向删除朋友)
    - [参数](#参数-15)
    - [响应数据](#响应数据-16)
  - [`get_contact` 获取微信用户信息](#get_contact-获取微信用户信息)
    - [参数](#参数-16)
    - [响应数据](#响应数据-17)
  - [`accept_contact` 接收好友请求](#accept_contact-接收好友请求)
    - [参数](#参数-17)
    - [响应数据](#响应数据-18)
  - [`update_nickname` 更新微信昵称](#update_nickname-更新微信昵称)
    - [参数](#参数-18)
    - [响应数据](#响应数据-19)
  - [`update_signature` 更新微信个性签名](#update_signature-更新微信个性签名)
    - [参数](#参数-19)
    - [响应数据](#响应数据-20)
  - [`zombie_test` 查询好友关系](#zombie_test-查询好友关系)
    - [参数](#参数-20)
    - [响应数据](#响应数据-21)
  - [`update_contact_remark` 更新好友备注](#update_contact_remark-更新好友备注)
    - [参数](#参数-21)
    - [响应数据](#响应数据-22)
  - [`create_chatroom` 创建群聊](#create_chatroom-创建群聊)
    - [参数](#参数-22)
    - [响应数据](#响应数据-23)
  - [`get_chatroom_members` 获取群聊成员列表](#get_chatroom_members-获取群聊成员列表)
    - [参数](#参数-23)
    - [响应数据](#响应数据-24)
  - [`get_chatroom_member` 获取群聊指定成员信息](#get_chatroom_member-获取群聊指定成员信息)
    - [参数](#参数-24)
    - [响应数据](#响应数据-25)
  - [`get_chatroom_qrcode` 获取群聊二维码](#get_chatroom_qrcode-获取群聊二维码)
    - [参数](#参数-25)
    - [响应数据](#响应数据-26)
  - [`set_chatroom_announcement` 发布群聊公告](#set_chatroom_announcement-发布群聊公告)
    - [参数](#参数-26)
    - [响应数据](#响应数据-27)
  - [`set_chatroom_name` 设置群聊名称](#set_chatroom_name-设置群聊名称)
    - [参数](#参数-27)
    - [响应数据](#响应数据-28)
  - [`quit_chatroom` 离开群聊](#quit_chatroom-离开群聊)
    - [参数](#参数-28)
    - [响应数据](#响应数据-29)
  - [`add_chatroom_member` 添加好友进入群聊](#add_chatroom_member-添加好友进入群聊)
    - [参数](#参数-29)
    - [响应数据](#响应数据-30)
  - [`invite_chatroom_member` 邀请好友进入群聊](#invite_chatroom_member-邀请好友进入群聊)
    - [参数](#参数-30)
    - [响应数据](#响应数据-31)
  - [`get_labelList` 获取好友标签列表](#get_labellist-获取好友标签列表)
    - [参数](#参数-31)
    - [响应数据](#响应数据-32)
  - [`add_label` 添加好友标签](#add_label-添加好友标签)
    - [参数](#参数-32)
    - [响应数据](#响应数据-33)
  - [`remove_label` 移除好友标签](#remove_label-移除好友标签)
    - [参数](#参数-33)
    - [响应数据](#响应数据-34)
  - [`set_contact_label` 设置通讯录标签](#set_contact_label-设置通讯录标签)
    - [参数](#参数-34)
    - [响应数据](#响应数据-35)
  - [`sns_get_timeline` 获取朋友圈动态列表](#sns_get_timeline-获取朋友圈动态列表)
    - [参数](#参数-35)
    - [响应数据](#响应数据-36)
  - [`sns_get_moment` 朋友圈动态详情](#sns_get_moment-朋友圈动态详情)
    - [参数](#参数-36)
    - [响应数据](#响应数据-37)
  - [`sns_send_text_moment` 发送朋友圈文字动态](#sns_send_text_moment-发送朋友圈文字动态)
    - [参数](#参数-37)
    - [响应数据](#响应数据-38)
  - [`sns_send_image_moment` 发送朋友圈文字动态](#sns_send_image_moment-发送朋友圈文字动态)
    - [参数](#参数-38)
    - [响应数据](#响应数据-39)
  - [`sns_send_url_moment` 发送朋友圈链接动态](#sns_send_url_moment-发送朋友圈链接动态)
    - [参数](#参数-39)
    - [响应数据](#响应数据-40)
  - [`sns_remove_moment` 移除朋友圈动态](#sns_remove_moment-移除朋友圈动态)
    - [参数](#参数-40)
    - [响应数据](#响应数据-41)
  - [`sns_send_comment` 评论朋友圈动态](#sns_send_comment-评论朋友圈动态)
    - [参数](#参数-41)
    - [响应数据](#响应数据-42)
  - [`sns_like_moment` 朋友圈动态点赞](#sns_like_moment-朋友圈动态点赞)
    - [参数](#参数-42)
    - [响应数据](#响应数据-43)
  - [`sns_unlike_moment` 朋友圈动态取消点赞](#sns_unlike_moment-朋友圈动态取消点赞)
    - [参数](#参数-43)
    - [响应数据](#响应数据-44)
  - [`sns_remove_moment_comment` 朋友圈动态删除评论](#sns_remove_moment_comment-朋友圈动态删除评论)
    - [参数](#参数-44)
    - [响应数据](#响应数据-45)
  - [`sns_make_moment_private` 朋友圈动态设为私密](#sns_make_moment_private-朋友圈动态设为私密)
    - [参数](#参数-45)
    - [响应数据](#响应数据-46)
  - [`sns_make_moment_public` 朋友圈动态设为公开](#sns_make_moment_public-朋友圈动态设为公开)
    - [参数](#参数-46)
    - [响应数据](#响应数据-47)
  - [数据结构定义](#数据结构定义)
    - [`messageInfo` 消息Response信息数据结构](#messageinfo-消息response信息数据结构)
    - [`messageRevokeInfo` 消息撤回信息数据结构](#messagerevokeinfo-消息撤回信息数据结构)
    - [`ShareInfo` 链接分享数据结构](#shareinfo-链接分享数据结构)
    - [`qrCodeEvent` 微信登录事件数据结构](#qrcodeevent-微信登录事件数据结构)
    - [`contactInfo` 联系人信息数据结构](#contactinfo-联系人信息数据结构)
    - [`chatroomInfo` 群聊信息数据结构](#chatroominfo-群聊信息数据结构)
    - [`memberList` 群聊用户列表数据结构](#memberlist-群聊用户列表数据结构)
    - [`MomentList` 朋友圈动态列表数据结构](#momentlist-朋友圈动态列表数据结构)
    - [`snsMoment` 朋友圈动态详情数据结构](#snsmoment-朋友圈动态详情数据结构)
    - [`replyComment` 朋友圈动态评论数据结构](#replycomment-朋友圈动态评论数据结构)
    - [`SNSMonentOption` 朋友圈动态设置数据结构](#snsmonentoption-朋友圈动态设置数据结构)
    - [`SNSImageMoment` 朋友圈图片动态数据结构](#snsimagemoment-朋友圈图片动态数据结构)

</p>
</details>

## `login` 登录微信

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |

无

### 响应数据

#### 等待确定
| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `qrCodeEvent` | object[ [qrCodeEvent](#qrcodeevent-微信登录事件数据结构) ]  | 登录事件信息 |


#### 等待扫码
| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `qrCodeEvent` | object[ [qrCodeEvent](#qrcodeevent-微信登录事件数据结构) ]  | 登录事件信息 |

#### 登录成功
| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `contact` | object[ [contactInfo](#contactinfo-联系人信息数据结构) ]  | 个人微信信息 |

## `logout` 退出微信

### 参数

无

### 响应数据

无 

## `send_private_msg` 发送私聊消息

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | number | - | 微信 ID | 
| `message` | string | - | 要发送的内容 |


### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |


## `send_chatroom_msg` 发送群消息

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | number | - | 微信群 ID |
| `message` | string | - | 要发送的内容 |
| `atUserlist` | string[] | - | @的群成员列表数组 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |



## `revoke_message` 撤回消息

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `msgId` | string | - | 消息 ID |
| `revokeInfo` | object[[messageRevokeInfo](#messagerevokeinfo-消息撤回信息)] | - | 用于撤销的相关信息 |

### 响应数据

无

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |



## `send_image` 发送图片

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `file` | string | - | 图片文件的本地路径 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |



## `send_voice` 发送语音

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `file` | string | - | 音频文件的本地路径 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |



## `send_video` 发送视频

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `file` | string | - | 视频文件的本地路径 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |



## `send_file` 发送文件

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `file` | string | - | 文件的本地路径 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |



## `send_share_link` 分享链接

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `shareInfo` | object[ [ShareInfo](#shareinfo-链接分享数据结构) ] | - | 分享链接的相关信息 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |


## `send_share_miniprogram` 分享小程序

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `shareInfo` | object[miniProgramShareInfo] | - | 分享小程序的相关信息 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |


## `send_contact_card` 分享名片

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `id` | string | - | 微信 ID 或微信群 ID |
| `payload` | string | - | 分享名片联系人的微信 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `response` | object[ [messageInfo](#messageinfo-消息response信息数据结构) ]  | 消息信息 |



## `get_contact_qrcode` 获取我的二维码名片

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID |
| `greeting` | string | - | 验证请求 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `qrcode` | string  | 二维码图片base64 |

## `search_contact` 获取微信用户信息

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `contact` | object[ [contactInfo](#shareinfo-链接分享数据结构) ]  | 用户信息 |

## `add_contact` 发起朋友请求

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID |
| `greeting` | string | - | 验证请求 |

### 响应数据

无

## `delete_contact` 单向删除朋友

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID |

### 响应数据

无

## `get_contact` 获取微信用户信息

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `contact` | object[ [contactInfo](#shareinfo-链接分享数据结构) ]  | 用户信息 |


## `accept_contact` 接收好友请求

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `stranger` | string | - | 好友申请 encryptusername |
| `ticket` | string | - | 好友申请 ticket |

### 响应数据

无

## `update_nickname` 更新微信昵称

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `nickname` | string | - | 微信昵称 |

### 响应数据

无

## `update_signature` 更新微信个性签名

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `signature` | string | - | 个性签名 |

### 响应数据

无

## `zombie_test` 查询好友关系

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID / QQ / 手机号 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `status` | number | 好友状态[0：陌生人 1：通讯录好友 2：单向被删除好友【僵尸好友】] |

## `update_contact_remark` 更新好友备注

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID |
| `remark` | string | - | 备注 |

### 响应数据

无

## `create_chatroom` 创建群聊

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userNameList` | string[] | - | 微信 ID 数组 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `chatroom` | object[ [contactInfo](#chatroominfo-联系人信息数据结构) ] | 群聊信息 |

## `get_chatroom_members` 获取群聊成员列表

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `memberList` | object[[memberList](#memberlist-群聊用户列表数据结构)] | 群聊成员列表 |

## `get_chatroom_member` 获取群聊指定成员信息

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |
| `userName` | string | - | 微信 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `contact` | object[ [contactInfo](#shareinfo-链接分享数据结构) ] | 用户信息 |

## `get_chatroom_qrcode` 获取群聊二维码

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `qrcode` | string | 二维码图片base64 |

## `set_chatroom_announcement` 发布群聊公告

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |
| `announcement` | string | - | 群聊公告 |

### 响应数据

无

## `set_chatroom_name` 设置群聊名称

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |
| `roomName` | string | - | 群聊名称 |

### 响应数据

无

## `quit_chatroom` 离开群聊

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |

### 响应数据

无

## `add_chatroom_member` 添加好友进入群聊

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |
| `userName` | string | - | 微信 ID |

### 响应数据

无

## `invite_chatroom_member` 邀请好友进入群聊

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `roomId` | string | - | 微信群 ID |
| `userName` | string | - | 微信 ID |

### 响应数据

无

## `get_labelList` 获取好友标签列表

### 参数

无

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `labelList` | string[labelInfo] | 标签列表信息 |

## `add_label` 添加好友标签

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `label` | string | - | 标签名称 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `labelId` | number | 标签 ID |

## `remove_label` 移除好友标签

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `labelId` | string | - | 标签 ID |

### 响应数据

无

## `set_contact_label` 设置通讯录标签

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `userName` | string | - | 微信 ID |
| `labelList` | string[] | - | 标签 ID 数组|

### 响应数据

无

## `sns_get_timeline` 获取朋友圈动态列表

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `maxId` | string | - | 微信 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `momentList` | object[[MomentList](#momentlist-朋友圈动态列表数据结构)] | 朋友圈动态列表 |

## `sns_get_moment` 朋友圈动态详情

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `momentId` | string | - | 朋友圈动态 ID |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `snsMoment` | object[[snsMoment](#snsmoment-朋友圈动态详情数据结构)] | 朋友圈动态详情 |

## `sns_send_text_moment` 发送朋友圈文字动态

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `content` | string  | - | 朋友圈动态文字内容 |
| `options` | object[[SNSMonentOption](#snsmonentoption-朋友圈动态设置数据结构)]  | - | 朋友圈动态设置 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `snsMoment` | object[[snsMoment](#snsmoment-朋友圈动态详情数据结构)] | 朋友圈动态详情 |

## `sns_send_image_moment` 发送朋友圈文字动态

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `content` | object[[SNSImageMoment](#snsimagemoment-朋友圈图片动态数据结构)]  | - | 朋友圈动态图片内容 |
| `options` | object[[SNSMonentOption](#snsmonentoption-朋友圈动态设置数据结构)]  | - | 朋友圈动态设置 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `snsMoment` | object[[snsMoment](#snsmoment-朋友圈动态详情数据结构)] | 朋友圈动态详情 |

## `sns_send_url_moment` 发送朋友圈链接动态

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `content` | object[ [ShareInfo](#shareinfo-链接分享数据结构) ]  | - | 朋友圈动态链接内容 |
| `options` | object[[SNSMonentOption](#snsmonentoption-朋友圈动态设置数据结构)]  | - | 朋友圈动态设置 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `snsMoment` | object[[snsMoment](#snsmoment-朋友圈动态详情数据结构)] | 朋友圈动态详情 |

## `sns_remove_moment` 移除朋友圈动态

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `content` | object[ [ShareInfo](#shareinfo-链接分享数据结构) ]  | - | 朋友圈动态链接内容 |
| `options` | object[[SNSMonentOption](#snsmonentoption-朋友圈动态设置数据结构)]  | - | 朋友圈动态设置 |

### 响应数据

无

## `sns_send_comment` 评论朋友圈动态

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `momentId` | string  | - | 朋友圈动态 ID |
| `momentOwnerUserName` | string  | - | 朋友圈动态所有者 |
| `commentText` | string  | - | 评论文本 |
| `replyTo` | object[[replyComment](#replycomment-朋友圈动态详情数据结构)]  | - | 回复动态评论 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `snsMoment` | object[[snsMoment](#snsmoment-朋友圈动态详情数据结构)] | 朋友圈动态详情 |


## `sns_like_moment` 朋友圈动态点赞

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `momentId` | string  | - | 朋友圈动态 ID |
| `momentOwnerUserName` | string  | - | 朋友圈动态所有者 |

### 响应数据

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `snsMoment` | object[[snsMoment](#snsmoment-朋友圈动态详情数据结构)] | 朋友圈动态详情 |


## `sns_unlike_moment` 朋友圈动态取消点赞

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `momentId` | string  | - | 朋友圈动态 ID |

### 响应数据

无

## `sns_remove_moment_comment` 朋友圈动态删除评论

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `momentId` | string  | - | 朋友圈动态 ID |
| `commentId` | string  | - | 朋友圈动态评论 ID |

### 响应数据

无

## `sns_make_moment_private` 朋友圈动态设为私密

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `momentId` | string  | - | 朋友圈动态 ID |

### 响应数据

无

## `sns_make_moment_public` 朋友圈动态设为公开

### 参数

| 字段名 | 数据类型 | 默认值 | 说明 |
| ----- | ------- | ----- | --- |
| `momentId` | string  | - | 朋友圈动态 ID |

### 响应数据

无


## 数据结构定义

### `messageInfo` 消息Response信息数据结构

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `msgid` | number  | 消息 ID |
| `messagerevokeinfo` | object[ [messageRevokeInfo](#messagerevokeinfo-消息撤回信息) ]  | 用于撤销的相关信息 |

### `messageRevokeInfo` 消息撤回信息数据结构

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `clientMsgId` | string  | 客户端消息 ID |
| `newClientMsgId` | string  | 新的客户端消息 ID |
| `createTime` | number  | 创建时间 |

### `ShareInfo` 链接分享数据结构

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `title` | string  | 标题 |
| `url` | string  | 链接 |
| `desc` | string  | 简介 |
| `thumburl` | string  | 本地缩略图片路径 |


### `qrCodeEvent` 微信登录事件数据结构

//todo

### `contactInfo` 联系人信息数据结构

//todo

### `chatroomInfo` 群聊信息数据结构

//todo

### `memberList` 群聊用户列表数据结构

//todo

### `MomentList` 朋友圈动态列表数据结构

//todo

### `snsMoment` 朋友圈动态详情数据结构

//todo

### `replyComment` 朋友圈动态评论数据结构

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `replyCommentId` | string  | 朋友圈动态评论 ID |
| `replyCommentNickName` | string  | 朋友圈动态评论用户昵称 |
| `replyCommentUsername` | string  | 朋友圈动态评论用户 ID |

### `SNSMonentOption` 朋友圈动态设置数据结构

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `isPrivate` | boolean  | 朋友圈动态是否私密 |
| `cannotseeusernameList` | string[]  | 朋友圈动态不可见好友列表 |
| `canseeusernameList` | string[]  | 朋友圈动态可见好友列表 ID |
| `atusernameList` | string[]  | 朋友圈动态提醒好友列表 |

### `SNSImageMoment` 朋友圈图片动态数据结构

| 字段名 | 数据类型 | 说明 |
| ----- | ------- | --- |
| `imageFilePathList` | string[]   | 图片本地路径 |
| `description` | string | 简介 |



<hr>