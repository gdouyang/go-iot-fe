/**
 * tcp脚本模板
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
    { caption: 'session.getOperator()', meta: 'decode', value: 'var deviceOpr = session.getOperator()' },
    // dev
    { caption: 'context.getDevice()', meta: 'decode', value: 'var deviceOpr = context.getDevice()' },
    { caption: 'deviceOpr.getConfig("key")', meta: 'decode', value: 'var value = deviceOpr.getConfig("key")' },
    // msg
    { caption: 'context.getMessage()', meta: 'common', value: 'var message = context.getMessage()' },
    { caption: 'message.payloadAsJson()', meta: 'decode', value: 'message.payloadAsJson()' },
    { caption: 'message.payloadAsBytes()', meta: 'decode', value: 'message.payloadAsBytes()' }
  ]
}

obj.demoCode = `// 设备报文 -> 物模型
function decode(context) {
  var bytes = context.getMessage().payloadAsBytes();
  var payload = new Uint8Array(bytes.length);
  for (var i = 0; i < bytes.length; i++) {
    payload[i] = bytes[i] & 0xff;
  }
  var message = null;
  try {
    message = DemoTcpMessage.of1(payload);
    if (log.isDebugEnabled()) {
      log.debug("decode tcp message: {}, {}", bytesToHex(payload), JSON.stringify(message));
    }
  } catch (e) {
    log.warn("decode tcp message error:[{}]", bytesToHex(payload), e);
    log.warn(e)
    throw e;
  }
  var session = context.getSession();
  if (session.getOperator() == null) {
      //设备没有认证就发送了消息
      if (message.getType() != MessageType.AUTH_REQ) {
        log.warn("tcp session[{}], unauthorized.", session.getId());
        var unAuthMsg = DemoTcpMessage.of(MessageType.ERROR, ErrorMessage.of(TcpStatus.UN_AUTHORIZED)).getHexData();
        // 发送回复并关闭连接
        session.sendAsync(context.toByteBuf(unAuthMsg), function (success) { session.close() });
        return null;
      }
      // AuthRequest
      var request = message.getData();
      var deviceId = request.deviceId;
      var operator = context.getDevice(deviceId);
      if (operator != null && operator.getConfig("tcp_auth_key") == request.getKey()) {
        var authSuccess = DemoTcpMessage.of(MessageType.AUTH_RES, AuthResponse.of(deviceId, TcpStatus.SUCCESS)).getHexData();
        session.sendAsync(context.toByteBuf(authSuccess));
        //认证通过
        var onlineMessage = new DeviceOnlineMessage();
        onlineMessage.setDeviceId(deviceId);
        onlineMessage.setTimestamp(new Date().getTime());
        return onlineMessage;
      } else {
        // 设备不存在或者没有配置tcp_auth_key,响应错误信息.
        var authErrorMsg = DemoTcpMessage.of(MessageType.AUTH_RES, AuthResponse.of(deviceId, TcpStatus.ILLEGAL_ARGUMENTS)).getHexData();
        session.sendAsync(context.toByteBuf(authErrorMsg));
        return null;
      }
  }
  //keepalive, ping pong
  if (message.getType() == MessageType.PING) {
    var pongMsg = DemoTcpMessage.of(MessageType.PONG, new Pong()).getHexData();
    session.sendAsync(context.toByteBuf(pongMsg), function () { session.ping(); });
    return null;
  }
  if (message.getData() != null && message.getData().toDeviceMessage) {
    return message.getData().toDeviceMessage()
  }
}

// 物模型 -> 设备报文
function encode(context) {
  var message = context.getMessage();
  var messageType = message.getMessageType();
  if (messageType == 'READ_PROPERTY') {
    var of = DemoTcpMessage.of(MessageType.READ_PROPERTY, ReadProperty.of(message)).getHexData();
    return context.toByteBuf(of);
  }
  if (messageType == 'WRITE_PROPERTY') {
    var of = DemoTcpMessage.of(MessageType.WRITE_PROPERTY, WriteProperty.of(message)).getHexData();
    return context.toByteBuf(of);
  }
  if (messageType == 'REPORT_PROPERTY') {
    var of = DemoTcpMessage.of(MessageType.REPORT_TEMPERATURE, ReportProperty.of(message)).getHexData();
    return context.toByteBuf(of);
  }
  return null;
}

/********** 工具类 */

