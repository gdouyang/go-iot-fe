/**
 * mqtt脚本模板
 */
const obj = {
  tpl: `// 设备报文 -> 物模型
function decode(context) {
}

// 物模型 -> 设备报文
function encode(context) {
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
obj.demoCode = `// 设备报文 -> 物模型
function decode(context) {
  var mqttMessage = context.getMessage()
  var payload = mqttMessage.payloadAsJson();
  var topic = mqttMessage.getTopic();
  var deviceId = context.getDevice() != null ? context.getDevice().getDeviceId() : null;
  if (topic.startsWith("/report-property")) {
    return {
      messageType: 'REPORT_PROPERTY',
      properties: payload.properties,
      deviceId: deviceId,
      code: payload.code,
      headers: payload.headers,
      messageId: payload.messageId
    }
  } else if (topic.startsWith("/report-property")) {
    return {
      messageType: 'EVENT',
      event: 'fire_alarm',
      deviceId: deviceId,
      messageId: new Date().getTime(),
      data: payload
    }
  } else if (topic.startsWith("/read-property")) {
    return payload
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
