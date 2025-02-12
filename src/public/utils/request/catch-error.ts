import qs from 'qs'
import { useUserStore } from '@/store/user'
import { currRoute } from '@/public/utils/methods'
import { tabBar } from '@/pages.json'

type ShowModalRes = {
  /**
   * 为 true 时，表示用户点击了确定按钮
   */
  confirm: boolean
  /**
   * 为 true 时，表示用户点击了取消
   */
  cancel: boolean
  /**
   * editable 为 true 时，用户输入的文本
   */
  content?: string
}
class ErrorHandler {
  // 控制是否显示登录模态对话框
  private isLoginModalVisible: boolean
  // 存储不允许跳转的页面路径数组
  private nonJumpablePaths: Array<string>

  constructor() {
    this.isLoginModalVisible = false
    this.nonJumpablePaths = [...tabBar.list.map((v) => v.pagePath), '/pages/login/index']
  }

  // 显示模态对话框
  private showModal(options): Promise<ShowModalRes> {
    return new Promise((resolve) => {
      uni.showModal({
        ...options,
        success: resolve,
      })
    })
  }

  // 导航回上一页并显示提示
  private navigateBackWithPrompt(data) {
    this.showModal({
      title: '温馨提示',
      content: data.msg,
      confirmText: '确定',
      showCancel: false,
    }).then(() => {
      uni.navigateBack()
    })
  }

  // 处理 token 过期
  private handleTokenExpired(resolve: any) {
    if (this.isLoginModalVisible) return
    this.isLoginModalVisible = true
    // 登录
    this.showModal({
      title: '提示',
      content: '身份校验过期，请重新登录',
      confirmText: '确定',
      showCancel: false,
    }).then((ret) => {
      try {
        // * *好多接口没处理 ajax 请求错误这里主动调一下 hideLoading */
        uni.hideLoading()
        resolve({ success: false, reset: false })
        if (!ret.confirm) return
        useUserStore().clearUserInfo()
        const { path, query } = currRoute()
        const redirect = `${path}?${qs.stringify(query) || ''}`
        if (!this.shouldJump(path)) return
        uni.reLaunch({
          url: `/pages/login/index?redirect=${encodeURIComponent(redirect)}`,
        })
      } finally {
        this.isLoginModalVisible = false
      }
    })
  }

  // 检查是否应该跳转
  private shouldJump(path: string): boolean {
    return this.nonJumpablePaths.filter((v) => v.includes(path)).length === 0
  }

  // 处理通用错误
  private handleGeneralError(data: any, resolve: any) {
    this.showModal({
      title: '温馨提示',
      content: this.getErrorMessage(data),
      showCancel: false,
    }).then(() => {
      resolve({ success: false })
    })
  }

  // 获取错误信息
  private getErrorMessage(data: any): string {
    let content =
      data.data.msg ||
      data.data.error ||
      data.data.errorMessage ||
      data.data.errMsg ||
      '网络异常，请稍后再试'
    if (data?.errMsg?.includes('request:fail')) {
      content = '网络异常，请稍后再试'
    }
    return content
  }

  async catch(
    code: number,
    data: any,
    url?: string,
  ): Promise<{
    success: boolean
    reset?: boolean
  }> {
    return new Promise((resolve) => {
      if (+code === 0) {
        resolve({ success: true })
        return
      }
      const errorHandlers = {
        403: () => this.handleTokenExpired(resolve),
        104006: () => this.handleTokenExpired(resolve),
        6004: () => this.navigateBackWithPrompt(data),
        default: () => this.handleGeneralError(data, resolve),
      }
      // 调用相应的错误处理函数
      ;(errorHandlers[code] || errorHandlers.default)()
    })
  }
}

const errorCallback = new ErrorHandler()

export default errorCallback
