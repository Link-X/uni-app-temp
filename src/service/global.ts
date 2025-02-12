import { get, post } from '@/public/utils/request/index'
import { VITE_RICH_BASE } from '@/constants/env'

export const getReleasedData = (data: { bannerCode: string }) => {
  return get({
    url: `${VITE_RICH_BASE}/distribution/api/content/v1/getBannerInfo`,
    method: 'GET',
    data,
  })
}
export const getExclusiveConfig = (data: { code: string }) => {
  return get({
    url: `${VITE_RICH_BASE}/distribution/api/content/v1/getExclusiveConfig`,
    method: 'GET',
    data,
  })
}

// 微信登录
export const wxMiniProgramLogin = (data) => {
  return post({
    url: `/user/login`,
    method: 'POST',
    data,
  })
}
