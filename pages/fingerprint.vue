<template>
  <div class="ultrawide-layout">
    <div class="flex-1 p-6 md:p-8 pb-24 flex flex-col">
      
      <!-- 页面标题 -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <div class="brand-logo">
            <span class="brand-dot"></span>
            <span>指纹识别</span>
          </div>
          <span class="text-sm text-gray-500 ml-3">采集、比对和识别指纹</span>
        </div>
      </div>
      
      <!-- 主要内容区 - 使用table布局以支持Chrome 102 -->
      <div class="w-full overflow-auto" style="display: table">
        <div style="display: table-row-group">
          <div style="display: table-row">
            <!-- 指纹采集卡片 -->
            <div style="display: table-cell; padding-right: 1.5rem; padding-bottom: 1.5rem; width: 25%; vertical-align: top; height: 500px;">
              <div class="card p-6 fingerprint-card">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-semibold flex items-center">
                    <span class="flex items-center justify-center mr-2">
                      <FingerprintIcon size="18" class="text-brand-red" />
                    </span>
                    指纹采集
                  </h2>
                  <div :class="`px-2 py-1 rounded-full text-xs font-medium ${
                    result === '执行成功' 
                      ? 'bg-green-100 text-green-700' 
                      : isScanning 
                        ? 'bg-blue-100 text-blue-700 animate-pulse'
                        : 'bg-gray-100 text-gray-700'
                  }`">
                    {{ result === '执行成功' ? '采集成功' : isScanning ? '采集中...' : '等待操作' }}
                  </div>
                </div>
                
                <!-- 指纹显示区域 -->
                <div class="relative bg-gray-50 rounded-lg border border-gray-200 w-full flex-1 min-h-64 flex items-center justify-center overflow-hidden mb-4">
                  <img 
                    v-if="fingerImage" 
                    :src="fingerImage" 
                    alt="指纹图像" 
                    class="max-w-full max-h-full object-contain" 
                  />
                  <div v-else class="text-center p-4 w-full">
                    <FingerprintIcon size="48" class="mx-auto text-gray-300 mb-2" />
                    <p class="text-gray-400 text-sm">请按压指纹进行采集</p>
                  </div>
                  
                  <div v-if="isScanning" class="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center backdrop-blur-sm">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
                  </div>
                </div>
                
                <!-- 操作按钮 -->
                <button
                  @click="startFingerprintScan"
                  :disabled="isScanning"
                  class="fingerprint-btn"
                  :class="isScanning ? 'disabled' : ''"
                >
                  <template v-if="isScanning">
                    <RefreshCwIcon size="16" class="mr-2 animate-spin" />
                    采集中...
                  </template>
                  <template v-else>
                    <FingerprintIcon size="16" class="mr-2" />
                    采集指纹
                  </template>
                </button>
              </div>
            </div>
            
            <!-- 状态信息卡片 -->
            <div style="display: table-cell; padding-right: 1.5rem; padding-bottom: 1.5rem; width: 25%; vertical-align: top; height: 500px;">
              <div class="card p-6 h-full">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <span class="flex items-center justify-center mr-2">
                    <LayersIcon size="18" class="text-blue-500" />
                  </span>
                  状态信息
                </h2>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">
                      操作结果
                    </label>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                      {{ result }}
                    </div>
                  </div>
                  
                  <div style="display: table; width: 100%">
                    <div style="display: table-row">
                      <div style="display: table-cell; padding-right: 0.75rem; width: 50%">
                        <label class="block text-sm font-medium text-gray-500 mb-1">
                          指纹质量
                        </label>
                        <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium">
                          {{ imageQuality || '- -' }}
                        </div>
                      </div>
                      
                      <div style="display: table-cell; width: 50%">
                        <label class="block text-sm font-medium text-gray-500 mb-1">
                          采集时间
                        </label>
                        <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium flex items-center">
                          <template v-if="captureTime">
                            <ClockIcon size="14" class="mr-1 text-gray-400" />
                            {{ captureTime }}
                          </template>
                          <template v-else>- -</template>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="fingerChar && result === '执行成功'" class="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div class="flex items-start">
                      <CheckIcon size="16" class="text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h3 class="font-medium text-green-700 text-sm">指纹采集成功</h3>
                        <div class="flex mt-2">
                          <button 
                            class="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded-md flex items-center mr-2"
                            @click="downloadFeature"
                          >
                            <DownloadIcon size="12" class="mr-1" />
                            下载特征
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 参数设置卡片 -->
            <div style="display: table-cell; padding-right: 1.5rem; padding-bottom: 1.5rem; width: 25%; vertical-align: top; height: 500px;">
              <div class="card p-6 h-full">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <span class="flex items-center justify-center mr-2">
                    <SettingsIcon size="18" class="text-gray-600" />
                  </span>
                  参数设置
                </h2>
                
                <div class="mb-4">
                  <label for="threshold" class="block text-sm font-medium text-gray-500 mb-2">
                    判断阈值: {{ qualityThreshold }}
                  </label>
                  <input
                    type="range"
                    id="threshold"
                    min="10"
                    max="100"
                    v-model="qualityThreshold"
                    class="w-full"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>低</span>
                    <span>高</span>
                  </div>
                </div>
                
                <div class="space-y-3 mt-5">
                  <div class="bg-gray-50 p-3 rounded-lg">
                    <div class="text-xs text-gray-500 mb-1">固件最新版本</div>
                    <div class="font-medium">v---</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 使用指南卡片 -->
            <div style="display: table-cell; padding-bottom: 1.5rem; width: 25%; vertical-align: top; height: 500px;">
              <div class="card p-6 h-full">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <span class="flex items-center justify-center mr-2">
                    <FingerprintIcon size="18" class="text-green-600" />
                  </span>
                  使用指南
                </h2>
                
                <div class="space-y-3">
                  <div class="flex">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 text-gray-600 font-medium text-sm">1</div>
                    <p class="text-sm text-gray-600">确保指纹设备已正确连接</p>
                  </div>
                  
                  <div class="flex">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 text-gray-600 font-medium text-sm">2</div>
                    <p class="text-sm text-gray-600">调整合适的判断阈值（推荐值: 40-60）</p>
                  </div>
                  
                  <div class="flex">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 text-gray-600 font-medium text-sm">3</div>
                    <p class="text-sm text-gray-600">点击 采集指纹 按钮</p>
                  </div>
                  
                  <div class="flex">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 text-gray-600 font-medium text-sm">4</div>
                    <p class="text-sm text-gray-600">将手指平稳放置在指纹采集区上</p>
                  </div>
                  
                  <div class="flex">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 text-gray-600 font-medium text-sm">5</div>
                    <p class="text-sm text-gray-600">等待系统采集完成，查看结果</p>
                  </div>
                </div>
                
                <div v-if="fingerChar" class="mt-4">
                  <label class="block text-sm font-medium text-gray-500 mb-1">
                    指纹特征片段
                  </label>
                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 h-12 overflow-hidden text-xs text-gray-500 font-mono">
                    {{ fingerChar ? fingerChar.substring(0, 100) + '...' : '- -' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页面导航器 -->
    <PageNavigator />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { 
  Fingerprint as FingerprintIcon, 
  Check as CheckIcon, 
  RefreshCw as RefreshCwIcon, 
  Download as DownloadIcon,
  Code as CodeIcon,
  Clock as ClockIcon,
  Layers as LayersIcon,
  Settings as SettingsIcon
} from 'lucide-vue-next';
import { useFingerprintService, type FingerprintData } from '~/composables/useFingerprintService';

// 状态管理
const fingerImage = ref<string>('');
const fingerChar = ref<string>('');
const imageQuality = ref<string>('');
const result = ref<string>('等待操作');
const isScanning = ref<boolean>(false);
const qualityThreshold = ref<string>('40');
const captureTime = ref<string>('');

// 引用变量
const timeCount = ref<number>(0);
const scanning = ref<boolean>(false);
const abortController = ref<AbortController | null>(null);
const startTime = ref<number>(0);

// 引入指纹服务
const { getFingerprint } = useFingerprintService();

// 处理结果代码并转换为对应的消息
const handleResultCode = (code: string, count: number): string => {
  switch (code) {
    case '1': 
      return '执行成功';
    case '2': 
      return count < 20 
        ? `请按压指纹，等待时间:${count}s` 
        : '等待超时';
    case '3': 
      return '设备生成特征错误';
    case '-99': 
      return '未知异常';
    case '-100': 
      return '参数错误';
    case '-101': 
      return '设备打开失败';
    case '-102': 
      return '设备没有指纹，请按压指纹';
    case '-103': 
      return '设备通讯异常';
    case '-104': 
      return '设备合成模板失败';
    default: 
      return `其他错误 错误代码${code}`;
  }
};

// 开始扫描指纹
const startFingerprintScan = async () => {
  if (scanning.value) return;
  
  // 重置状态
  fingerChar.value = '';
  fingerImage.value = '';
  result.value = '请按压指纹，等待采集...';
  captureTime.value = '';
  
  timeCount.value = 0;
  scanning.value = true;
  isScanning.value = true;
  startTime.value = Date.now();
  
  // 创建 AbortController 用于取消请求
  abortController.value = new AbortController();
  
  try {
    await scanFingerprint();
  } catch (error) {
    console.error('指纹扫描出错:', error);
    result.value = '扫描过程中发生错误';
    scanning.value = false;
    isScanning.value = false;
  }
};

// 递归扫描指纹直到成功或超时
const scanFingerprint = async () => {
  if (!scanning.value) return;
  
  try {
    // 每次请求增加计数器
    timeCount.value++;
    
    // 获取指纹数据
    const response = await getFingerprint(
      qualityThreshold.value, 
      abortController.value?.signal
    );
    
    // 更新状态
    imageQuality.value = response.quality;
    
    if (response.image) {
      fingerImage.value = `data:image/png;base64,${response.image}`;
    }
    
    if (response.characteristic) {
      fingerChar.value = response.characteristic;
    }
    
    // 处理结果
    const resultMessage = handleResultCode(response.result, timeCount.value);
    result.value = resultMessage;
    
    // 如果成功，停止扫描
    if (response.result === '1') {
      // 计算采集时间
      const endTime = Date.now();
      const duration = ((endTime - startTime.value) / 1000).toFixed(1);
      captureTime.value = `${duration} 秒`;
      
      scanning.value = false;
      isScanning.value = false;
      return;
    }
    
    // 如果超时，停止扫描
    if (timeCount.value >= 20) {
      scanning.value = false;
      isScanning.value = false;
      return;
    }
    
    // 如果失败但未超时，继续扫描
    await scanFingerprint();
  } catch (error) {
    console.error('扫描过程中出错:', error);
    scanning.value = false;
    isScanning.value = false;
    result.value = '扫描出错，请重试';
  }
};

// 取消扫描
const cancelScan = () => {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
  }
  scanning.value = false;
  isScanning.value = false;
  result.value = '扫描已取消';
};

// 下载特征
const downloadFeature = () => {
  if (!fingerChar.value) return;
  
  // 创建一个blob对象
  const blob = new Blob([fingerChar.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // 创建一个a标签用于下载
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fingerprint_feature.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 组件卸载时清理
onUnmounted(() => {
  cancelScan();
});
</script>
