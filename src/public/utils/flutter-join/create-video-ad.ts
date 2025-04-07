import flutterApi from '@/public/utils/flutter-join'
import { envJson } from '@/constants/env'

type flutterAdUtilsProps = {
  adId: string
}

export type videoAdOptions = {
  taskId: string
  summeryId: string
  sign: string
  timeStamp: number
}
export type pullUpTheVideoADParams = {
  // 用户id
  userId: string
  // 其他参数
  options: videoAdOptions
}
export type videoAdResult = {
  isEnded: boolean
  transId: string
  key: string
}

class FlutterAdUtils {
  adId: string
  // 封装 state 属性
  private state: {
    isEnded: boolean
    transId: string
  }

  resolve: (value: any) => void
  reject: (reason?: any) => void
  // 事件监听器的目标对象
  // private eventTarget: EventTarget

  constructor(props: flutterAdUtilsProps) {
    this.adId = props.adId
    this.state = {
      isEnded: false,
      transId: '',
    }
    // this.eventTarget = new EventTarget()
  }

  // 广告获得奖励
  onAdReward = (
    placementId: string,
    res: {
      isReward: boolean
      customData: any
      transId: string
      userId: string
    },
  ) => {
    console.log('flutter-获得奖励')
    const { transId } = res
    this.state = {
      isEnded: res.isReward,
      transId,
    }
  }

  // 关闭广告
  onAdClosed = () => {
    console.log('flutter-关闭广告')
    this.resolve({ isEnded: this.state.isEnded, transId: this.state.transId, key: 'onAppAdClose' })
    this.destroy()
  }

  // 广告被点击
  onAdClicked = () => {
    console.log('flutter-广告被点击')
  }

  // 广告加载失败
  onAdFailedToLoad = () => {
    this.reject(new Error('广告加载失败'))
    this.destroy()
  }

  // 广告加载成功
  onAdLoaded = () => {
    console.log('flutter-广告加载成功')
  }

  // 广告跳过
  onAdSkiped = () => {
    console.log('flutter-广告跳过')
    this.resolve({ isEnded: this.state.isEnded, transId: this.state.transId, key: 'onAdSkiped' })
    this.destroy()
  }

  // 广告开始展示失败
  onAdShowError = () => {
    console.log('flutter-广告开始展示失败')
    this.reject(new Error('广告开始展示失败'))
  }

  // 广告视频播放结束
  onAdVideoPlayFinished = () => {
    console.log('flutter-广告视频播放结束')
  }

  onAdOpened = () => {
    console.log('flutter-onAdOpened')
  }

  addEventListener() {
    window.onAdReward = this.onAdReward.bind(this)
    window.onAdClosed = this.onAdClosed.bind(this)
    window.onAdShowError = this.onAdShowError.bind(this)
    window.onAdClicked = this.onAdClicked.bind(this)
    window.onAdLoaded = this.onAdLoaded.bind(this)
    window.onAdFailedToLoad = this.onAdFailedToLoad.bind(this)
    window.onAdVideoPlayFinished = this.onAdVideoPlayFinished.bind(this)
    window.onAdSkiped = this.onAdSkiped.bind(this)
    window.onAdOpened = this.onAdOpened.bind(this)
  }

  destroy() {
    window.onAdReward = null
    window.onAdClosed = null
    window.onAdShowError = null
    window.onAdClicked = null
    window.onAdLoaded = null
    window.onAdFailedToLoad = null
    window.onAdVideoPlayFinished = null
    window.onAdSkiped = null
    window.onAdOpened = null
  }

  getVideoParams(params: pullUpTheVideoADParams): {
    userId: string
    options: Record<string, string>
    placementId: string
    env: 'test' | 'prod'
  } {
    const { userId, options } = params || {}
    const { taskId, summeryId, timeStamp, ...rest } = options || {}
    const env = envJson.isDev ? 'test' : 'prod'
    // 使用 Object.entries 和 reduce 处理对象属性转换
    const strOptions = Object.entries({
      ...rest,
      taskId: `${taskId}`,
      summeryId: `${summeryId}`,
      timeStamp: `${timeStamp}`,
      env,
    }).reduce((acc, [key, value]) => ({ ...acc, [key]: `${value}` }), {})
    return {
      placementId: this.adId,
      userId: `${userId}`,
      options: strOptions,
      env,
    }
  }

  show(params: pullUpTheVideoADParams): Promise<videoAdResult> {
    this.addEventListener()
    return new Promise(async (resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      try {
        await flutterApi.showRewardVideo(this.getVideoParams(params))
        this.state = {
          isEnded: false,
          transId: '',
        }
      } catch (err) {
        this.reject(err)
      }
    })
  }
}

export default FlutterAdUtils
