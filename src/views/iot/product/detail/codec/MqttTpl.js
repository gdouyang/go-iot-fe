/**
 * mqtt脚本模板
 */
const obj = {
  tpl: `// 设备连接时执行
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
    { caption: 'context.getSession()', meta: 'decode', value: 'var session = context.getSession()' },
    // dev
    { caption: 'context.getDevice()', meta: 'decode', value: 'var deviceOpr = context.getDevice()' },
    { caption: 'deviceOpr.getDeviceId()', meta: 'decode', value: 'var deviceId = deviceOpr.getDeviceId()' },
    // msg
    { caption: 'context.getMessage()', meta: 'common', value: 'var message = context.getMessage()' },
    { caption: 'message.payloadAsJson()', meta: 'decode', value: 'message.payloadAsJson()' },
    { caption: 'message.getTopic()', meta: 'decode', value: 'var uri = wsSession.getTopic()' },
    // encode
    { caption: 'message.getMessageType()', meta: 'encode', value: 'var messageType = message.getMessageType()' }
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
  context.Save(data)
}
function OnInvoke(context) {
	console.log("OnInvoke: " + JSON.stringify(context.GetMessage().Data))
	context.GetSession().Publish("test", JSON.stringify(context.GetMessage().Data))
}
`
export default obj
