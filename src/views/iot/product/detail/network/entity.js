const defaultTcpAddObj = {
  id: null,
  name: '',
  type: 'TCP_SERVER',
  configuration: {
    ssl: false,
    certId: null,
    host: '0.0.0.0',
    port: '',
    parserType: '',
    parserConfiguration: {
      delimited: null,
      lang: 'javascript',
      script: '',
      size: null
    }
  },
  description: null
}

function parserType (type) {
  if (type === 'DIRECT') {
    return '不处理'
  } else if (type === 'delimited') {
    return '分隔符'
  } else if (type === 'fixed_length') {
    return '固定长度'
  } else if (type === 'script') {
    return '自定义脚本'
  }
}

const defaultMqttAddObj = {
  id: null,
  name: '',
  type: 'MQTT_SERVER',
  configuration: {
    ssl: false,
    certId: null,
    host: '0.0.0.0',
    port: '',
    instance: 10,
    maxMessageSize: 8096,
    productId: ''
  },
  description: null
}

const defaultWebSocketAddObj = {
  id: null,
  name: '',
  type: 'WEB_SOCKET_SERVER',
  configuration: {
    ssl: false,
    certId: null,
    host: '0.0.0.0',
    port: '',
    instance: 10,
    productId: '',
    routers: [{ id: 1, url: '', protocol: '' }]
  },
  description: null
}

const defaultHttpAddObj = {
  id: null,
  name: '',
  type: 'HTTP_SERVER',
  configuration: {
    ssl: false,
    certId: null,
    host: '0.0.0.0',
    port: '',
    instance: 10,
    productId: '',
    routers: [{ id: 1, url: '', protocol: '' }]
  },
  description: null
}

export { defaultTcpAddObj, parserType, defaultMqttAddObj, defaultWebSocketAddObj, defaultHttpAddObj }
