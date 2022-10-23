export function newTrigger () {
  return {
    trigger: undefined,
    cron: undefined,
    type: undefined,
    modelId: undefined,
    filters: []
  }
}

export function newFilter () {
  return {
    key: undefined,
    operator: undefined,
    value: undefined
  }
}