function TcpPayload () {
  this.toBytes = function (){}
  this.fromBytes = function (bytes, offset) {}

  this.getDeviceIdBytes = function () {
    var data = new Uint8Array(8);
    var dv = new DataView(data.buffer, 0);
    dv.setInt32(0, this.deviceId, true);
    return data;
  }

  this.getDeviceId = function (bytes, offset) {
    var dv = new DataView(bytes.buffer, 0);
    return dv.getInt32(offset, true);
  }
}
var parentTcpPayload = new TcpPayload()

function AuthRequest () {
  this.key = null; // Uint8Array
  this.deviceId = null; // long

  this.getKey = function () {
    return bytesToString(this.key);
  }

  this.toBytes = function () {
    var keyBytes = this.key == null ? new Uint8Array(0) : this.key;

    var data = this.getDeviceIdBytes();

    return [].slice.call(data).concat([].slice.call(keyBytes));
  }
  this.fromBytes = function (/* Uint8Array */bytes, offset) {
    this.deviceId = this.getDeviceId(bytes, offset);
    this.key = [].slice.call(bytes, offset + 8, bytes.length);
    // log.info('auth key: ' + bytesToString(this.key))
  }
}
AuthRequest.prototype = parentTcpPayload

function AuthResponse () {
  this.deviceId = null; // long
  this.status = null; // TcpStatus

  this.toBytes = function () {
    var id = this.getDeviceIdBytes();

    var _status = new Uint8Array(1);
    var dv = new DataView(_status.buffer, 0);
    dv.setUint8(0, this.status.getStatus(), true);
    return [].slice.call(id).concat([].slice.call(_status));
  }
  this.fromBytes = function (bytes, offset) {
    this.deviceId = this.getDeviceId(bytes, offset);
    var status = TcpStatus.of(parseInt(bytes[offset + 8]));
    if (!status) {
      status = TcpStatus.UNKNOWN
    }
    this.status = status;
  }
}
AuthResponse.of = function (deviceId, status) {
  var response = new AuthResponse();
  response.deviceId = deviceId;
  response.status = status;
  return response;
}
AuthResponse.prototype = parentTcpPayload

function ErrorMessage () {
  this.status = null; // TcpStatus

  this.toBytes = function () {
    var bytes = new Uint8Array(1);
    bytes[0] = this.status.getStatus();
    return bytes;
  }
  this.fromBytes = function (bytes, offset) {
    var status = TcpStatus.of(bytes[offset]);
    if (!status) {
      status = TcpStatus.UNKNOWN
    }
    this.status = status;
  }
}
ErrorMessage.of = function (status) {
  var msg = new ErrorMessage()
  msg.status = status;
  return msg;
}
ErrorMessage.prototype = parentTcpPayload

function Ping () {
  this.toBytes = function () {
    return new Uint8Array(0);
  }
  this.fromBytes = function (bytes, offset) {
  }
}
Ping.prototype = parentTcpPayload

function Pong () {
  this.toBytes = function () {
    return new Uint8Array(0);
  }
  this.fromBytes = function (bytes, offset) {
  }
}
Pong.prototype = parentTcpPayload

