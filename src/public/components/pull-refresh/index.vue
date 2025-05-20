<template>
  <scroll-view
    @touchstart.passive="handlerstart"
    @touchmove.passive="handlermove"
    @touchend.passive="handlerend"
    @scroll="scroll"
    @scrolltolower="scrolltolower"
    :scrollWithAnimation="false"
    :show-scrollbar="false"
    :bounces="false"
    ref="pullRefreshRef"
    class="pull-pefresh fixed top-0 leading-none text-light-desc bg-#F5F5F5"
    :scroll-y="scrollDisabled"
    :style="{
      height: contentHeight,
    }"
  >
    <slot name="header"></slot>
    <view
      :class="[{ ani: isTransition }, 'wrap']"
      :style="{
        transform: `translateY(${moveDistance}px)`,
        marginTop: '-40rpx',
      }"
    >
      <view class="mb-5rpx h-40rpx">
        <view
          class="flex items-center justify-center text-26rpx color-#a8a8a8"
          v-if="moveDistance > DISTANCE_Y_MIN_LIMIT && !pullLoading"
        >
          释放即可刷新
        </view>
        <wd-loadmore
          v-if="pullLoading"
          custom-class="loadmore"
          state="loading"
          loading-text="加载中"
        />
      </view>

      <slot name="content"></slot>
      <view class="h-40rpx pb-20rpx">
        <wd-loadmore v-if="downLoading" state="loading" loading-text="加载中.." />
        <wd-loadmore
          v-if="noMore && list?.length"
          custom-class="loadmore"
          state="finished"
          finished-text="没有更多了~"
        />
      </view>
      <view class="w-full h-50rpx"></view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted, withDefaults, defineProps, defineEmits } from 'vue'

// 定义 props
const props = withDefaults(
  defineProps<{
    contentHeight: string
    query: (pageNo: number, pageSize: number, refresh?: boolean) => Promise<any>
    downDisabled: false
    noMore?: boolean
    list: any[]
  }>(),
  {
    contentHeight: '95vh',
  },
)

// 定义 emits
const emit = defineEmits(['refresh', 'scroll', 'scrolltolower'])

// 定义常量
const DISTANCE_Y_MIN_LIMIT = 40
const DISTANCE_Y_MAX_LIMIT = 100
const DEG_LIMIT = 40

// 定义变量
let startY = 0
let startX = 0
let endY = 0
let endX = 0
let distanceY = 0
let distanceX = 0
let opacity = 1

const moveDistance = ref(0)
const pullLoading = ref(false)
const downLoading = ref(false)
const isTransition = ref(false)
const pullRefreshRef = ref()
const lock = ref(false)
const scrollH = ref(1)
const scrollDisabled = ref(true)
const computedNoMore = ref(false)
const queryData = ref({
  pageNo: 1,
  pageSize: 20,
})

const canPull = () => !lock.value && !pullLoading.value

const handlerstart = (e) => {
  if (!canPull()) return
  startY = e.touches[0].clientY
  startX = e.touches[0].clientX
  isTransition.value = false
  scrollDisabled.value = true
}

const handlermove = (e) => {
  if (!canPull() || downLoading.value) return
  endY = e.touches[0].clientY
  endX = e.touches[0].clientX
  distanceY = endY - startY
  distanceX = endX - startX

  const deg = Math.atan(Math.abs(distanceX) / distanceY) * (180 / Math.PI)
  if (deg > DEG_LIMIT) {
    ;[startY, startX] = [endY, endX]
    return
  }
  if (distanceY < 0) {
    return
  }
  scrollDisabled.value = false
  let percent = (100 - distanceY * 0.5) / 100
  percent = Math.max(0.5, percent)
  distanceY = distanceY * percent
  moveDistance.value = distanceY
  if (distanceY > DISTANCE_Y_MAX_LIMIT) {
    distanceY = DISTANCE_Y_MAX_LIMIT
    moveDistance.value = distanceY
  }
}

const handlerend = (e) => {
  scrollDisabled.value = true

  isTransition.value = true
  if (moveDistance.value > DISTANCE_Y_MIN_LIMIT) {
    moveDistance.value = DISTANCE_Y_MIN_LIMIT + 1
    refresherrefresh()
  } else {
    moveDistance.value = 0
  }
}

const scroll = (e) => {
  const scrollTop = e.detail.scrollTop
  lock.value = scrollTop > 1
  const maxOpacity = 1
  let scroll = scrollTop <= 1 ? 0 : scrollTop
  let newOpacity = scroll / scrollH.value
  if ((opacity >= maxOpacity && newOpacity >= maxOpacity) || (opacity == 0 && newOpacity == 0)) {
    return
  }
  opacity = newOpacity > maxOpacity ? maxOpacity : newOpacity
  emit('scroll', {
    event: e,
    opacity: opacity,
  })
}

const getData = async (pageNo: number, pageSize: number, refresh?: boolean) => {
  const data = await props.query(pageNo, queryData.value.pageSize, refresh)
  if (data?.length > 1) {
    queryData.value = {
      pageNo,
      pageSize,
    }
  }
  // if (data?.length < queryData.value.pageSize) {
  //   computedNoMore.value = true
  // }
}

const pause = (number: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res({})
    }, number)
  })
}

const refresherrefresh = async () => {
  if (pullLoading.value) return
  pullLoading.value = true
  computedNoMore.value = false
  try {
    queryData.value.pageNo = 1
    await pause(500)
    await getData(queryData.value.pageNo, queryData.value.pageSize, true)
  } catch (error) {
    console.error('刷新数据时出错:', error)
  } finally {
    pullLoading.value = false
    moveDistance.value = 0
    emit('refresh')
  }
}

const scrolltolower = async () => {
  if (
    downLoading.value ||
    pullLoading.value ||
    props.downDisabled ||
    computedNoMore.value ||
    props.noMore
  )
    return
  downLoading.value = true
  try {
    await pause(500)
    await getData(queryData.value.pageNo + 1, queryData.value.pageSize, false)
  } catch (error) {
    console.error('加载更多数据时出错:', error)
  } finally {
    downLoading.value = false
    emit('scrolltolower')
  }
}

defineExpose({
  refresh: async () => {
    getData(1, queryData.value.pageSize)
  },
})

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      scrollH.value = res.windowWidth * 0.3
    },
    fail: (error) => {
      console.error('获取系统信息失败:', error)
    },
  })
})
</script>

<style lang="scss" scoped>
.ani {
  transition: all 0.3s ease;
}
.pull-pefresh {
  scroll-behavior: smooth;
  overscroll-behavior: none;
  --wot-loadmore-height: 20px;
}
.pull-pefresh :deep(.uni-scroll-view) {
  scroll-behavior: smooth;
  overscroll-behavior: none;
  --wot-loadmore-height: 20px;
}
</style>
