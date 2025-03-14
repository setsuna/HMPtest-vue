<template>
  <div class="page-navigator">
    <div class="page-nav-container">
      <NuxtLink 
        v-for="page in pages" 
        :key="page.id"
        :to="page.path"
        :class="[
          'page-nav-item',
          $route.path === page.path ? 'active' : ''
        ]"
      >
        {{ page.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

// Define page configuration
const pages = [
  { id: 'home', path: '/', label: '首页' },
  { id: 'fingerprint', path: '/fingerprint', label: '指纹识别' },
  { id: 'idcard', path: '/idcard', label: '身份证识别' },
  { id: 'camera', path: '/camera', label: '高拍仪' }
];
</script>
