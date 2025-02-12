import { reactive, provide } from 'vue'

import flutterApi from '@/public/utils/flutter-join'
import { useUserStore } from '@/store/user'

export type LogoState = typeof initState
const initState = {
  show: true,
  loadingIn: false,
}
const logoState = reactive<LogoState>(initState)
const userStore = useUserStore()

export default ({ authorize } = {} as any) => {
  const verify = () => {
    return userStore.loggingStatus
  }

  const open = () => {
    logoState.show = true
  }

  // 获取微信登录授权
  const getWeChatLogoAuth = async () => {
    const wexRes = await flutterApi.loginWithWeChat()
    if (+wexRes?.errorCode === 0) {
      return wexRes.code
    }
  }

  const callBack = (params) => {
    authorize && authorize(params)
  }

  const signIn = async () => {
    logoState.loadingIn = true
    try {
      const code = await getWeChatLogoAuth()
      logoState.loadingIn = false
      callBack({
        type: 'login',
        code,
      })
      return code
    } catch (err) {
      logoState.loadingIn = false
    }
  }

  const register = () => {
    alert('注册')
    logoState.loadingIn = false
    callBack({
      type: 'register',
    })
  }

  const reset = () => {
    logoState.show = false
    logoState.loadingIn = false
  }

  return {
    signIn,
    register,
    open,
    reset,
    state: logoState,
    verify,
  }
}
