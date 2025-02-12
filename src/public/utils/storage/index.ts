class StorageManager {
  // 存储配置
  private config: { prefix: string; expire: number }

  constructor() {
    // 初始化配置信息
    this.config = {
      prefix: import.meta.env.VITE_APP_ENV || '', // 名称前缀 建议：项目名 + 项目版本
      expire: 1000 * 60 * 60 * 24 * 60, // 过期时间 单位：秒
    }
    this.autoAddPrefix = this.autoAddPrefix.bind(this)
    this.setStorage = this.setStorage.bind(this)
    this.removeStorage = this.removeStorage.bind(this)
    this.getStorageAll = this.getStorageAll.bind(this)
    this.getStorage = this.getStorage.bind(this)
  }

  // 设置存储
  setStorage(key: string, value: any, expire = 0) {
    if (value === '' || value === null || value === undefined) {
      value = null
    }
    if (isNaN(expire) || expire < 0) throw new Error('Expire 必须是一个数字')
    expire = expire || this.config.expire
    const data = {
      value, // 存储值
      time: Date.now(), // 存值时间戳
      expire, // 过期时间
    }
    try {
      uni.setStorageSync(this.autoAddPrefix(key), JSON.stringify(data))
    } catch (error) {
      console.error(`Error storing ${key}:`, error)
    }
  }

  // 获取存储
  getStorage(key: string) {
    const prefixedKey = this.autoAddPrefix(key)
    // key 不存在判断
    const storageData = uni.getStorageSync(prefixedKey)
    if (!storageData) {
      return null
    }

    // 优化 持续使用中续期
    const storage = JSON.parse(storageData)
    const nowTime = Date.now()

    // 过期删除
    const setExpire = storage.expire || this.config.expire
    const expDiff = nowTime - storage.time
    if (setExpire < expDiff) {
      this.removeStorage(prefixedKey)
      return null
    } else {
      // 未过期期间被调用 则自动续期 进行保活
      this.setStorage(this.autoRemovePrefix(prefixedKey), storage.value, storage.expire)
      return storage.value
    }
  }

  // 是否存在存储
  hasStorage(key: string) {
    const prefixedKey = this.autoAddPrefix(key)
    const keys = uni.getStorageInfoSync().keys
    return keys.includes(prefixedKey)
  }

  // 获取所有存储的键
  getStorageKeys() {
    return this.getStorageAll().map((item) => item.key)
  }

  // 获取全部存储
  getStorageAll() {
    const keys = uni.getStorageInfoSync().keys
    const arr = []
    keys.forEach((key) => {
      arr.push({ key, val: uni.getStorageSync(key) })
    })
    return arr
  }

  // 删除存储
  removeStorage(key: string) {
    try {
      uni.removeStorageSync(this.autoAddPrefix(key))
    } catch (error) {
      console.error(`Error removing ${key}:`, error)
    }
  }

  // 清空存储
  clearStorage() {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  // 名称前自动添加前缀
  autoAddPrefix(key: string) {
    const prefix = this.config.prefix ? this.config.prefix + '_' : ''
    return prefix + key
  }

  // 移除已添加的前缀
  autoRemovePrefix(key: string) {
    const len = this.config.prefix ? this.config.prefix.length + 1 : 0
    return key.substr(len)
  }
}

// 创建 StorageManager 实例
const storageManager = new StorageManager()
export default storageManager
