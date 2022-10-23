import _ from 'lodash'
const defaultPropertiesData = {
  id: null,
  name: null,
  expands: {
    readOnly: null,
    level: null
  },
  description: null
}
const defaultEventsData = {
  id: null,
  name: null,
  expands: {
    level: null
  },
  description: null
}
// const defaultValueTypeData = {
//   type: null,
//   expands: {
//     maxLength: null
//   },
//   trueText: null,
//   trueValue: null,
//   falseText: null,
//   falseValue: null,
//   format: null,
//   description: null
// }
export function getPropertiesData (data) {
  // const valueType = getValueTypeData(data ? data.valueType : null)
  const d = _.assign({}, defaultPropertiesData, data)
  d.valueType = data && data.valueType ? data.valueType : {}
  return d
}

// export function getValueTypeData (data) {
//   const eleType = data ? data.elementType : undefined
//   let expands = _.assign({}, defaultValueTypeData.expands, eleType ? eleType.expands : undefined)
//   const elementType = _.assign({}, defaultValueTypeData, eleType)
//   elementType.expands = expands
//   //
//   expands = _.assign({}, defaultValueTypeData.expands, data ? data.expands : undefined)
//   const valueType = _.assign({}, defaultValueTypeData, data)
//   valueType.expands = expands
//   valueType.elementType = elementType
//   return valueType
// }

export function getFunctionsData (data) {
  const output = data && data.output ? data.output : {} // getValueTypeData(data ? data.output : null)
  if (output.properties) {
    // output.properties.forEach((item, index) => {
    //   output.properties[index] = getPropertiesData(item)
    // })
  } else {
    output.properties = []
  }
  const d = _.assign({}, defaultPropertiesData, data)
  d.output = output
  if (d.inputs) {
    // d.inputs.forEach((item, index) => {
    //   d.inputs[index] = getPropertiesData(item)
    // })
  } else {
    d.inputs = []
  }
  return d
}

export function getEventsData (data) {
  const valueType = data && data.valueType ? data.valueType : {} // getValueTypeData(data ? data.valueType : null)
  // const properties = getValueTypeData(valueType.properties)
  if (!valueType.properties) {
    valueType.properties = []
  }
  const d = _.assign({}, defaultEventsData, data)
  d.valueType = valueType
  return d
}
