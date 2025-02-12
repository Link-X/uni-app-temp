<template>
  <view
    class="flex-center pb-25rpx line-height-none"
    :style="{ paddingTop: globalStore.globalState.deviceInfo.top + 'px' }"
  >
    <slot>
      <view class="w-full relative flex-center text-43rpx font-bold" :class="colorName || ''">
        <view @click="back" class="absolute left-30rpx" v-if="leftArrow">
          <wd-icon name="thin-arrow-left" size="36rpx"></wd-icon>
        </view>
        <text class="text-36rpx">{{ title }}</text>
        <view @click="clickRight" v-if="rightText" class="absolute right-30rpx text-24rpx">
          {{ rightText }}
        </view>
      </view>
    </slot>
  </view>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '@/store/index'
const globalStore = useGlobalStore()

const props = defineProps<{
  title?: string
  colorName?: string
  leftArrow?: boolean
  rightText?: string
}>()
const emit = defineEmits(['back', 'click-right'])

const back = () => {
  emit('back')
  uni.navigateBack()
}
const clickRight = () => {
  emit('click-right')
}
</script>
