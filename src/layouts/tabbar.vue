<template>
  <wd-config-provider w-screen h-screen :themeVars="themeVars" :theme="mode">
    <view
      class="bg-transparent absolute w-full h-full inset-x-0 inset-y-0 overflow-hidden flex flex-col"
    >
      <view class="flex flex-1 flex-col relative">
        <slot></slot>
      </view>
      <wd-tabbar
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
              mb-5rpx
              pt-20rpx
              size="34rpx"
              :custom-class="`iconfont ${
                item.pagePath.includes(tabbar) ? 'text-light-primary' : 'text-#C4C4C4'
              }`"
              class-prefix="icon"
              :name="item.icon"
            />
          </template>
        </wd-tabbar-item>
      </wd-tabbar>
    </view>
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { currRoute } from '@/public/utils/methods'
import { tabBar } from '@/pages.json'

import useTheme from './theme'

const { themeVars, mode } = useTheme()
const tabbar = ref('home')

const changeTabbar = (data: { value: string }) => {
  uni.switchTab({
    url: '/' + data.value,
  })
}

onShow(() => {
  uni.hideTabBar()
  const currentPage = currRoute()
  tabbar.value = currentPage.path.substring(1)
})
</script>
<style lang="scss" scoped></style>
