import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化
import storageManager from '@/public/utils/storage'

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: storageManager.getStorage,
      setItem: storageManager.setStorage,
    },
  }),
)

export default store

// 模块统一导出
export * from './user'
export * from './global'
