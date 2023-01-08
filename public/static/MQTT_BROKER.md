### OnConnect函数
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetConfig | 获取设备配置项 | (key: string) | string |
| GetClientId | 获取mqtt clientId | - | string |
| GetUserName | 获取mqtt 用户名 | - | 用户名 |
| GetPassword | 获取mqtt 密码 | - | 密码 |
| DeviceOnline | 将设备上线 | 设备id | - |
| AuthFail | 认证失败 | - | - |

```
// 系统默认会根据用户名和密码来认证，如果不满足可写OnConnect来自行判断
// 当mqtt客户端连接到Broker时可以在这里判断用户名和密码是否正确
function OnConnect(context) {
  if (context.GetUserName() == context.GetConfig("username") && context.GetPassword() == context.GetConfig("password")) {
    // 认证成功让设备上线，一般clientId就是设备id
	  context.DeviceOnline(context.GetClientId())
    return
  }
  // 认证失败
  context.AuthFail()
}
```
### OnMessage函数
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetMessage | 获取消息原始数据 | - | byte数组 |
| MsgToString | 将原始数据转换成字符串 | - | 文本 |
| MsgToHexStr | 将原始数据转换成16进制字符串 | - | 16进制字符串 |
| DeviceOnline | 将设备上线 | 设备id | - |
| GetSession | 获取Session | - | Session |
| GetDevice | 获取设备 | - | Device |
| GetDeviceById | 通过设备id获取设备 | - | Device |
| GetConfig | 获取设备配置项 | (key: string) | string |
| SaveProperties | 保存属性 | (data: object) | - |
| SaveEvents | 保存事件 | (eventId: string, data: object) | - |
| ReplyOk | 服务下发执行成功 | - | - |
| ReplyFail | 服务下发执行失败 | (str: string) | - |
| Topic | 获取消息Topic | - | string |

```
// 当客户端向Broker推送数据时，执行OnMessage函数
function OnMessage(context) {
  console.log("OnMessage: " + context.MsgToString())
  var data = JSON.parse(context.MsgToString())
	if (data.name == 'reply') {
		context.ReplyOk()
		return
	}
  var topic = context.Topic()
  if (topic == '/prop') {
    context.SaveProperties(data)
  } else if (topic == '/event') {
    context.SaveEvents(data.eventId, data)
  }
}
```

### OnInvoke函数
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetMessage | 获取下发消息 | - | FuncInvoke |
| DeviceOnline | 将设备上线 | (deviceId: string) | - |
| GetSession | 获取Session | - | Session |
| GetDevice | 获取设备 | - | Device |
| GetDeviceById | 通过设备id获取设备 | (deviceId: string) | Device |
| GetConfig | 获取设备配置项 | (key: string) | string |
| SaveProperties | 保存属性 | (data: object) | - |
| SaveEvents | 保存事件 | (eventId: string, data: object) | - |
| ReplyOk | 服务下发执行成功 | - | - |
| ReplyFail | 服务下发执行失败 | (str: string) | - |

- FuncInvoke

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Data | 下发数据 | - | object |

```
function OnInvoke(context) {
  var data = JSON.stringify(context.GetMessage().Data)
	console.log("OnInvoke: " + data)
  var session = context.GetSession()
  // 向客户端发送文本信息
	session.Publish("/invoke", data)
}
```

### Session对象

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Disconnect | 断开连接 | - | - |
| Publish | 发送文本数据 | (data: string) | - |
| PublishHex | 将16进制文本数据转换成byte发送 | (data: string) | - |

### 样例
```
function OnMessage(context) {
  console.log("OnMessage: " + context.MsgToString())
  var data = JSON.parse(context.MsgToString())
	if (data.name == 'reply') {
		context.ReplyOk()
		return
	}
  var topic = context.Topic()
  if (topic == '/prop') {
    context.SaveProperties(data)
  } else if (topic == '/event') {
    context.SaveEvents(data.eventId, data)
  }
}
function OnInvoke(context) {
  var data = JSON.stringify(context.GetMessage().Data)
	console.log("OnInvoke: " + data)
  var session = context.GetSession()
  // 向Broker发送文本信息
	session.Publish("/invoke", data)
}
```