/**
 * websocket脚本模板
 */
const obj = {
  tpl: `// 设备报文 -> 物模型
function decode(context) {
  return {

  }
}

// 物模型 -> 设备报文
function encode(context) {

}
`,
  demoCode: '',
  codeTip: [
    { caption: 'context', meta: 'common', value: 'context' },
    { caption: 'context.getSession()', meta: 'decode', value: 'var session = context.getSession()' },
    { caption: 'session.getOperator()', meta: 'decode', value: 'var deviceOpr = session.getOperator()' },
    // dev
    { caption: 'context.getDevice()', meta: 'decode', value: 'var deviceOpr = context.getDevice()' },
    { caption: 'deviceOpr.getConfig("key")', meta: 'decode', value: 'var value = deviceOpr.getConfig("key")' },
    // msg
    { caption: 'context.getMessage()', meta: 'common', value: 'var message = context.getMessage()' },
    { caption: 'message.payloadAsJson()', meta: 'decode', value: 'message.payloadAsJson()' },
    { caption: 'message.getWebSocketSession()', meta: 'decode', value: 'var wsSession = message.getWebSocketSession()' },
    // wsSession
    { caption: 'wsSession.getUri()', meta: 'decode', value: 'var uri = wsSession.getUri()' },
    { caption: 'wsSession.textMessage(text)', meta: 'decode', value: 'var wsMsg = wsSession.textMessage(text)' },
    { caption: 'wsSession.send(wsMsg)', meta: 'decode', value: 'wsSession.send(wsMsg)' },
    // encode
    { caption: 'message.getMessageType()', meta: 'encode', value: 'var messageType = message.getMessageType()' }
  ]
}
obj.demoCode = `// 设备报文 -> 物模型
function decode(context) {
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
function encode(context) {
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
