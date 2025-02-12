<script lang="ts" setup>
import { computed } from 'vue'
import useLogo from './use-controller'

const props = defineProps({
  closePopup: {
    type: Function,
    default: () => {},
  },
  authorize: {
    type: Function,
    default: () => {},
  },
})
const useLogoController = useLogo({
  authorize: props.authorize,
})

const state = computed(() => {
  return useLogoController.state
})
</script>

<template>
  <wd-popup v-model="state.show" custom-style="border-radius:32rpx;" @close="props.closePopup">
    <wd-button :loading="state.loadingIn" @click="useLogoController.signIn">登录</wd-button>
    <wd-button @click="useLogoController.register">注册</wd-button>
  </wd-popup>
</template>
<style lang="scss" scoped>
.hover-class-opacity {
  opacity: 0.8;
}
</style>
