<template>
  <div class="ultrawide-layout">
    <div class="flex-1 p-6 md:p-8 pb-24 flex flex-col">
      <!-- 页面标题 -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <div class="brand-logo">
            <span class="brand-dot"></span>
            <span>身份证识别</span>
          </div>
          <span class="text-sm text-gray-500 ml-3">读取和验证身份证信息</span>
        </div>
      </div>
      
      <div class="w-full overflow-auto" style="display: table">
        <div style="display: table-row-group">
          <div style="display: table-row">
            <!-- 控制卡片 -->
            <div style="display: table-cell; padding-right: 1.5rem; padding-bottom: 1.5rem; width: 25%; vertical-align: top">
              <div class="card p-6 h-full">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-lg font-semibold flex items-center">
                    <CreditCardIcon size="18" class="mr-2 text-green-500" />
                    身份证读卡器
                  </h2>
                  <div :class="`px-2 py-1 rounded-full text-xs font-medium ${
                    isReading 
                      ? 'bg-blue-100 text-blue-700 animate-pulse' 
                      : 'bg-gray-100 text-gray-700'
                  }`">
                    {{ isReading ? '读卡中...' : '等待操作' }}
                  </div>
                </div>
                
                <!-- 操作按钮 -->
                <button
                @click="toggleCardReading"
                class="idcard-btn"
                :class="isReading ? 'gray' : ''"
                >
                <template v-if="isReading">
                  <RefreshCwIcon size="16" class="mr-2 animate-spin" />
                    停止读卡
                </template>
                <template v-else>
                <CreditCardIcon size="16" class="mr-2" />
                  开始读卡
                </template>
                </button>
                
                <!-- 状态信息 -->
                <div class="space-y-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">
                      读卡时间
                    </label>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm flex items-center">
                      <ClockIcon size="14" class="mr-1 text-gray-400" />
                      {{ timeElapsed || '- -' }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">
                      读卡结果
                    </label>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm h-24 overflow-auto">
                      {{ result || '- -' }}
                    </div>
                  </div>
                </div>
                
                <!-- 使用指南 -->
                <div class="mt-6">
                  <h3 class="text-sm font-medium text-gray-500 mb-2">使用指南</h3>
                  <div class="space-y-2">
                    <div class="flex">
                      <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0 text-gray-600 font-medium text-xs">1</div>
                      <p class="text-sm text-gray-600">确保身份证阅读器已连接</p>
                    </div>
                    <div class="flex">
                      <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0 text-gray-600 font-medium text-xs">2</div>
                      <p class="text-sm text-gray-600">点击 开始读卡 按钮</p>
                    </div>
                    <div class="flex">
                      <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0 text-gray-600 font-medium text-xs">3</div>
                      <p class="text-sm text-gray-600">将身份证放到读卡区</p>
                    </div>
                    <div class="flex">
                      <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0 text-gray-600 font-medium text-xs">4</div>
                      <p class="text-sm text-gray-600">读取完成后查看结果</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 身份证信息卡片 -->
            <div style="display: table-cell; padding-right: 1.5rem; padding-bottom: 1.5rem; width: 50%; vertical-align: top">
              <div class="card p-6 h-full">
                <h2 class="text-lg font-semibold mb-6 flex items-center">
                  <UserIcon size="18" class="mr-2 text-brand-red" />
                  身份证信息
                </h2>
                
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">
                        证件类别
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                        {{ cardInfo ? getCertTypeName(cardInfo.certType) : '- -' }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">
                        姓名
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium">
                        {{ cardInfo?.name || '- -' }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">
                        性别
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                        {{ cardInfo?.sex || '- -' }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">
                        民族
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                        {{ cardInfo?.nation || '- -' }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">
                        出生日期
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                        {{ cardInfo?.birthday || '- -' }}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">
                      住址
                    </label>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                      {{ cardInfo?.address || '- -' }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">
                      身份证号
                    </label>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-brand-red font-bold">
                      {{ cardInfo?.idCode || '- -' }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">
                      签发机关
                    </label>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                      {{ cardInfo?.department || '- -' }}
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">
                        有效期开始
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                        {{ cardInfo?.startDate || '- -' }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">
                        有效期结束
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                        {{ cardInfo?.endDate || '- -' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 照片显示卡片 -->
            <div style="display: table-cell; padding-bottom: 1.5rem; width: 25%; vertical-align: top">
              <div class="card p-6 h-full">
                <h2 class="text-lg font-semibold mb-6 flex items-center">
                  <UsersIcon size="18" class="mr-2 text-blue-500" />
                  照片显示
                </h2>
                
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center" style="height: 320px">
                  <img 
                    v-if="photo" 
                    :src="photo" 
                    alt="身份证照片" 
                    class="max-w-full max-h-full object-contain"
                  />
                  <div v-else class="flex flex-col items-center justify-center py-12">
                    <CreditCardIcon size="48" class="text-gray-300 mb-4" />
                    <p class="text-sm text-gray-400">暂无照片</p>
                  </div>
                </div>
                
                <div class="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div class="flex items-start">
                    <AlertTriangleIcon size="16" class="text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h3 class="font-medium text-blue-700 text-sm">信息安全提示</h3>
                      <p class="text-xs text-blue-600 mt-1">身份证信息敏感，请确保在安全环境下使用，并在使用完毕后妥善处理相关数据。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页面导航 -->
    <PageNavigator />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { 
  CreditCard as CreditCardIcon, 
  Code as CodeIcon, 
  RefreshCw as RefreshCwIcon, 
  AlertTriangle as AlertTriangleIcon, 
  Clock as ClockIcon, 
  User as UserIcon, 
  Users as UsersIcon 
} from 'lucide-vue-next';
import { useIdcardService, type IDCardInfo } from '~/composables/useIdcardService';

// 状态管理
const isReading = ref<boolean>(false);
const timeElapsed = ref<string>('');
const cardInfo = ref<IDCardInfo | null>(null);
const result = ref<string>('');
const photo = ref<string>('');

// 定时器引用
let readingInterval: NodeJS.Timeout | null = null;
let startTime = ref<number>(0);

// 获取身份证服务
const { readCard } = useIdcardService();

// 证件类型解析为可读字符串
const getCertTypeName = (type: number): string => {
  switch (type) {
    case 0: return '身份证';
    case 1: return '外国人居住证';
    case 2: return '港澳台居住证';
    default: return '未知';
  }
};

// 清除表单数据
const clearForm = () => {
  cardInfo.value = null;
  photo.value = '';
  timeElapsed.value = '';
  result.value = '';
};

// 读取身份证
const readIDCard = async () => {
  try {
    const startTimeMs = Date.now();
    const response = await readCard();
    const endTime = Date.now();
    
    // 计算耗时
    timeElapsed.value = `${endTime - startTimeMs} 毫秒`;
    
    if (response.result.resultFlag !== 0) {
      result.value = `${response.result.errorMsg}\nreturn: ${response.result.resultFlag}`;
    } else {
      cardInfo.value = response.info;
      photo.value = `data:image/jpeg;base64,${response.info.Photo}`;
      result.value = response.result.errorMsg || '读卡成功';
    }
  } catch (error) {
    console.error('读卡出错:', error);
    result.value = '读卡出错，请检查设备连接';
  }
};

// 切换读卡状态
const toggleCardReading = () => {
  if (isReading.value) {
    // 停止读卡
    if (readingInterval) {
      clearInterval(readingInterval);
      readingInterval = null;
    }
    isReading.value = false;
  } else {
    // 开始读卡
    clearForm();
    startTime.value = Date.now();
    isReading.value = true;
    readIDCard(); // 立即读一次
    readingInterval = setInterval(readIDCard, 2000); // 然后每2秒读一次
  }
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (readingInterval) {
    clearInterval(readingInterval);
    readingInterval = null;
  }
});
</script>
