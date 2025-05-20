<template>
  <view
    class="scroll-view-weight absolute w-full h-full inset-x-0 inset-y-0 overflow-hidden flex flex-col"
    :style="{ height: height, backgroundColor: bgColor || 'transparent' }"
  >
    <slot name="header"></slot>
    <view class="scroll-view-super flex flex-1 flex-col relative">
      <view class="scroll-view-container absolute inset-x-0 inset-y-0 relative square-full">
        <view
          height="100%"
          class="scroll-view-absolute overflow-y-scroll overflow-scrolling-touch scroll-behavior-smooth h-full absolute top-0 left-0 square-full"
          scroll-y
          @scroll="scroll"
          @scrolltolower="scrolltolower"
          ref="scrollDomRef"
        >
          <slot></slot>
        </view>
      </view>
    </view>
    <slot name="bottom"></slot>
  </view>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    height: string
    bgColor: string
  }>(),
  {
    height: '100%',
    bgColor: 'transparent',
  },
)
const emit = defineEmits(['scrolltolower', 'scroll'])

const scrollDomRef = ref()
const scrolltolower = (e) => {
  emit('scrolltolower', e)
}
const scroll = (e) => {
  emit('scroll', e)
}
defineExpose({
  getScrollDomRef: () => {
    return scrollDomRef.value
  },
})
</script>
<style lang="scss" scoped></style>
