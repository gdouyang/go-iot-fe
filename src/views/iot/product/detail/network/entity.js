const defaultTcpAddObj = {
  id: null,
  name: '',
  type: 'TCP_SERVER',
  productId: null,
  configuration: {
    useTLS: false,
    certificate: null,
    host: '',
    port: null,
    delimeter: {
      type: null, // Delimited, FixLength
      splitFunc: null,
      length: null
    }
  }
}

function parserType (type) {
  if (type === 'Delimited') {
    return '分隔符'
  } else if (type === 'FixLength') {
    return '固定长度'
  } else if (type === 'SplitFunc') {
    return '自定义脚本'
  } else {
    return '不处理'
  }
}

const defaultMqttAddObj = {
  id: null,
  name: '',
  type: 'MQTT_BROKER',
  productId: null,
  configuration: {
    useTLS: false,
    certificate: null,
    host: '',
    port: null
  }
}

const defaultWebSocketAddObj = {
  id: null,
  name: '',
  type: 'WEBSOCKET_SERVER',
  productId: null,
  configuration: {
    useTLS: false,
    certificate: null,
    host: '',
    port: null,
    routers: [{ url: '' }]
  }
}

const defaultHttpAddObj = {
  id: null,
  name: '',
  type: 'HTTP_SERVER',
  productId: null,
  configuration: {
    useTLS: false,
    certificate: null,
    host: '',
    port: null,
    routers: [{ url: '' }]
  }
}

export { defaultTcpAddObj, parserType, defaultMqttAddObj, defaultWebSocketAddObj, defaultHttpAddObj }
