export function newScene () {
  return {
    name: '',
    triggerType: '', // device, timer
    cron: '', // type == 'timer'时才有
    modelId: undefined,
    productId: undefined,
    productName: undefined,
    deviceId: undefined,
    deviceName: undefined,
    trigger: {
      filterType: undefined,
      shakeLimit: {
        enabled: false,
        time: undefined,
        threshold: undefined,
        alarmFirst: true
      },
      filters: []
    }
  }
}

export function newFilter () {
  return {
    key: undefined,
    operator: undefined,
    value: undefined
  }
}
