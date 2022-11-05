const defaultTcpAddObj = {
  id: null,
  name: '',
  type: 'TCP_SERVER',
  productId: '',
  configuration: {
    useTLS: false,
    certificate: null,
    host: '0.0.0.0',
    port: '',
    delimeter: {
      type: null, // Delimited, FixLength
      splitFunc: null,
      length: null
    }
  }
}

function parserType (type) {
  if (type === '') {
    return '不处理'
  } else if (type === 'Delimited') {
    return '分隔符'
  } else if (type === 'FixLength') {
    return '固定长度'
  } else if (type === 'SplitFunc') {
    return '自定义脚本'
  }
}

const defaultMqttAddObj = {
  id: null,
  name: '',
  type: 'MQTT_BROKER',
  productId: '',
  configuration: {
    useTLS: false,
    certificate: null,
    host: '0.0.0.0',
    port: ''
  }
}

const defaultWebSocketAddObj = {
  id: null,
  name: '',
  type: 'WEBSOCKET_SERVER',
  productId: '',
  configuration: {
    useTLS: false,
    certificate: null,
    host: '0.0.0.0',
    port: '',
    routers: [{ id: 1, url: '', protocol: '' }]
  }
}

const defaultHttpAddObj = {
  id: null,
  name: '',
  type: 'HTTP_SERVER',
  productId: '',
  configuration: {
    useTLS: false,
    certificate: null,
    host: '0.0.0.0',
    port: '',
    routers: [{ id: 1, url: '', protocol: '' }]
  }
}

export { defaultTcpAddObj, parserType, defaultMqttAddObj, defaultWebSocketAddObj, defaultHttpAddObj }
