declare const __UNI_PLATFORM__:
  | 'h5'
  | 'app'
  | 'mp-alipay'
  | 'mp-baidu'
  | 'mp-jd'
  | 'mp-kuaishou'
  | 'mp-lark'
  | 'mp-qq'
  | 'mp-toutiao'
  | 'mp-weixin'
  | 'quickapp-webview'
  | 'quickapp-webview-huawei'
  | 'quickapp-webview-union'

declare const __VITE_APP_PROXY__: 'true' | 'false'

declare namespace JSX {
  interface IntrinsicElements {
    template: any
    block: any
  }
}
type CallHandlerMethod =
  | 'showAd'
  | 'removeAdAt'
  | 'umengReport'
  | 'umengStatistics'
  | 'navigator'
  | 'getPlatformUuid'
  | 'getPlatformDid'
  | 'getLocation'
  | 'resetLocation'
  | 'getDeviceInfo'
  | 'scanQRCode'
  | 'saveImage'
  | 'saveLocalImage'
  | 'getUserInfo'
  | 'getLocationPermissionStatus'
  | 'shareToWeChat'
  | 'launchUrl'
  | 'launchWeChatMiniProgram'
  | 'loginWithWeChat'
  | 'getPhoneFromWeChat'
  | 'showRewardVideo'
  | 'getAppInfo'
  | 'getAppServerInfo'
  | 'selectImage'
  | 'getPermissionStatus'
  | 'wechatPay'
  | 'goBack'
  | 'navigatorAppPage'
  | 'showAdDialog'
  | 'onUserEvent'

type CallHandler = <T>(method: CallHandlerMethod, params?: any) => Promise<T>
interface Window {
  flutter_inappwebview: {
    callHandler: CallHandler
  }
  onAdReward: (data: any) => void
  onAdClosed: (data: any) => void
  onAdShowError: (data: any) => void
  onAdClicked: (data: any) => void
  onAdLoaded: (data: any) => void
  onAdFailedToLoad: (data: any) => void
  onAdVideoPlayFinished: (data: any) => void
  onAdSkiped: (data: any) => void
  onAdOpened: (data: any) => void
}
