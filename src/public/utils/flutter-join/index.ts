import permissionMessageBox from '@/public/components/permission-message-box/index'
import { platform, VITE_APP_PUBLIC_BASE } from '@/constants/env'
import storageManager from '@/public/utils/storage'

class FlutterJoin {
  isFlutter: boolean
  flutter_inappwebview: Window['flutter_inappwebview']
  callHandlerMethods: () => boolean

  constructor() {
    this.isFlutter = platform.isFlutterWebview
    this.callHandlerMethods = () => {
      if (this.isFlutter) {
        return true
      }
      return false
    }
  }

  // 检查是否在 Flutter 环境
  private checkFlutter(): boolean {
    if (!this.isFlutter) {
      console.error('flutter_inappwebview 为空')
      return false
    }
    return true
  }

  showAd = (adInfo: { type: string; position: string; androidId: string; iosId: string }) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('showAd', adInfo)
  }

  removeAdAt = (info: { position: string }) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('removeAdAt', info)
  }

  /** 友盟埋点 */
  umengReport = (statisticsKey: string) => {
    if (!this.checkFlutter()) return
    if (!statisticsKey) return
    return window.flutter_inappwebview.callHandler('umengStatistics', {
      statisticsKey: `fxb_${statisticsKey}`,
    })
  }

  /** 打开 webview 新页面 */
  openWebviewNewPage = (args: { url: string; title?: string }) => {
    if (!this.isFlutter) {
      if (platform.isMp) {
        uni.navigateTo({
          url: `/pages/web-view/index?url=${args.url}`,
        })
        return
      }
      window.location.href = args.url
      return
    }
    return window.flutter_inappwebview.callHandler('navigator', args)
  }

  /** 获取设备 uuid */
  getPlatformUuid = async (): Promise<{ uuid?: string }> => {
    if (!this.checkFlutter()) return {}
    try {
      const res = await window.flutter_inappwebview.callHandler('getPlatformUuid')
      return res || {}
    } catch (error) {
      console.error('Error getting platform uuid:', error)
      return {}
    }
  }

  /** 获取 did 设备唯一 */
  getPlatformDid = async (): Promise<{ did?: string }> => {
    const deviceId = storageManager.getStorage('fxb-h5-deviceId')
    if (deviceId && deviceId !== 'undefined') {
      return { did: deviceId }
    }
    try {
      const res = await window.flutter_inappwebview.callHandler('getPlatformDid')
      const data = res && res.did ? res : { did: '' }
      storageManager.setStorage('fxb-h5-deviceId', data.did)
      return data
    } catch (error) {
      console.error('Error getting platform did:', error)
      return { did: '' }
    }
  }

  /** 获取定位 */
  getLocation = async () => {
    if (!this.checkFlutter()) return {}
    try {
      const res = await window.flutter_inappwebview.callHandler('getLocation')
      // const { adCode } = res || {}
      // if (adCode) {
      //   /** 缓存一份定位 解决后台放置过久导致没有返回 adCde */
      //   storageManager.setStorage('appLocation', res)
      // }
      return res || {}
    } catch (error) {
      console.error('Error getting location:', error)
      return {}
    }
  }

  /** 重新获取定位 */
  resetLocation = async () => {
    if (!this.checkFlutter()) return {}
    try {
      const res = await window.flutter_inappwebview.callHandler('resetLocation')
      return res || {}
    } catch (error) {
      console.error('Error resetting location:', error)
      return {}
    }
  }

  scanQRCode = async (data: { tip: string }) => {
    if (!this.checkFlutter()) return
    // const removeMessageBox = await this.permissionPrompts(
    //   'saveLocalImage',
    //   data?.tip || '保存图片需要您的相册存储权限',
    //   '相册存储权限使用说明',
    // )
    try {
      const res = await window.flutter_inappwebview.callHandler('scanQRCode')
      // if (typeof removeMessageBox === 'function') removeMessageBox()
      return res
    } catch (err) {
      // if (typeof removeMessageBox === 'function') removeMessageBox()
      return {}
    }
  }

  /** 获取定位权限 */
  getLocationPermissionStatus = async (data: {
    locationTip?: string
  }): Promise<{ hasLocationPermission: boolean }> => {
    if (!this.checkFlutter()) return Promise.reject({ hasLocationPermission: false })
    if (data.locationTip) {
      try {
        await this.permissionPrompts('location', data.locationTip, '位置权限使用说明')
        try {
          const res = await window.flutter_inappwebview.callHandler('getLocationPermissionStatus')
          return res
        } catch (err) {
          return Promise.reject({ hasLocationPermission: false })
        }
      } catch (err) {
        return Promise.reject({ hasLocationPermission: false })
      }
    }
    return window.flutter_inappwebview.callHandler('getLocationPermissionStatus')
  }

  /** 保存网络图片 */
  saveImage = (src: string) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('saveImage', [src])
  }

  saveLocalImage = async (data: { img: string; tip?: string }) => {
    if (!this.checkFlutter()) return
    await this.permissionPrompts(
      'saveLocalImage',
      data?.tip || '保存图片需要您的相册存储权限',
      '相册存储权限使用说明',
    )
    try {
      const res = await window.flutter_inappwebview.callHandler('saveLocalImage', data)
      return res
    } catch (err) {}
  }

  getUserInfo = async (): Promise<{
    nickname: string
    avatarUrl: string
    mobile: string
  }> => {
    if (!this.checkFlutter()) return Promise.reject(new Error('flutter_inappwebview 为空'))
    try {
      const res = await window.flutter_inappwebview.callHandler('getUserInfo')
      return res || {}
    } catch (err) {
      return Promise.reject(new Error('flutter_inappwebview 为空'))
    }
  }

  goBack = () => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('goBack')
  }

  navigatorAppPage = (args: { url: string; params?: any }) => {
    if (!this.isFlutter) {
      if (platform.isH5) {
        window.location.href = args.url
      }
      return
    }
    return window.flutter_inappwebview.callHandler('navigatorAppPage', args)
  }

  // 通过浏览器打开新页面,或者打开app
  launchUrl(params: string) {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('launchUrl', params)
  }

  // 微信分享
  shareToWeChat = (data: {
    url?: string // 分享链接
    imgUrl?: string // 分享图片地址
    title: string // 分享标题
    text?: string // 分享文本
    description: string // 分享描述
    type: 'timeline' | 'friends' // 分享类型  timeline 朋友圈 friends 好友
  }) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('shareToWeChat', data)
  }

  // 打开微信小程序
  launchWeChatMiniProgram = (data: {
    username: string
    path: string
    miniProgramType?: 'PREVIEW' | 'RELEASE'
  }) => {
    if (!this.checkFlutter()) return
    // const miniProgramType = VITE_APP_ENV === 'test'? 'PREVIEW' : 'RELEASE';
    const miniProgramType = 'RELEASE'
    return window.flutter_inappwebview.callHandler('launchWeChatMiniProgram', {
      miniProgramType,
      ...data,
    })
  }

  weChatBusinessView = (queryStr: string) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('weChatBusinessView', queryStr)
  }

  openEmbeddedMiniProgram = (data: UniNamespace.OpenEmbeddedMiniProgramOption) => {
    if (!this.isFlutter) {
      uni.openEmbeddedMiniProgram({
        appId: data.appId,
        path: data.path,
        envVersion: 'release',
      })
      return
    }
    // const miniProgramType = VITE_APP_ENV === 'test'? 'PREVIEW' : 'RELEASE';
    const miniProgramType = 'RELEASE'
    return window.flutter_inappwebview.callHandler('launchWeChatMiniProgram', {
      miniProgramType,
      ...data,
    })
  }

  getAppInfo = () => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('getAppInfo')
  }

  getAppServerInfo = () => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('getAppServerInfo')
  }

  loginWithWeChat = (): Promise<{ errorCode: number; code: string }> => {
    if (!this.checkFlutter()) return Promise.reject(new Error('flutter_inappwebview 为空'))
    return window.flutter_inappwebview.callHandler('loginWithWeChat')
  }

  getPhoneFromWeChat = (data: { userName: string; url: string; isRelease: boolean }) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('getPhoneFromWeChat', data)
  }

  showRewardVideo = (data: {
    userId: string
    options: Record<string, string>
    placementId: string
    env: 'test' | 'prod'
  }) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('showRewardVideo', data)
  }

  getDeviceInfo = async () => {
    if (!this.checkFlutter()) return { top: 10 }
    try {
      return window?.flutter_inappwebview?.callHandler('getDeviceInfo')
    } catch (error) {
      console.error('Error getting device info:', error)
      return { top: 10 }
    }
  }

  selectImage = async () => {
    if (!this.checkFlutter()) return
    await this.permissionPrompts('selectImage', '修改头像需要使用您的相机或者相册')
    try {
      const res = await window.flutter_inappwebview.callHandler('selectImage')
      return res
    } catch (err) {
      return { result: '' }
    }
  }

  // 微信支付
  wechatPay = (data: {
    appid: string
    partnerid: string
    prepayid: string
    packageValue: string
    noncestr: string
    timestamp: string
    sign: string
  }): Promise<{
    // 0 支付成功 -1 支付失败 -2 用户取消
    code: 0 | -1 | -2
  }> => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('wechatPay', data)
  }

  // 获取权限状态
  getPermissionStatus = async (permissionStr: 'camera' | 'photos' | 'location' | 'storage') => {
    if (!this.checkFlutter()) return
    try {
      return window.flutter_inappwebview.callHandler('getPermissionStatus', permissionStr)
    } catch (error) {
      console.error(`Error getting ${permissionStr} permission status:`, error)
    }
  }

  showAdDialog = (params: {
    url: string
    width: number
    height: number
    adHeight: number
    adId?: string
  }) => {
    if (!this.checkFlutter()) return
    const { origin } = window.location
    return window.flutter_inappwebview.callHandler('showAdDialog', {
      ...params,
      url: `${origin}${VITE_APP_PUBLIC_BASE}/#/subpackages/model${params.url}`,
    })
  }

  onUserEvent = (params: any) => {
    if (!this.checkFlutter()) return
    return window.flutter_inappwebview.callHandler('onUserEvent', params)
  }

  // 权限提示
  private permissionPrompts = (key: string, tip: string, permissionTitle?: string) => {
    return new Promise(async (resolve, reject) => {
      const listForPermissions = storageManager.getStorage('listForPermissions') || {}
      if (listForPermissions[key] === 'refused' && key === 'location') {
        return reject(new Error('用户拒绝获取定位'))
      }
      if (listForPermissions[key] !== 'agree') {
        permissionMessageBox.show(
          {
            title: permissionTitle || '提示',
            confirmBtnText: '确定',
            content: tip || '申请使用权限',
          },
          {
            confirmCallback: async (action) => {
              const listForPermissions = storageManager.getStorage('listForPermissions') || {}
              storageManager.setStorage('listForPermissions', {
                ...listForPermissions,
                [key]: 'agree',
              })
              resolve({})
            },
            cancelCallback: (action) => {
              storageManager.setStorage('listForPermissions', {
                ...listForPermissions,
                [key]: 'refused',
              })
              reject(new Error('用户拒绝获取权限'))
            },
          },
        )
        return
      }
      resolve(() => {})
    })
  }
}

const flutterApi = new FlutterJoin()
export default flutterApi
