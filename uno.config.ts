// uno.config.ts https://unocss.dev/config/layers
import {
  type Preset,
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetApplet, presetRemRpx, transformerAttributify } from 'unocss-applet'
import { Theme } from '@unocss/preset-uno'

// @see https://unocss.dev/presets/legacy-compat
// import { presetLegacyCompat } from '@unocss/preset-legacy-compat'

const isMp = process.env?.UNI_PLATFORM?.startsWith('mp') ?? false

const presets: Preset[] = []
if (isMp) {
  // 使用小程序预设
  presets.push(presetApplet(), presetRemRpx())
} else {
  presets.push(
    // 非小程序用官方预设
    presetUno(),
    // 支持css class属性化
    presetAttributify(),
  )
}
export default defineConfig<Theme>({
  presets: [
    ...presets,
    // 支持图标，需要搭配图标库，eg: @iconify-json/carbon, 使用 `<button class="i-carbon-sun dark:i-carbon-moon" />`
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    // 将颜色函数 (rgb()和hsl()) 从空格分隔转换为逗号分隔，更好的兼容性app端，example：
    // `rgb(255 0 0)` -> `rgb(255, 0, 0)`
    // `rgba(255 0 0 / 0.5)` -> `rgba(255, 0, 0, 0.5)`
    // presetLegacyCompat({
    //   commaStyleColorFunction: true,
    // }) as Preset,
  ],
  /**
   * 自定义快捷语句
   * @see https://github.com/unocss/unocss#shortcuts
   */
  shortcuts: [
    ['flex-center', 'flex justify-center items-center'],
    // 正方形 square-100px
    [
      /^square-\[?(.*?)\]?$/,
      ([, size]) => {
        return `w-${size} h-${size}`
      },
    ],
    // 圆形 circle-100px
    [
      /^circle-\[?(.*?)\]?$/,
      ([, size]) => {
        return `square-${size} rounded-full`
      },
    ],
  ],
  transformers: [
    // 启用 @apply 功能
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
    // Don't change the following order
    transformerAttributify({
      // 解决与第三方框架样式冲突问题
      prefixedOnly: true,
      prefix: 'fg',
    }),
  ],
  rules: [
    // 多行文本超出部分省略号 line-n (已内置 line-clamp-n)
    [
      /^line-(\d+)$/,
      ([, l]) => {
        if (~~l === 1) {
          return {
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            width: '100%',
          }
        }
        return {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': l,
        }
      },
    ],
    // 一侧圆角 rounded-left-5px (已内置 rounded-l-n)
    [
      /^rounded-(left|right|top|bottom)-(.*?)$/,
      ([, position, m]) => {
        let x1, x2, y1, y2
        if (['left', 'right'].includes(position)) {
          y1 = 'top'
          y2 = 'bottom'
          x1 = x2 = position
        } else {
          x1 = 'left'
          x2 = 'right'
          y1 = y2 = position
        }
        if (m === 'full') m = '99999px'

        return {
          [`border-${y1}-${x1}-radius`]: m,
          [`border-${y2}-${x2}-radius`]: m,
        }
      },
    ],
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    ['bg-100%', { 'background-size': '100% 100%' }],
  ],
  // 扩展主题
  extendTheme: (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        light: {
          ...(theme?.colors?.light || {}),
          primary: '#ff350d',
          desc: '#3D150C',
        },
      },
    }
  },
})

/**
 * 最终这一套组合下来会得到：
 * mp 里面：mt-4 => margin-top: 32rpx  == 16px
 * h5 里面：mt-4 => margin-top: 1rem == 16px
 *
 * 如果是传统方式写样式，则推荐设计稿设置为 750，这样设计稿1px，代码写1rpx。
 * rpx是响应式的，可以让不同设备的屏幕显示效果保持一致。
 */
