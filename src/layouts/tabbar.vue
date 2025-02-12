<template>
  <wd-config-provider :themeVars="themeVars">
    <global-scroll-view-weight>
      <slot></slot>
      <template #bottom>
        <fg-tabbar />
      </template>
    </global-scroll-view-weight>
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import useTheme from './theme'
const { themeVars } = useTheme()
</script>
