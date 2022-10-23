/**
 * 移动OneNet脚本模版
 */
const obj = {
  tpl: `// 设备报文 -> 物模型
function decode(data) {
}

// 物模型 -> 设备报文
function encode(message) {
}
`,
  codeTip: [
    { caption: 'context', meta: '上下文', value: 'context' }
  ]
}
obj.demoCode = `// 设备报文 -> 物模型
function decode(data) {
  var msg = data.msg;
  var value = msg.value;
  var imei = msg.imei;
  var entity = new MsgEntity(value);
  var msgHeader = entity.header;
  var value1 = msgHeader.msgType.value;
  if (MsgType.心跳消息.equals(value1) || MsgType.上行接入请求.equals(value1)) {
    // 灯控器心中、上行接入时需要返回ack不然会断开连接
    doAck(imei, msgHeader)
  }
  // 心跳消息中包含了亮度、电流、电压、功率
  if (MsgType.心跳消息.equals(value1)) {
    var light = entity.getNextIntegerWord(); // 亮度 0表示关闭1
    var current = entity.getNextIntegerWord(); // 电流 单位mA
    var voltage = entity.getNextIntegerWord(); // 电压 V
    var power = entity.getNextIntegerWord(); // 功率 W
    var json = {};
    json.light = light;
    json.current = current;
    json.voltage = voltage;
    json.power = power;

    return {
      messageType: 'REPORT_PROPERTY',
      properties: json,
      deviceId: imei
    };
  }
}
// 物模型 -> 设备报文
function encode(message) {
  var messageType = message.getMessageType();
  if (messageType != 'INVOKE_FUNCTION') {
    throw new Error('只支持设备功能调用');
  }
  var functionId = message.getFunctionId();
  var messageId = message.getMessageId();
  var invoke = new FunctionInvokeUtil();
  var result = null;
  switch (functionId) {
    case "timing":
      result = invoke.timing();
      break;
    case "switching":
      result = invoke.switching(message);
      break;
    case "dimming":
      result = invoke.dimming(message);
      break;
    case "strategy":
      result = invoke.strategy(message);
      break;
    default:
      throw new Error(functionId + '无效功能ID');
  }
  var replyData = {
    messageType: 'INVOKE_FUNCTION_REPLY',
    success: true,
    output: null,
    message: null,
    deviceId: message.getDeviceId(),
    functionId: functionId,
    messageId: messageId
  }
  var success = function(resp) {
    replyData.output = resp;
    replyData.message = resp;
    // 发送成功后要处理回复
    ctx.reply(replyData)
  }
  var error = function(err) {
    replyData.success = false;
    replyData.output = err;
    replyData.message = err;
    // 发送成功后要处理回复
    ctx.reply(replyData)
  }
  sendToOneNet(message.getDeviceId(), {'args': result}, success, error);
}

function doAck(imei, msgHeader) {
  var value1 = msgHeader.msgType.value;
  var args = '';
  if (MsgType.上行接入请求.equals(value1)) {
    args = CmdUtil.resp(MsgType.接入应答);
  } else if (MsgType.心跳消息.equals(value1)) {
    args = CmdUtil.getCmdMsg(MsgType.下行ACK, msgHeader.pktNum.hex, null);
  }
  sendToOneNet(imei, {'args': args});
}

// 发送指令给移动平台
function sendToOneNet(imei, data, success, error) {
  // 获取页面上配置的地址与apiKey
  ctx.getConfig('apiAddress', function(url) {
    ctx.getConfig('apiKey', function(apiKey) {
      ctx.request({
        method: 'post',
        url: url + '/nbiot/execute?imei='+ imei +'&obj_id=3200&obj_inst_id=0&res_id=5505',
        data: data,
        headers: {'api-key': apiKey},
        success: success,
        error: error
      })
    })
  })
}

function FunctionInvokeUtil() {
  // 开关
  this.switching = function(message) {
    var data = message.getInput("status").orElse("off");
    if ("on" == data) {
      return CmdUtil.getCmdMsg(MsgType.开关灯调光, CmdUtil.getHexStr(10, 1), null);
    } else {
      return CmdUtil.getCmdMsg(MsgType.开关灯调光, CmdUtil.getHexStr(0, 1), null);
    }
  }
  // 调光
  this.dimming = function(message) {
    var data = message.getInput("bright").orElse(0);
    return CmdUtil.getCmdMsg(MsgType.开关灯调光, CmdUtil.getHexStr(parseInt(data), 1), null);
  }
  // 设置策略
  this.strategy = function(message) {
    var data = message.getInput("strategy").orElse("");
    if (data) {
      var dateStr = "";
      // 时-分-亮度,...,...："18-30-30,20-30-80,5-30-50,6-30-0"
      var strategyS = data.split(",");
      for(var i = 0; i < strategyS.length; i++) {
        var s = strategyS[i];
        var strategy = s.split("-");
        for(var j = 0; j < strategy.length; j++) {
          var t = strategy[j];
          dateStr += CmdUtil.getHexStr(parseInt(t), 1);
        }
      }
      return CmdUtil.getCmdMsg(MsgType.设置策略, dateStr, strategyS.length * 3);
    }
  }
  // 校时
  this.timing = function () {
    return CmdUtil.resp(MsgType.校时);
  }
}

function CmdUtil() {
}
CmdUtil.resp = function(msgType) {
  var date = ctx.formatDate(new Date().getTime(), "yy MM dd HH mm ss").split(' ');
  var dateStr = '';
  for(var i = 0; i < date.length; i++) {
    dateStr += CmdUtil.getHexStr(parseInt(date[i]), 1);
  }
  print(dateStr);
  return CmdUtil.getCmdMsg(msgType, dateStr, null);
}

CmdUtil.getCmdMsg = function(msgType, msgData, len) {
  var version = "0100";
  var msgLen = len !== null ? CmdUtil.getHexStr(len,2) : msgType.lenHex;
  var msgHead = version + CmdUtil.getPktNum() + msgType.codeHex + msgLen;
  var msgCrc16 = ctx.toCrc16(msgHead + msgData);

  return (msgHead + msgData + msgCrc16).toUpperCase();
}
CmdUtil.getHexStr = function(value, size) {
  // 十进制转十六进制，并补齐四位
  var hexStr = value.toString(16);
  while (hexStr.length < 4) {
    hexStr = "0" + hexStr;
  }
  // 前后置位
  hexStr = hexStr.substring(2, 4) + hexStr.substring(0, 2);
  // 按需返回
  return hexStr.substring(0, size * 2);
}

CmdUtil.pktNum = 0;
CmdUtil.getPktNum = function() {
  CmdUtil.pktNum++;
  return CmdUtil.getHexStr(CmdUtil.pktNum, 2);
}

function MsgEntity(text) {
  var header = text.substring(0, 16);
  var msgHeader = new MsgHeader(header);
  var length = msgHeader.msgLen.value;
  var endIndex = 16 + (length * 2);

  this.body = text.substring(16, endIndex);
  this.header = msgHeader;
  this.offset = 0;

  this.resetOffset = function () {
    this.offset = 0;
  }

  this.getNextIntegerBYTE = function () {
    return parseInt(this.getNextByte(), 16);
  }

  this.getNextWord = function () {
    var high = this.getNextByte();
    var low = this.getNextByte();
    return low + high;
  }

  this.getNextByte = function () {
    var endIndex = this.offset + 2;
    if (endIndex > this.body.length()) {
        return null;
    }
    var str = this.body.substring(this.offset, endIndex);
    this.offset = endIndex;
    return str;
  }

  this.getNextIntegerWord = function () {
    return parseInt(this.getNextWord(), 16);
  }
}

function MsgHeader(header) {
  var versionStr = header.substring(0, 4);
  var pktNumStr = header.substring(4, 8); // 序列号，递增
  var msgTypeStr = header.substring(8, 12); // 消息类型
  var msgLenStr = header.substring(12, 16); // 消息体长度

  this.version = new DataTypeWord(versionStr);
  this.pktNum = new DataTypeWord(pktNumStr);
  this.msgType = new DataTypeWord(msgTypeStr);
  this.msgLen = new DataTypeWord(msgLenStr);
}

function DataTypeWord(text) {
  this.hex = text; // string
  
  this.highBit = text.substring(2, 4); // string
  this.lowBit = text.substring(0, 2); // string
  this.value = parseInt(this.highBit + this.lowBit, 16); // int
  
}

function MsgType(typeCode, desc, codeHex, lenHex) {
  this.typeCode = typeCode;
  this.typeDesc = desc;
  this.codeHex = codeHex;
  this.lenHex = lenHex;

  this.equals = function(code) {
    return this.typeCode == code;
  }
}
// 上行消息类型
MsgType.上行ACK = new MsgType(1, "上行ACK", "0100", "");
MsgType.上行NACK = new MsgType(2, "上行NACK", "0200", "");
MsgType.上行接入请求 = new MsgType(3, "上行接入请求", "0300", "");
MsgType.心跳消息 = new MsgType(4, "心跳消息", "0400", "");
MsgType.终端电参数消息应答 = new MsgType(5, "终端电参数消息应答", "0500", "");
MsgType.终端上行通信参数获取应答 = new MsgType(6, "终端上行通信参数获取应答", "0600", "");
MsgType.终端通信网络信息应答 = new MsgType(7, "终端通信网络信息应答", "0700", "");
MsgType.调光模式获取应答 = new MsgType(8, "调光模式获取应答", "0800", "");
MsgType.获取策略请求应答 = new MsgType(9, "获取策略请求应答", "0900", "");
MsgType.上行升级报文 = new MsgType(100, "上行升级报文", "6400", "");
// 下行消息类型
MsgType.下行ACK = new MsgType(1001, "下行ACK", "E903", "0200");
MsgType.下行NACK = new MsgType(1002, "下行ACK", "EA03", "");
MsgType.开关灯调光 = new MsgType(1003, "开关灯调光", "EB03", "0100");
MsgType.设置策略 = new MsgType(1004, "设置策略", "EC03", "0300");
MsgType.配置还原 = new MsgType(1005, "配置还原", "ED03", "");
MsgType.获取调光模式 = new MsgType(1006, "获取调光模式", "EE03", "");
MsgType.设置调光模式 = new MsgType(1007, "设置调光模式", "EF03", "");
MsgType.复位重启 = new MsgType(1008, "设置调光模式", "F003", "");
MsgType.设置终端上行通信参数 = new MsgType(1009, "设置终端上行通信参数", "F103", "");
MsgType.获取终端电参数信息 = new MsgType(1010, "获取终端电参数信息", "F203", "");
MsgType.获取终端上行通信参数 = new MsgType(1011, "获取终端上行通信参数", "F303", "");
MsgType.获取终端通信网络信息 = new MsgType(1012, "获取终端通信网络信息", "F403", "");
MsgType.校时 = new MsgType(1013, "校时", "F503", "F5030600");
MsgType.接入应答 = new MsgType(1014, "接入应答", "F603", "0600");
MsgType.获取策略请求 = new MsgType(1015, "获取策略请求", "F703", "");
MsgType.下行升级报文 = new MsgType(1100, "下行升级报文", "4C04", "");
`
export default obj
