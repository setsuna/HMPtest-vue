<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
// Set HTML attributes
useHead({
  htmlAttrs: {
    lang: 'zh-CN',
    class: 'h-full'
  },
  bodyAttrs: {
    class: 'h-full'
  }
});
</script>
