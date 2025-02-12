<script setup>
// 参数传递
import { ref } from 'vue'

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
const hideOptionContent = ref(false)
</script>

<template>
  <view class="fixed inset-x-0 inset-y-0 z-1000 bg-black bg-opacity-60">
    <view
      class="absolute top-150rpx right-20rpx left-20rpx flex items-center leading-none p-x20 py-20rpx bg-white rounded-10rpx"
    >
      <image
        class="icon square-50rpx"
        src="https://a-fxb-cdn.cbyzx.com/fxbb3172a68xzgke/img/e3229c3c0f114212b059cecde06b6bc3@.png"
      />
      <view class="info ml-15">
        <view class="title w-full text-26rpx font-bold color-#333">{{ title }}</view>
        <view class="content mt-8rpx text-22rpx color-#666">{{ content }}</view>
      </view>
    </view>
    <view
      class="translate-y-[-50%] fixed top-1/2 inset-x-16rpx z-5000 pt-20rpx pb-25rpx text-30rpx line-height-1.2 color-#333 bg-white rounded-10rpx"
      v-if="!hideOptionContent"
    >
      <text>{{ content }}</text>
      <view class="tools flex-center justify-end">
        <text
          @click="cancel"
          class="btn py-5rpx px-20rpx color-#fa4f1b close"
          hover-class="hover-class-opacity"
        >
          {{ cancelBtnText }}
        </text>
        <text
          @click="
            () => {
              hideOptionContent = true
              confirm()
            }
          "
          class="btn py-5rpx px-20rpx color-#f84c4c"
          hover-class="hover-class-opacity"
        >
          {{ confirmBtnText }}
        </text>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped></style>
