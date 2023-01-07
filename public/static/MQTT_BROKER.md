### OnConnect函数
- GetClientId 获取mqtt clientId
- GetUserName 获取mqtt 用户名
- GetPassword 获取mqtt 密码
- DeviceOnline 将设备上线
- AuthFail 认证失败

### OnMessage函数
- GetMessage 获取消息原始数据
- MsgToString 将原始数据转换成字符串
- MsgToHexStr 将原始数据转换成16进制字段串
- GetSession 获取设备会话
- Topic 获取消息Topic
- GetDevice 获取设备
- GetDeviceById 通过设备id获取设备
- GetConfig 获取设备配置项
- SaveProperties 保存属性
- SaveEvents 保存事件
- ReplyOk 服务下发执行成功
- ReplyFail 服务下发执行失败

### OnInvoke函数
- GetMessage 获取
- GetDevice 获取设备
- ReplyOk 服务下发执行成功
- ReplyFail 服务下发执行失败

### Session对象
- Disconnect 断开连接
- Publish 发送文本数据
- PublishHex 将16进制文本数据转换成byte发送

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