<script setup>
// 参数传递
const props = defineProps({
  title: { type: String, default: '提示' },
  type: { type: String, default: 'prompt' },
  content: { type: String, default: '内容' },
  confirmBtnText: { type: String, default: '确定' },
  cancelBtnText: { type: String, default: '取消' },
  show: { type: Boolean, default: false },
  cancel: {
    type: Function,
    default: () => {},
  },
  confirm: {
    type: Function,
    default: () => {},
  },
})
</script>

<template>
  <view class="fixed inset-x-0 inset-y-0 z-1000 bg-black bg-opacity-60">
    <view
      class="fixed translate-y-[-50%] top-1/2 inset-x-8rpx z-5000 pt-20rpx pb-25rpx text-30rpx line-height-1.2 color-#333 bg-white rounded-10rpx"
    >
      <text>{{ content }}</text>
      <view class="flex-center justify-end">
        <text
          @click="cancel"
          class="text-28rpx py-5rpx px-20rpx color-#fa4f1b"
          hover-class="hover-class-opacity"
        >
          {{ cancelBtnText }}
        </text>
        <text @click="confirm" class="color-#f84c4c" hover-class="hover-class-opacity">
          {{ confirmBtnText }}
        </text>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.hover-class-opacity {
  opacity: 0.8;
}
</style>