function TemperatureReport () {
  this.deviceId = null;
  this.temperature = null;

  this.toBytes = function () {
    //前8位为设备ID,后4位为温度值,低位字节在前.
    var data = this.getDeviceIdBytes();

    var uint8Array = new Uint8Array(4);
    var dv = new DataView(uint8Array.buffer, 0);
    dv.setFloat32(0, this.temperature, true);
    data = [].slice.call(data).concat([].slice.call(uint8Array))
    return data;
  }
  this.fromBytes = function (bytes, offset) {
    this.deviceId = this.getDeviceId(bytes, offset);
    var dataView = new DataView(bytes.buffer, 0);
    this.temperature = dataView.getFloat32(offset + 8, true).toFixed(5);
  }

  this.toDeviceMessage = function() {
    var message = {
      messageType: 'REPORT_PROPERTY',
      properties: { "temperature": this.temperature },
      deviceId: this.deviceId
    };
    return message;
  }
}
TemperatureReport.prototype = parentTcpPayload

TemperatureReport.of = function (deviceId, temperature) {
  var r = new TemperatureReport();
  r.deviceId = deviceId;
  r.temperature = temperature;
  return r;
}

function FireAlarm() {
  this.deviceId = null;
  this.lnt = null;
  this.lat = null;
  this.point = null;
  this.bName = null;

  this.toBytes = function () {
    var data = this.getDeviceIdBytes();

    var lntArray = new Uint8Array(4);
    var dv = new DataView(lntArray.buffer, 0);
    dv.setFloat32(0, this.lnt, true);

    var latArray = new Uint8Array(4);
    dv = new DataView(latArray.buffer, 0);
    dv.setFloat32(0, this.lat, true);

    var pointArray = new Uint8Array(4);
    dv = new DataView(pointArray.buffer, 0);
    dv.setInt32(0, this.point, true);
    //设备id+经度+维度+点位
    data = [].slice.call(data).concat([].slice.call(lntArray)).concat([].slice.call(latArray)).concat([].slice.call(pointArray))
    return data;
  }
  this.fromBytes = function (bytes, offset) {
    this.deviceId = this.getDeviceId(bytes, offset);
    var dataView = new DataView(bytes.buffer, 0);
    this.lnt = dataView.getFloat32(offset + 8, true).toFixed(5);
    this.lat = dataView.getFloat32(offset + 8 + 4, true).toFixed(5);
    this.point = dataView.getInt32(offset + 8 + 4 + 4, true);
  }

  this.toDeviceMessage = function() {
    var message = {
      messageType: 'EVENT',
      event: 'fire_alarm',
      data: {
        "lnt": this.lnt,
        "lat": this.lat,
        "point": this.point,
        "b_name": this.bName
      },
      deviceId: this.deviceId,
      messageId: new Date().getTime()
    };
    return message;
  }
}

FireAlarm.prototype = parentTcpPayload

FireAlarm.of = function (deviceId, temperature) {
  var r = new FireAlarm();
  r.deviceId = deviceId;
  r.temperature = temperature;
  return r;
}

