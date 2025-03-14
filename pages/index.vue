<template>
  <div class="ultrawide-layout">
    <div class="page-content">
      <!-- 功能卡片 -->
      <div class="table">
        <div class="table-row">
          <div v-for="feature in features.slice(0, 2)" :key="feature.title" 
               class="table-cell" style="width: 50%;">
            <NuxtLink :to="feature.path" class="block">
              <div class="card">
                <div class="feature-card-header" :class="feature.colorClass"></div>
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <div class="feature-icon-container" :class="feature.colorClass">
                      <component :is="feature.icon" 
                        class="text-xl" :class="feature.textColorClass" 
                      />
                    </div>
                    <div>
                      <h2 class="text-xl font-semibold">{{ feature.title }}</h2>
                    </div>
                  </div>
                  
                  <p class="text-gray-600 mb-6">
                    {{ feature.description }}
                  </p>
                  
                  <div class="text-red font-medium">
                    开始使用
                    <span class="ml-1 transition-all">→</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <div class="table-row">
          <div v-for="feature in features.slice(2)" :key="feature.title" 
               class="table-cell" style="width: 50%;">
            <NuxtLink :to="feature.path" class="block">
              <div class="card">
                <div class="feature-card-header" :class="feature.colorClass"></div>
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <div class="feature-icon-container" :class="feature.colorClass">
                      <component :is="feature.icon" 
                        class="text-xl" :class="feature.textColorClass" 
                      />
                    </div>
                    <div>
                      <h2 class="text-xl font-semibold">{{ feature.title }}</h2>
                    </div>
                  </div>
                  
                  <p class="text-gray-600 mb-6">
                    {{ feature.description }}
                  </p>
                  
                  <div class="text-red font-medium">
                    开始使用
                    <span class="ml-1 transition-all">→</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页面导航 -->
    <PageNavigator />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  Fingerprint as FingerprintIcon, 
  CreditCard as CreditCardIcon, 
  Camera as CameraIcon 
} from 'lucide-vue-next';

const features = [
  {
    icon: FingerprintIcon,
    title: '指纹识别',
    description: '高效准确的指纹采集与识别功能',
    path: '/fingerprint',
    colorClass: 'red',
    textColorClass: 'text-red'
  },
  {
    icon: CreditCardIcon,
    title: '身份证识别',
    description: '快速读取身份证信息及照片',
    path: '/idcard',
    colorClass: 'green',
    textColorClass: 'text-green'
  },
  {
    icon: CameraIcon,
    title: '高拍仪',
    description: '高清文档扫描与图像处理',
    path: '/camera',
    colorClass: 'purple',
    textColorClass: 'text-purple'
  }
];
</script>
