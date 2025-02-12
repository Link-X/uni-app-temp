<template>
  <view
    class="flex-center"
    :style="{
      paddingTop: safeTopHeight + 'px',
    }"
  >
    <slot>
      <view class="w-full relative flex-center text-43rpx font-bold color-#333 py-30rpx">
        <view @click="back" class="absolute left-30rpx -mb-10rpx">
          <wd-icon name="thin-arrow-left" size="40rpx"></wd-icon>
        </view>
        <text>{{ title }}</text>
      </view>
    </slot>
  </view>
</template>
<script lang="ts" setup>
import useSafeAreaSupport from '@/public/hooks/useSafeAreaSupport'

const { isSupport, safeTopHeight } = useSafeAreaSupport()

const props = defineProps<{
  title: string
}>()
const emit = defineEmits(['back'])

const back = () => {
  emit('back')
  uni.navigateBack()
}
</script>
