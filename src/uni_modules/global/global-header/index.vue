<template>
  <view
    class="flex-center pb-25rpx line-height-none"
    :class="bgColor"
    :style="{ paddingTop: globalStore.globalState.deviceInfo.top + 'px' }"
  >
    <slot>
      <view class="w-full relative flex-center text-rpx32" :class="colorName || 'text-#333'">
        <view @click="back" class="absolute left-30rpx" v-if="leftArrow">
          <wd-icon name="thin-arrow-left" size="32rpx"></wd-icon>
        </view>
        <text class="text-32rpx">{{ title }}</text>
        <view @click="clickRight" v-if="rightText" class="absolute right-30rpx text-24rpx">
          {{ rightText }}
        </view>
      </view>
    </slot>
  </view>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '@/store/global'
const globalStore = useGlobalStore()

const props = defineProps<{
  title?: string
  colorName?: string
  leftArrow?: boolean
  rightText?: string
  bgColor?: string
}>()
const emit = defineEmits(['back', 'click-right'])

const back = () => {
  emit('back')
  uni.navigateBack({
    delta: 1,
    fail: () => {
      window.history.go(-1)
    },
  })
  // uni.$emit('app:back')
}
const clickRight = () => {
  emit('click-right')
}
</script>
