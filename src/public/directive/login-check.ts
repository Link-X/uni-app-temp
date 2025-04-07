import type { App } from 'vue'
import qs from 'qs'
import { useUserStore } from '@/store'
import { currRoute } from '@/public/utils/methods'

export const loginCheck = (app: App<Element>) => {
  const auth = (e) => {
    if (!useUserStore().userInfo.token) {
      e.stopPropagation()
      const { path, query } = currRoute()
      const redirect = `${path}?${qs.stringify(query) || ''}`
      uni.reLaunch({
        url: `/pages/login/index?redirect=${encodeURIComponent(redirect)}`,
      })
    }
  }
  app.directive('loginCheck', {
    mounted(el, binding) {
      el.addEventListener('click', auth, { capture: true })
    },
    beforeUnmount(el, binding) {
      el.removeEventListener('click', auth)
    },
  })
}
