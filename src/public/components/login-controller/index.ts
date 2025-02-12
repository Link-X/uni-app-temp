import { createApp, inject } from 'vue'
import loginRegistrationPopup from './login-registration-popup.vue'
import useLogo from './use-controller'

const useLogoController = useLogo({})

// 验证登录
loginRegistrationPopup.verify = () => {
  return useLogoController.verify()
}

// 打开登录弹窗
loginRegistrationPopup.open = ({ cancelCallback, authorize }) => {
  if (document.getElementById('login-interface-container')) {
    return
  }
  const containerBox = document.createElement('div')
  containerBox.setAttribute('id', 'login-interface-container')
  document.body.appendChild(containerBox)

  function closePopup() {
    DialogApp.unmount()
    containerBox.remove()
    useLogoController.reset()
    if (cancelCallback) cancelCallback()
  }

  const DialogApp = createApp(loginRegistrationPopup, {
    closePopup,
    authorize,
  })
  DialogApp.mount(containerBox)
  useLogoController.open()

  const navigateToInterceptor = {
    invoke({ url }) {
      if (!DialogApp || !containerBox) return
      closePopup()
    },
  }
  uni.removeInterceptor('navigateTo')
  uni.removeInterceptor('reLaunch')
  uni.removeInterceptor('redirectTo')
  uni.removeInterceptor('switchTab')

  uni.addInterceptor('navigateTo', navigateToInterceptor)
  uni.addInterceptor('reLaunch', navigateToInterceptor)
  uni.addInterceptor('redirectTo', navigateToInterceptor)
  uni.addInterceptor('switchTab', navigateToInterceptor)
}

export default loginRegistrationPopup
