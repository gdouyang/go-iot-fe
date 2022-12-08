/**
 * websocket脚本模板
 */
const obj = {
  tpl: `function OnConnect(context) {
}
function OnMessage(context) {
}
function OnInvoke(context) {
}
`,
  demoCode: '',
  codeTip: [
    { caption: 'context', meta: 'common', value: 'context' },
    // OnMessage
    { caption: 'context.GetMessage()', meta: 'OnMessage', value: 'var message = context.GetMessage()' },
    { caption: 'context.MsgToString()', meta: 'OnMessage', value: 'var str = context.MsgToString()' },
    { caption: 'context.GetSession()', meta: 'OnMessage', value: 'var session = context.GetSession()' },
    { caption: 'context.DeviceOnline()', meta: 'OnMessage', value: 'context.DeviceOnline(deviceId)' },
    { caption: 'context.GetDevice()', meta: 'OnMessage', value: 'var deviceOper = context.GetDevice()' },
    { caption: 'context.GetConfig()', meta: 'OnMessage', value: 'var value = context.GetConfig("key")' },
    { caption: 'context.ReplyOk()', meta: 'OnMessage', value: 'context.ReplyOk()' },
    { caption: 'context.GetConfig()', meta: 'OnMessage', value: 'context.ReplyFail("resaon")' },
    { caption: 'context.IsTextMessage()', meta: 'OnMessage', value: 'var yes = context.IsTextMessage()' },
    { caption: 'context.IsBinaryMessage()', meta: 'OnMessage', value: 'var yes = context.IsBinaryMessage()' },
    { caption: 'context.GetHeader()', meta: 'OnMessage', value: 'var value = context.GetHeader("key")' },
    { caption: 'context.GetUrl()', meta: 'OnMessage', value: 'var url = context.GetUrl()' },
    { caption: 'context.GetQuery()', meta: 'OnMessage', value: 'var value = context.GetQuery("key")' },
    { caption: 'context.GetForm()', meta: 'OnMessage', value: 'var value = context.GetForm("key")' },
    { caption: 'context.SaveProperties()', meta: 'OnMessage', value: 'context.SaveProperties({"key":"value"})' },
    // deviceOper
    { caption: 'deviceOper.GetConfig()', meta: 'deviceOper', value: 'var value = deviceOpr.GetConfig("key")' },
    // session
    { caption: 'session.Disconnect()', meta: 'session', value: 'session.Disconnect()' },
    { caption: 'session.SendText()', meta: 'session', value: 'session.SendText("text")' },
    { caption: 'session.SendBinary()', meta: 'session', value: 'session.SendBinary("base64 string")' },
    // OnInvoke
    { caption: 'context.GetMessage()', meta: 'OnInvoke', value: 'var message = context.GetMessage()' },
    { caption: 'context.GetDevice()', meta: 'OnInvoke', value: 'var deviceOper = context.GetDevice()' },
    { caption: 'message.GetClientId()', meta: 'OnInvoke', value: 'var clientId = message.GetClientId()' },
    { caption: 'context.ReplyOk()', meta: 'OnInvoke', value: 'context.ReplyOk()' },
    { caption: 'context.GetConfig()', meta: 'OnInvoke', value: 'context.ReplyFail("resaon")' }
  ]
}
obj.demoCode = `// 设备报文 -> 物模型
function OnMessage(context) {
  var wsMessage = context.getMessage();
  var session = wsMessage.getWebSocketSession();
  var payload = wsMessage.payloadAsJson();
  var topic = session.getUri();
  // 根据路径来判断是什么类型
  if (topic.startsWith("/report-property")) {
    payload.messageType = 'REPORT_PROPERTY'
    return payload
  } else if (topic.startsWith("/fault_alarm")) {
    return {
      messageType: 'EVENT',
      event: 'fire_alarm',
      deviceId: payload["deviceId"],
      messageId: new Date().getTime(),
      data: payload
    }
  } else if (topic.startsWith("/read-property")) {
    payload.messageType = 'READ_PROPERTY_REPLY';
    return payload
  } else {
    // 如果都不匹配则给客户端返回404
    session.send(session.textMessage('{"status":404, "message": "uri ['+ topic +']not support"}'))
    return null
  }

}

// 物模型 -> 设备报文
function OnInvoke(context) {
  var message = context.getMessage();
  var messageType = message.getMessageType();
  if (messageType == 'READ_PROPERTY') {
    var data = {
      messageId: message.getMessageId(),
      deviceId: message.getDeviceId(),
      properties: message.getProperties()
    };
    return {
      topic: "/read-property",
      message: data
    }
  }
  if (messageType == 'WRITE_PROPERTY') {
    var data = {
      messageId: message.getMessageId(),
      deviceId: message.getDeviceId(),
      properties: message.getProperties()
    };
    return {
      topic: "/write-property",
      message: data
    }
  }
  if (messageType == 'INVOKE_FUNCTION') {
    var data = {
      messageId: message.getMessageId(),
      deviceId: message.getDeviceId(),
      function: message.getFunctionId(),
      args: message.getInputs()
    };
    return {
      topic: "/invoke-function",
      message: data
    }
  }
  return null;
}
`
export default obj
