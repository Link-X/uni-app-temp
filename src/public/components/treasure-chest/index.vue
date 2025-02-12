<template>
  <view
    v-login-check
    class="treasure-chest absolute bottom-50rpx right-25rpx z-3"
    @click="handleClick"
  >
    <view
      class="box transition-transform ease-in delay-3000 animate-duration-3000 animate-mode animate__heartAnimate animate-iteration-count-infinite transform-origin-bc square-180rpx"
    >
      <image class="img w-full h-full" :src="imageData.adVideoBox" />
    </view>
    <view
      class="tip active:text-#ededed border-5rpx border-solid border-white rounded-26rpx absolute bottom-0 box-border w-full py-7rpx text-22rpx text-white text-center bg-gradient-to-r from-light-primary to-#fa4f1b"
    >
      开宝箱得金豆
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import imageData from '@/constants/image-data.json'

const emit = defineEmits<{
  (e: 'handleClick'): void
  (e: 'countdownEnd'): void
}>()

const handleClick = () => {
  emit('handleClick')
}
const countdownEnd = () => {
  emit('countdownEnd')
}
</script>
<style lang="scss" scoped>
.treasure-chest {
  .tip {
    overflow: hidden;
    background-image: linear-gradient(to right, $uni-color-primary, #fa4f1b);
    &:before {
      position: absolute;
      top: 0;
      left: -35px;
      display: block;
      width: 25px;
      height: 100%;
      content: '';
      background: rgba(255, 255, 255, 0.3);
      transform: skewX(-25deg);
      animation: liuguang infinite 3.5s ease-in;
    }
  }

  @keyframes liuguang {
    50% {
      left: -45px;
    }

    100% {
      left: 210px;
    }
  }

  .time {
    padding-left: 22rpx;
  }
}

.hover-class-opacity {
  color: #ededed !important;
}
</style>
<style lang="scss">
.treasure-chest {
  .animate__heartAnimate {
    animation-name: heartAnimate;
  }
  @keyframes heartAnimate {
    0%,
    100% {
      transform: scale(0.95) rotate(0);
    }
    10%,
    30% {
      transform: scale(1) rotate(3deg);
    }
    20%,
    40%,
    60%,
    80% {
      transform: scale(1) rotate(-3deg);
    }
    50%,
    70% {
      transform: scale(1) rotate(3deg);
    }
  }
}
</style>
