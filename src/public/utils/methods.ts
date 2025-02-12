import { platform } from '@/constants/env'
import { pages, subPackages, tabBar } from '@/pages.json'

// 获取系统版本
export const getOsVersion = () => {
  if (platform.isMp) return () => ({ osName: 'mp-weixin', version: '1.0.0' })
  const u = navigator.userAgent
  let version = ''
  let osName = ''
  return () => {
    if (version && osName)
      return {
        osName,
        version,
      }
    if (u.indexOf('Mac OS X') > -1) {
      // ios
      const regStr_saf = /OS [\d._]*/gi
      const verinfo = u.match(regStr_saf)
      version = 'ios' + (verinfo + '').replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.')
      osName = 'ios'
    } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      // android
      version =
        'Android' +
        u.substr(
          u.indexOf('Android') + 8,
          u.indexOf(';', u.indexOf('Android')) - u.indexOf('Android') - 8,
        )
      osName = 'Android'
    } else if (u.indexOf('BB10') > -1) {
      // 黑莓bb10系统
      version =
        'blackberry' +
        u.substr(u.indexOf('BB10') + 5, u.indexOf(';', u.indexOf('BB10')) - u.indexOf('BB10') - 5)
      osName = 'blackberry'
    } else if (u.indexOf('IEMobile') > -1) {
      // windows phone
      version =
        'winphone' +
        u.substr(
          u.indexOf('IEMobile') + 9,
          u.indexOf(';', u.indexOf('IEMobile')) - u.indexOf('IEMobile') - 9,
        )
      osName = 'winphone'
    } else {
      const userAgent = navigator.userAgent.toLowerCase()
      osName = 'Windows'
      if (userAgent.indexOf('windows nt 5.0') > -1) {
        version = 'Windows 2000'
      } else if (
        userAgent.indexOf('windows nt 5.1') > -1 ||
        userAgent.indexOf('windows nt 5.2') > -1
      ) {
        version = 'Windows XP'
      } else if (userAgent.indexOf('windows nt 6.0') > -1) {
        version = 'Windows Vista'
      } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
        version = 'Windows 7'
      } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
        version = 'Windows 8'
      } else if (userAgent.indexOf('windows nt 6.3') > -1) {
        version = 'Windows 8.1'
      } else if (
        userAgent.indexOf('windows nt 6.2') > -1 ||
        userAgent.indexOf('windows nt 10.0') > -1
      ) {
        version = 'Windows 10'
      } else {
        osName = 'Unknown'
        version = 'Unknown'
      }
    }
    return {
      version,
      osName,
    }
  }
}

const getLastPage = () => {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包回报错，所以改用下面这个【虽然我加了src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  const lastPage = getLastPage()
  const currPath = lastPage.route
  return !!tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  const lastPage = getLastPage()
  const currRoute = (lastPage as any).$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  // console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(fullPath)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?')
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {},
    }
  }
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}
/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

// 一个异步任务完成，执行回调
export const asyncTaskDone = () => {
  const cbArray: any[] = []
  let readyResolve: (value: unknown) => void = () => {}
  let finishData: any = null
  const readyPromise = new Promise((resolve) => {
    readyResolve = resolve
  })
  readyPromise.then((res) => {
    finishData = res || true
    const len = cbArray.length
    for (let i = 0; i < len; i++) {
      const fn = cbArray.pop()
      try {
        fn(res)
      } catch (err) {
        console.error(err)
      }
    }
  })
  const onReady = (cb: (res: any) => void, key?: string) => {
    if (finishData) {
      // 如果已经完成了直接执行
      return cb(finishData)
    }
    cbArray.push(cb)
  }
  return {
    onReady,
    readyResolve,
  }
}

export function deepFreeze(obj: any): any {
  if (!obj) return {}
  const propsNames = Object.getOwnPropertyNames(obj)
  propsNames.forEach((item) => {
    const props = obj?.[item]
    if (!props) return
    if (props instanceof Object && props !== null) {
      return deepFreeze(props)
    }
  })

  return Object.freeze(obj)
}
