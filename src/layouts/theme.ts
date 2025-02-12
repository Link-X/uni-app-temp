import type { ConfigProviderThemeVars } from 'wot-design-uni'

const primaryThemeColor = '#ff350d'

const themeVars: ConfigProviderThemeVars = {
  colorTheme: primaryThemeColor,
  tabbarActiveColor: primaryThemeColor,
  tabbarItemTitleFontSize: '22rpx',
  tabbarHeight: 'auto',
}

export default () => {
  return {
    themeVars,
  }
}
