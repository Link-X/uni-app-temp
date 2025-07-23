<template>
  <wd-config-provider w-screen :themeVars="themeVars" :theme="mode">
    <view
      :class="{
        'h-screen': platform.isMp,
      }"
    >
      <view
        class="relative"
        :style="{
          height: tabbarContentHeight,
        }"
      >
        <slot></slot>
      </view>
      <!-- <wd-tabbar
        placeholder
        fixed
        :safeAreaInsetBottom="true"
        v-model="tabbar"
        @change="changeTabbar"
      >
        <wd-tabbar-item
          v-for="item in tabBar.list"
          :key="item.pagePath"
          :name="item.pagePath"
          :title="item.text"
          :icon="item.icon"
        >
          <template #icon>
            <wd-icon
              size="46rpx"
              :custom-class="`   mb-5rpx
              pt-20rpx iconfont ${
                item.pagePath.includes(tabbar) ? 'text-light-primary' : 'text-#C4C4C4'
              }`"
              class-prefix="icon"
              :name="item.icon"
            />
          </template>
        </wd-tabbar-item>
      </wd-tabbar> -->
    </view>
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { currRoute } from '@/public/utils/methods'
import { useGlobalStore } from '@/store'
import { platform } from '@/constants/env'

import useTheme from './theme'

const { themeVars, mode } = useTheme()
const tabbar = ref('home')
const tabbarContentHeight = computed(() => {
  const height = useGlobalStore().globalState?.setting?.tabbarContentHeight
  const computedHeight = height ? `${height}px` : '95vh'
  return platform.isMp ? '100%' : computedHeight
})

const changeTabbar = (data: { value: string }) => {
  uni.switchTab({
    url: '/' + data.value,
  })
}

onShow(() => {
  // uni.hideTabBar()
  const currentPage = currRoute()
  tabbar.value = currentPage.path.substring(1)
})
onLoad(() => {
  useGlobalStore().getTabbarContent()
})
</script>
<style lang="scss" scoped></style>
