import fetchUtils from '@cb-public/fetch-utils'
import { shopServerHeader, md5Key } from '@/constants/config.json'
import { VITE_SERVER_BASEURL } from '@/constants/env'
import { useUserStore } from '@/store'
import catchError from './catch-error'
import type { RequestSuccessCallbackResult } from '@cb-public/fetch-utils/dist/types'

type parameterType = {
  [key: string]: any
}
type fetchFunction = <T>(data: UniApp.RequestOptions) => Promise<RequestSuccessCallbackResult<T>>

const fetchInstance = fetchUtils.createInstance({
  baseUrl: VITE_SERVER_BASEURL,
  signData: {
    type: '',
    md5PrivateKey: md5Key,
  },
  headers: {
    ...shopServerHeader,
  },
  timeout: 10000, // 设置超时时间为 10 秒
})

// 添加 header 变量
const addHeaderVar = (header: Record<string, string> = {}, data: parameterType) => {
  const { token } = useUserStore().userInfo
  return {
    token,
    // 'cg-ac': 'ha.xinx.luckydraw.platform',
    'cg-ac': shopServerHeader['cg-ac'],
    'cg-av': '1',
    'cg-am': '1',
    ...header,
  }
}

// 请求拦截器
fetchInstance.interceptors.request.use(
  (data) => {
    data.header = addHeaderVar(data.header, data)
    return data
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
fetchInstance.interceptors.response.use(
  (res) => {
    catchError.catch(res?.data?.code, res).then((catchResult) => {
      if (!catchResult.success) {
        console.error('响应错误:', catchResult)
      }
    })
    return res
  },
  (error) => {
    console.error('响应拦截器错误:', error)
    catchError.catch(-100, { error: '网络异常，请稍后再试!' }).then((catchResult) => {
      if (!catchResult.success) {
        console.error('响应错误:', catchResult)
      }
    })
    return Promise.reject(error)
  },
)

export const get: fetchFunction = (data) => {
  return fetchInstance.get(data)
}
export const post: fetchFunction = (data) => {
  return fetchInstance.post(data)
}
export const put: fetchFunction = (data) => {
  return fetchInstance.put(data)
}
export const deleteFun: fetchFunction = (data) => {
  return fetchInstance.delete(data)
}

// 获取 sign 和服务器 time
export const sign = (data) => {
  return fetchInstance.sign(data)
}
