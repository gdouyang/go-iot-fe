export function newTrigger () {
  return {
    type: undefined, // device, timer
    cron: undefined, // trigger == 'timer'时才有
    device: { // trigger == 'device'时才有
      type: undefined,
      modelId: undefined,
      productId: undefined,
      productName: undefined,
      deviceId: undefined,
      deviceName: undefined,
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
