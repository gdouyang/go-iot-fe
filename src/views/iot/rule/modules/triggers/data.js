export function newScene () {
  return {
    name: '',
    triggerType: '', // device, timer
    cron: '', // type == 'timer'时才有
    productId: undefined,
    deviceIds: [],
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
    logic: undefined,
    key: undefined,
    operator: undefined,
    value: undefined
  }
}
