<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <global-scroll-view-weight>
    <template #header>
      <global-header title="首页" colorName="text-#333" />
    </template>
    <view class="bg-white overflow-hidden pt-2 px-4">
      <view class="mt-12">
        <image src="/static/logo.svg" alt="" class="w-28 h-28 block mx-auto" />
      </view>
      <view class="text-center text-4xl main-title-color mt-4">{{ config.projectInfo.name }}</view>
      <view class="text-center text-2xl mt-2 mb-8">uniapp 开发模板</view>

      <view class="text-justify max-w-100 m-auto text-4 indent mb-2">{{ description }}</view>
      <view class="text-center mt-8" @click="Gopage">
        当前平台是：
        <text class="text-green-500">{{ platform.platform }}</text>
      </view>
      <view class="text-center mt-4">
        模板分支是：
        <text class="text-green-500">tabbar</text>
      </view>
    </view>
  </global-scroll-view-weight>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import { platform } from '@/constants/env'
import config from '@/constants/config.json'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const description = ref(
  'uni-app-temp 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)
const Gopage = () => {
  // 跳转到分包页面
  uni.navigateTo({
    url: '/pages-sub/demo/index?a=1&b=2',
  })
}
// 测试 uni API 自动引入
onLoad(() => {
  console.log(TestEnum.A)
})
</script>

<style>
.main-title-color {
  color: #d14328;
}
</style>
