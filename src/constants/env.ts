export const VITE_SERVER_BASEURL = import.meta.env.VITE_SERVER_BASEURL
export const VITE_RICH_BASE = import.meta.env.VITE_RICH_BASE
export const VITE_VERSION = import.meta.env.VITE_VERSION

export const isH5 = __UNI_PLATFORM__ === 'h5'
export const isApp = __UNI_PLATFORM__ === 'app'
export const isMp = __UNI_PLATFORM__.startsWith('mp-')
export const isFlutterWebview = !!window?.flutter_inappwebview

export const isIOS = (() => {
  const { platform } = uni.getSystemInfoSync()
  return platform === 'ios'
})()

export const isAndroid = (() => {
  const { platform } = uni.getSystemInfoSync()
  return platform.toLocaleLowerCase() === 'android'
})()

export const platform = {
  platform: __UNI_PLATFORM__,
  isH5,
  isApp,
  isMp,
  isFlutterWebview,
  isIOS,
  isAndroid,
}

// 是否本地开发环境
export const isDev = import.meta.env.VITE_APP_ENV === 'dev'
export const isProd = import.meta.env.VITE_APP_ENV === 'prod'
// dev和test
// export const isTest = import.meta.env.VITE_NODE_ENV === 'development'
export const VITE_APP_PUBLIC_BASE = import.meta.env.VITE_APP_PUBLIC_BASE
export const VITE_WEB_URL = import.meta.env.VITE_WEB_URL

export const envJson = {
  isDev,
  isProd,
}
