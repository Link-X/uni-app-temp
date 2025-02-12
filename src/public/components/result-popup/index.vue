<template>
  <wd-popup
    bg-transparent
    custom-style="background: transparent"
    modal-style="background: rgba(0, 0, 0, 0.85)"
    lock-scroll
    :modelValue="show"
    @close="close"
  >
    <view class="relative overflow-hidden pt-35rpx">
      <view class="flex-center">
        <view class="box-bg pt-65rpx bg-100% w-630rpx p-20rpx line-height-none relative box-border">
          <view
            class="center pb-40rpx box-border square-full rounded-25rpx bg-gradient-to-r from-#fffee3 to-#fff9f7 box-border"
          >
            <view class="w-full box-border flex justify-end relative pr-25rpx">
              <wd-icon
                relative
                top-25rpx
                @click="close"
                name="close-circle"
                text-light-primary
                size="22px"
              ></wd-icon>
            </view>
            <view class="w-full mt-15rpx">
              <view class="w-full box-border px-50rpx">
                <slot></slot>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </wd-popup>
</template>
<script lang="ts" setup>
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const close = () => {
  emit('update:show', false)
}
</script>
<style lang="scss" scoped>
.box-bg {
  background-image: url('https://shop-cdn.cbyzx.com/shop23n05y18abcd/img/15c0ef8deb874f739925155061356454@.png');
  .center {
    background-image: linear-gradient(to right, #fffee3, #fff9f7);
    box-shadow: inset 0px -4rpx 0px #ffffffcc;
  }
}
</style>
