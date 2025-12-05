type EventHandler<T = any> = (...args: T[]) => void

class EventEmitter<Events extends Record<string, any> = Record<string, any>> {
  private events: {
    [K in keyof Events]?: Array<EventHandler<Events[K]>>
  } = {}

  // 订阅事件
  on<K extends keyof Events>(eventName: K, callback: EventHandler<Events[K]>) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName]?.push(callback)
    return this
  }

  // 发布事件
  emit<K extends keyof Events>(eventName: K, ...args: Events[K][]) {
    this.events[eventName]?.forEach((callback) => callback(...args))
    return this
  }

  // 取消订阅
  off<K extends keyof Events>(eventName: K, callback: EventHandler<Events[K]>) {
    this.events[eventName] = this.events[eventName]?.filter((cb) => cb !== callback) || []
    return this
  }

  // 单次订阅
  once<K extends keyof Events>(eventName: K, callback: EventHandler<Events[K]>) {
    const wrapper = (...args: Events[K][]) => {
      callback(...args)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
    return this
  }
}
// 使用示例
const emitter = new EventEmitter<{
  error: [Error]
}>()
export default emitter
