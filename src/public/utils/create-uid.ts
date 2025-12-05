const keys: any = {}

export const createUid = (): string => {
  const key = Math.random().toString(36).slice(2) + Date.now()
  if (!keys[key]) {
    keys[key] = key
    return key
  }
  return createUid()
}
