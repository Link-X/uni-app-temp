import '@/style/index.scss'
import 'virtual:uno.css'
import { createSSRApp } from 'vue'

import App from './App.vue'
import { prototypeInterceptor } from './interceptors'
import store from './store'
import { loginCheck } from '@/public/directive'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(prototypeInterceptor)
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('wx-open-launch-weapp')
  }
  loginCheck(app)
  return {
    app,
  }
}
