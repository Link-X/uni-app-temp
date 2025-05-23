<template>
  <view class="flex-center line-height-none h-44px" :class="bgColor" :style="rootStyle">
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
import { type CSSProperties, computed } from 'vue'
import { useGlobalStore } from '@/store/global'
import { addUnit, objToStyle } from './utils.ts'
import { platform } from '@/constants/env'
const globalStore = useGlobalStore()

const props = defineProps<{
  title?: string
  colorName?: string
  leftArrow?: boolean
  rightText?: string
  bgColor?: string
  customStyle?: string
}>()
const emit = defineEmits(['back', 'click-right'])

const { statusBarHeight } = uni.getSystemInfoSync()
const rootStyle = computed(() => {
  const style: CSSProperties = {}
  style['padding-top'] = platform.isMp
    ? addUnit(statusBarHeight || 0)
    : addUnit(globalStore.globalState.deviceInfo.top)
  return `${objToStyle(style)}${props.customStyle}`
})

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
