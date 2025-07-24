class ImageJSsdk {
  // 支持的图片扩展名
  private readonly imageExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']

  // 图片尺寸映射表
  private readonly imageSizeMap: Record<string, string> = {
    listImage: '@h240',
    previewImage: '@h480',
    detailsImage: '',
  }

  /**
   * 手动解析URL为协议和路径（适配微信小程序）
   * @param url 完整URL字符串
   * @returns 包含协议和路径的对象，无效URL返回null
   */
  parseUrl(url: string): { protocol: string; pathname: string } | null {
    if (!url) return null

    try {
      // 匹配协议部分 (http:, https: 等)
      const protocolMatch = url.match(/^([a-zA-Z]+:)/)
      if (!protocolMatch) {
        console.error('URL缺少协议部分')
        return null
      }
      const protocol = protocolMatch[1]

      // 移除协议部分后处理路径
      const pathStart = url.indexOf('//') === -1 ? protocol.length : url.indexOf('//') + 2
      const pathname = url.substring(pathStart)

      return { protocol, pathname }
    } catch (err) {
      console.error('URL解析错误:', err)
      return null
    }
  }

  /**
   * 判断URL是否为图片
   * @param urlObj 解析后的URL对象
   * @returns 是否为图片的布尔值
   */
  isImageUrl(urlObj: ReturnType<ImageJSsdk['parseUrl']>): boolean {
    if (!urlObj) return false

    try {
      const lastDotIndex = urlObj.pathname.lastIndexOf('.')
      if (lastDotIndex === -1) return false

      // 提取并转换为小写扩展名
      const extension = urlObj.pathname.slice(lastDotIndex + 1).toLowerCase()
      return this.imageExtensions.includes(extension)
    } catch (err) {
      console.error('判断图片类型错误:', err)
      return false
    }
  }

  /**
   * 获取URL信息
   * @param urlObj 解析后的URL对象
   * @returns 包含路径、扩展名和是否为新URL格式的对象
   */
  getUrlInfo(urlObj: ReturnType<ImageJSsdk['parseUrl']>): {
    pathname: string
    ext: string
    isNewUrl: boolean
  } {
    // 处理无效URL情况
    if (!urlObj || !this.isImageUrl(urlObj)) {
      return { pathname: '', ext: '', isNewUrl: false }
    }

    const lastDotIndex = urlObj.pathname.lastIndexOf('.')
    const ext = lastDotIndex !== -1 ? urlObj.pathname.slice(lastDotIndex + 1).toLowerCase() : ''
    const atSymbolCount = (urlObj.pathname.match(/@/g) || []).length

    return {
      pathname: urlObj.pathname,
      ext,
      isNewUrl: urlObj.pathname.includes('@.') && atSymbolCount === 1,
    }
  }

  /**
   * 获取WebP格式的图片URL
   * @param url 原始图片URL
   * @param sizeType 尺寸类型，对应imageSizeMap
   * @returns 处理后的WebP图片URL
   */
  getWebpUrl(url: string, sizeType: keyof typeof this.imageSizeMap = 'detailsImage'): string {
    if (!url) return ''

    const urlObj = this.parseUrl(url)
    if (!urlObj) return url

    const urlInfo = this.getUrlInfo(urlObj)
    const sizeStr = this.imageSizeMap[sizeType] || ''
    // 处理已为webp格式的URL
    if (urlInfo.ext === 'webp') {
      // 避免重复添加尺寸参数
      return url.includes('@h') ? url : `${url}${sizeStr}`
    }

    // 处理其他格式转换为webp
    const hasSize = sizeStr && !url.includes(sizeStr)
    return hasSize ? `${url}${sizeStr}.webp` : `${url}${sizeStr ? '' : '@'}.webp`
  }
}

// 单例导出
const imageJSsdk = new ImageJSsdk()
export default imageJSsdk
