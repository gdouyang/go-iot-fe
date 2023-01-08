### OnConnect函数
- context参数说明与OnMessage一致

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

### Session对象

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Disconnect | 断开连接 | - | - |
| Publish | 发送文本数据 | (data: string) | - |
| PublishHex | 将16进制文本数据转换成byte发送 | (data: string) | - |

### 样例
```
function OnConnect(context) {
  console.log("OnConnect: " + context.GetClientId())
	context.DeviceOnline(context.GetClientId())
}
function OnMessage(context) {
  console.log("OnMessage: " + context.MsgToString())
  var data = JSON.parse(context.MsgToString())
	if (data.name == 'f') {
		context.ReplyOk()
		return
	}
  context.SaveProperties(data)
}
function OnInvoke(context) {
	console.log("OnInvoke: " + JSON.stringify(context.GetMessage().Data))
	context.GetSession().Publish("test", JSON.stringify(context.GetMessage().Data))
}
```