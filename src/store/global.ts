import { defineStore } from 'pinia'
import { ref } from 'vue'
import flutterApi from '@/public/utils/flutter-join/index'
import { deepFreeze } from '@/public/utils/methods'
import { isDev } from '@/constants/env'

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
}

export type IGlobalState = typeof initState

const { onAuditStatusReady } = useAuditStatus()

export const useGlobalStore = defineStore(
  'global',
  () => {
    const globalState = ref<IGlobalState>({ ...initState })

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
      const params = handleUrlParams(opt)
      getDeviceInfo()
      window.addEventListener('flutterInAppWebViewPlatformReady', async function () {
        getDeviceInfo()
        onAuditStatusReady((auditStatus) => {
          // 如果审核状态为 true，则执行更新app 逻辑
          if (auditStatus) {
            useForceAnUpdateToTheApp(params.appVersion)
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
