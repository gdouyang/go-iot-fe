
## Modbus说明
### OnInvoke函数
- GetMessage 获取
- GetDevice 获取设备
- ReplyOk 服务下发执行成功
- ReplyFail 服务下发执行失败
- Int16ToData
- FloatToInt16Data
- FloatToUint16Data

### Session对象
- ReadDiscreteInputs 读取离散量输入
- ReadCoils 读取线圈
- ReadInputRegisters 读输入寄存器
- ReadHoldingRegisters 读保持寄存器
- WriteCoils 写多线圈寄存器
- WriteHoldingRegisters 写*保持寄存器(length == 1时单保持寄存器, length > 1时多保持寄存器)

### Response
- GetMessage 获取原始返回数据
- MsgToString 消息转成文本
- MsgToHexStr 消息转成16进制字符串
- MsgToUint16 消息转成无16位无符号整型
- MsgToUint32 消息转成无32位无符号整型
- MsgToUint64 消息转成无64位无符号整型
- MsgToBool 消息转成布尔类型

### 样例
```
// 物模型 -> 设备报文
function OnInvoke(context) {
  var message = context.getMessage();
  var response = context.GetSession().ReadDiscreteInputs(1, 4)
  console.log(response.MsgToUint16())
}
```