function ReadProperty() {
  this.readPropertyMessage = null;

  this.toBytes = function () {
    var bytes = this.readPropertyMessage.toString().getBytes();
    var payload = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) {
      payload[i] = bytes[i] & 0xff;
    }
    return payload;
  }
  this.fromBytes = function (bytes, offset) {
    var readPropertyMessage = new ReadPropertyMessage();
    var json = bytesToString(bytes);
    var obj = JSON.parse(json);

    readPropertyMessage.deviceId = obj.deviceId;
    readPropertyMessage.messageId = obj.messageId;
    readPropertyMessage.code = obj.code;
    readPropertyMessage.headers = obj.headers;
    return readPropertyMessage;
  }
}
ReadProperty.prototype = parentTcpPayload
ReadProperty.of = function (readPropertyMessage) {
  var r = new ReadProperty();
  r.readPropertyMessage = readPropertyMessage;
  return r;
}
//
function WriteProperty() {
  this.writePropertyMessage = null;

  this.toBytes = function () {
    var bytes = this.writePropertyMessage.toString().getBytes();
    var payload = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) {
      payload[i] = bytes[i] & 0xff;
    }
    return payload;
  }
  this.fromBytes = function (bytes, offset) {
    var writePropertyMessage = new WritePropertyMessage();
    var json = bytesToString(bytes);
    var obj = JSON.parse(json);

    writePropertyMessage.deviceId = obj.deviceId;
    writePropertyMessage.messageId = obj.messageId;
    readPropertyMessage.code = obj.code;
    writePropertyMessage.headers = obj.headers;
    return writePropertyMessage;
  }
}
WriteProperty.prototype = parentTcpPayload
WriteProperty.of = function (writePropertyMessage) {
  var r = new WriteProperty();
  r.writePropertyMessage = writePropertyMessage;
  return r;
}
//
function ReportProperty() {
  this.reportPropertyMessage = null;

  this.toBytes = function () {
    var bytes = this.reportPropertyMessage.toString().getBytes();
    var payload = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) {
      payload[i] = bytes[i] & 0xff;
    }
    return payload;
  }
  this.fromBytes = function (bytes, offset) {
    var reportPropertyMessage = new ReportPropertyMessage();
    var json = bytesToString(bytes);
    var obj = JSON.parse(json);

    reportPropertyMessage.deviceId = obj.deviceId;
    reportPropertyMessage.messageId = obj.messageId;
    readPropertyMessage.code = obj.code;
    reportPropertyMessage.headers = obj.headers;
    reportPropertyMessage.properties = obj.properties;
    return reportPropertyMessage;
  }
}
ReportProperty.prototype = parentTcpPayload
ReportProperty.of = function (reportPropertyMessage) {
  var r = new ReportProperty();
  r.reportPropertyMessage = reportPropertyMessage;
  return r;
}
function MessageType (text, payloadSupplier, ordinal) {
  this.text = text;
  this.payloadSupplier = payloadSupplier
  this.ordinal = ordinal;

  this.read = function(/*byte[]*/ payload, /*int*/offset) {
    var tcpPayload = payloadSupplier();
    tcpPayload.fromBytes(payload, offset);
    return tcpPayload;
  }

  this.toBytes = function(/*TcpPayload*/ data) {
    if (data == null) {
        return new Uint8Array(0);
    }
    return data.toBytes();
  }
}

MessageType.AUTH_REQ = new MessageType('认证请求', function () {return new AuthRequest()}, function () {return 0})
MessageType.AUTH_RES = new MessageType('认证结果', function () {return new AuthResponse()}, function () {return 1})
MessageType.ERROR = new MessageType('错误', function () {return new ErrorMessage()}, function () {return 2})
MessageType.PING = new MessageType('Ping', function () {return new Ping()}, function () {return 3})
MessageType.PONG = new MessageType('Pong', function () {return new Pong()}, function () {return 4})
MessageType.REPORT_TEMPERATURE = new MessageType('上报温度', function () {return new TemperatureReport()}, function () {return 5})
MessageType.FIRE_ALARM = new MessageType('火警', function () {return new FireAlarm()}, function () {return 6})
MessageType.READ_PROPERTY = new MessageType('读取设备属性', function () {return new FireAlarm()}, function () {return 7})
MessageType.WRITE_PROPERTY = new MessageType('修改设备属性', function () {return new FireAlarm()}, function () {return 8})
MessageType.REPORT_PROPERTY = new MessageType('上报设备属性', function () {return new FireAlarm()}, function () {return 9})

MessageType.values = [ MessageType.AUTH_REQ, MessageType.AUTH_RES, MessageType.ERROR, MessageType.PING, MessageType.PONG, MessageType.REPORT_TEMPERATURE,
  MessageType.FIRE_ALARM,MessageType.READ_PROPERTY,MessageType.WRITE_PROPERTY, MessageType.REPORT_PROPERTY ]
MessageType.of = function(payload) {
  var type = parseInt(payload[0]);
  var values = MessageType.values
  if (type > values.length) {
    return null;
  }
  var msgType = values[type]
  return msgType;
}

