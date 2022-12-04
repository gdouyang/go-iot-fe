/**
 * mqtt脚本模板
 */
const obj = {
  tpl: `// 连接时执行
function OnConnect(context) {
}
// 收到消息时执行
function OnMessage(context) {
}
// 命令调用
function OnInvoke(context) {
}
`,
  demoCode: '',
  codeTip: [
    { caption: 'context', meta: 'common', value: 'context' },
    // OnConnect
    { caption: 'context.GetClientId()', meta: 'OnConnect', value: 'var clientId = context.GetClientId()' },
    { caption: 'context.GetUserName()', meta: 'OnConnect', value: 'var username = context.GetUserName()' },
    { caption: 'context.DeviceOnline()', meta: 'OnConnect', value: 'context.DeviceOnline(deviceId)' },
    { caption: 'context.AuthFail()', meta: 'OnConnect', value: 'context.AuthFail()' },
    // OnMessage
    { caption: 'context.GetMessage()', meta: 'OnMessage', value: 'var message = context.GetMessage()' },
    { caption: 'context.GetSession()', meta: 'OnMessage', value: 'var session = context.GetSession()' },
    { caption: 'context.DeviceOnline()', meta: 'OnMessage', value: 'context.DeviceOnline(deviceId)' },
    { caption: 'context.GetDevice()', meta: 'OnMessage', value: 'var deviceOper = context.GetDevice()' },
    { caption: 'context.GetConfig()', meta: 'OnMessage', value: 'var value = context.GetConfig("key")' },
    { caption: 'context.ReplyOk()', meta: 'OnMessage', value: 'var value = context.ReplyOk()' },
    { caption: 'context.GetConfig()', meta: 'OnMessage', value: 'var value = context.ReplyFail("resaon")' },
    { caption: 'context.SaveProperties()', meta: 'OnMessage', value: 'context.SaveProperties({"key":"value"})' },
    // deviceOper
    { caption: 'deviceOper.GetConfig()', meta: 'deviceOper', value: 'var value = deviceOpr.GetConfig("key")' },
    // session
    { caption: 'session.Disconnect()', meta: 'session', value: 'session.Disconnect()' },
    { caption: 'session.Publish()', meta: 'session', value: 'session.Publish("topic", "payload")' },
    // OnInvoke
    { caption: 'context.GetMessage()', meta: 'OnInvoke', value: 'var message = context.GetMessage()' },
    { caption: 'context.GetDevice()', meta: 'OnInvoke', value: 'var deviceOper = context.GetDevice()' },
    { caption: 'message.GetClientId()', meta: 'OnInvoke', value: 'var clientId = message.GetClientId()' },
    { caption: 'context.ReplyOk()', meta: 'OnInvoke', value: 'var value = context.ReplyOk()' },
    { caption: 'context.GetConfig()', meta: 'OnInvoke', value: 'var value = context.ReplyFail("resaon")' }
  ]
}
obj.demoCode = `function OnConnect(context) {
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
`
export default obj
