import { defineStore } from 'pinia'
import { ref } from 'vue'
import flutterApi from '@/public/utils/flutter-join/index'
import { deepFreeze } from '@/public/utils/methods'
import { isDev, isFlutterWebview, platform } from '@/constants/env'

const initState = {
  deviceInfo: {
    top: 20,
    pixelRatio: 0,
  },
  appInfo: {
    source: '',
    appVersion: '',
    channel: '',
    auditStatus: false,
  },
  setting: {
    seniorCitizenMode: false,
    normalSize: undefined,
    largerSize: undefined,
    tabbarContentHeight: undefined,
    tabbarHeight: 110,
  },
}

export type IGlobalState = typeof initState

const { onAuditStatusReady } = useAuditStatus()

export const useGlobalStore = defineStore(
  'global',
  () => {
    const globalState = ref<IGlobalState>({ ...initState })

    const getTabbarContent = () => {
      nextTick(() => {
        const info = uni.getSystemInfoSync()
        const tabDom = document?.querySelector('.uni-tabbar')
        if (tabDom || isFlutterWebview || platform.isH5) {
          const height = tabDom?.getBoundingClientRect()?.height
          const contentHeight = info.screenHeight - height
          globalState.value.setting.tabbarHeight = height
          globalState.value.setting.tabbarContentHeight = contentHeight
        } else if (platform.isMp) {
          const { screenHeight, windowHeight } = info
          const tabBarHeight = screenHeight - windowHeight
          const contentHeight = info.screenHeight - tabBarHeight
          globalState.value.setting.tabbarHeight = tabBarHeight
          globalState.value.setting.tabbarContentHeight = contentHeight
        }
      })
    }

    // 获取设备信息
    const getDeviceInfo = async () => {
      try {
        const res = await flutterApi.getDeviceInfo()
        globalState.value.deviceInfo = deepFreeze(res)
      } catch (err) {
        console.error(err)
      }
    }

    // 处理url携带的信息
    const handleUrlParams = (opt) => {
      const { query = {} } = opt || {}
      const { applicationSource, appVersion, channel, auditStatus } = query || {}
      const appInfo = globalState.value.appInfo || {}
      const params = {
        source: applicationSource || appInfo.source,
        appVersion: appVersion || appInfo.appVersion,
        channel: channel || appInfo.channel,
        auditStatus: auditStatus || appInfo.auditStatus,
      }
      globalState.value.appInfo = deepFreeze(params)
      return params
    }

    // 初始化 app 信息
    const appEntryInit = (opt) => {
      if (!isFlutterWebview) return
      const params = handleUrlParams(opt)
      getDeviceInfo()
      window.addEventListener('flutterInAppWebViewPlatformReady', async function () {
        getDeviceInfo()
        onAuditStatusReady((auditStatus) => {
          // 如果审核状态为 true，则执行更新app 逻辑
          if (auditStatus) {
            // useForceAnUpdateToTheApp(params.appVersion)
          }
          const readyInfo = {
            auditStatus,
            ...params,
          }
          globalState.value.appInfo = deepFreeze(readyInfo)
        })
      })
    }

    const install = (opt) => {
      getTabbarContent()
      appEntryInit(opt)
    }

    return {
      getTabbarContent,
      globalState,
      install,
    }
  },
  {
    persist: true,
  },
)
