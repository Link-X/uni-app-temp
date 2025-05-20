import { defineStore } from 'pinia'
import { ref } from 'vue'
import flutterApi from '@/public/utils/flutter-join/index'
import { deepFreeze } from '@/public/utils/methods'
import { isDev, isFlutterWebview, isH5 } from '@/constants/env'

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
    tabbarContentHeight: '95vh',
    tabbarHeight: '110rpx',
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
        if (!tabDom || isFlutterWebview || isH5) {
          const height = tabDom?.getBoundingClientRect()?.height
          const contentHeight = info.screenHeight - height
          globalState.value.setting.tabbarHeight = height + 'px'
          globalState.value.setting.tabbarContentHeight = `${contentHeight}px`
        } else {
          const height = uni.upx2px(110)
          const contentHeight = info.screenHeight - height
          globalState.value.setting.tabbarHeight = height + 'px'
          globalState.value.setting.tabbarContentHeight = `${contentHeight}px`
        }
      })
    }

    // 获取设备信息
    const getDeviceInfo = async () => {
      try {
        const res = await flutterApi.getDeviceInfo()
        console.log(deepFreeze(res))
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
      globalState,
      install,
    }
  },
  {
    persist: true,
  },
)