function DemoTcpMessage (/*MessageType*/ type, /*TcpPayload*/ data) {
  this.type = type; // MessageType
  this.data = data; // TcpPayload

  this.getType = function () {
    return this.type;
  }

  this.getData = function () {
    return this.data;
  }
  this.getHexData = function () {
    var bytes = this.toBytes();
    if (bytes) {
      return bytesToHex(bytes);
    }
    return ''
  }
  this.toBytes = function () {

    var body = this.type.toBytes(this.data);
    var bodyLength = body.length;
    // log.info("bodyLength: " + bodyLength)
    if (bodyLength == 0) {
      var header = new Uint8Array(5);
      var dv = new DataView(header.buffer, 0);
      dv.setUint8(0, this.type.ordinal(), true);
      return [].slice.call(header);
    }
    var header = new Uint8Array(1);
    var dv = new DataView(header.buffer, 0);
    dv.setUint8(0, this.type.ordinal(), true);
    // 写入报文长度
    var length = new Uint8Array(4);
    var dv = new DataView(length.buffer, 0);
    dv.setUint32(0, bodyLength, true);
    // 报文头-报文长度-报文内容
    var data = [].slice.call(header).concat([].slice.call(length), [].slice.call(body))
    return data;
  }
}

DemoTcpMessage.of1 = function (payload) {
  var type = MessageType.of(payload);
  if (!type) {
    throw new Error('payload illegal')
  }
  var msg = new DemoTcpMessage(type, type.read(payload, 5));
  return msg
}

DemoTcpMessage.of = function (type, data) {
  var msg = new DemoTcpMessage(type, data);
  return msg
}
function TcpStatus (s) {
  this.status = s; // byte
  this.getStatus = function () {
    return this.status;
  }
}

TcpStatus.SUCCESS = new TcpStatus(0);
TcpStatus.ILLEGAL_ARGUMENTS = new TcpStatus(40);
TcpStatus.UN_AUTHORIZED = new TcpStatus(41);
TcpStatus.INTERNAL_SERVER_ERROR = new TcpStatus(50);
TcpStatus.UNKNOWN = new TcpStatus(-1);
TcpStatus.values = [TcpStatus.SUCCESS, TcpStatus.ILLEGAL_ARGUMENTS, TcpStatus.UN_AUTHORIZED, TcpStatus.INTERNAL_SERVER_ERROR, TcpStatus.UNKNOWN]
TcpStatus.of = function (value) {
  for (var index = 0; index < TcpStatus.values.length; index++) {
    var tcpStatus = TcpStatus.values[index];
    if (tcpStatus.status == value) {
      return tcpStatus;
    }
  }
  return null;
}

function bytesToString(bytes) {
  var arr = bytes;
  if (typeof arr === 'string') {
    return arr;
  }
  var uint8Array;
  if (bytes instanceof Uint8Array) {
    uint8Array = bytes;
  } else {
    uint8Array = new Uint8Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
      uint8Array[i] = arr[i] & 0xff;
    }
  }
  var str = '',
      _arr = uint8Array;
  for (var i = 0; i < _arr.length; i++) {
    _arr[i] = _arr[i]; 
    var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
      } else {
      str += String.fromCharCode(_arr[i]);
      }
  }
  return str 
}

function bytesToHex(bytes) {
  var arr = bytes;
  if (typeof arr === 'string') {
    return arr;
  }
  var uint8Array;
  if (bytes instanceof Uint8Array) {
    uint8Array = bytes;
  } else {
    uint8Array = new Uint8Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
      uint8Array[i] = arr[i] & 0xff;
    }
  }
  var str = ''
  for (var i = 0; i < uint8Array.length; i++) {
    var num = uint8Array[i]
    str += ("0" + (Number(num).toString(16))).slice(-2)
  }
  return str
}
`
export default obj
