<template>
  <div class="ultrawide-layout">
    <div class="flex-1 p-6 md:p-8 pb-24 flex flex-col">
      <!-- 页面标题 -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <div class="brand-logo">
            <span class="brand-dot"></span>
            <span>高拍仪</span>
          </div>
          <span class="text-sm text-gray-500 ml-3">文档扫描与图像处理</span>
        </div>
      </div>
      
      <!-- 主要内容区 - 使用table布局以支持Chrome 102 - 改为一行 -->
      <div class="w-full overflow-auto" style="display: table; width: 100%; margin-bottom: 1.5rem">
        <div style="display: table-row">
          <!-- 视频预览区域 -->
          <div style="display: table-cell; padding-right: 1.5rem; width: 40%; vertical-align: top">
            <div class="card p-4 h-full">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold flex items-center">
                  <CameraIcon size="18" class="mr-2 text-purple-500" />
                  视频预览
                </h2>
                <div v-if="isVideoStarted" class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  实时预览中
                </div>
              </div>
              
              <div class="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style="height: 400px">
                <img 
                  v-if="videoFrame" 
                  :src="`data:image/jpg;base64,${videoFrame}`" 
                  alt="视频预览" 
                  class="max-w-full max-h-full object-contain"
                />
                <div v-else class="text-center p-4">
                  <CameraIcon size="64" class="mx-auto text-gray-300 mb-3" />
                  <p class="text-gray-500">
                    {{ isLoading ? '正在加载...' : !isDeviceFound ? '未检测到设备' : !isVideoStarted ? '点击"打开视频"开始预览' : '正在连接...' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 设备控制区域 -->
          <div style="display: table-cell; padding-right: 1.5rem; width: 20%; vertical-align: top">
            <div class="card p-4 h-full">
              <h2 class="text-lg font-semibold mb-4 flex items-center">
                <LayersIcon size="18" class="mr-2 text-blue-500" />
                设备控制
              </h2>
              
              <div class="mb-4">
                <label class="block text-sm text-gray-500 mb-1">设备选择</label>
                <div class="flex items-center">
                  <select 
                    class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm"
                    v-model="selectedDevice"
                    @change="handleDeviceChange"
                    :disabled="isVideoStarted || !isDeviceFound"
                  >
                    <option 
                      v-for="(device, index) in devices" 
                      :key="device.dev_idx" 
                      :value="index"
                    >
                      {{ device.name }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm text-gray-500 mb-1">分辨率选择</label>
                <select 
                  class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm"
                  v-model="selectedResolution"
                  @change="handleResolutionChange"
                  :disabled="isVideoStarted || !isDeviceFound"
                >
                  <option 
                    v-for="(resolution, index) in resolutions" 
                    :key="index" 
                    :value="index"
                  >
                    {{ resolution.width }} x {{ resolution.height }}
                  </option>
                </select>
              </div>
              
              <button 
                class="camera-btn yellow"
                @click="findDevices"
                :disabled="isVideoStarted || isLoading"
              >
                <RefreshCwIcon size="14" :class="`mr-1 ${isLoading ? 'animate-spin' : ''}`" />
                查找设备
              </button>
              
              <button 
                class="camera-btn blue"
                :class="{disabled: !isDeviceFound || isVideoStarted}"
                @click="startVideo"
                :disabled="!isDeviceFound || isVideoStarted"
              >
                <CameraIcon size="16" class="mr-1" />
                打开视频
              </button>
              
              <button 
                class="camera-btn gray"
                :class="{disabled: !isVideoStarted}"
                @click="stopVideo"
                :disabled="!isVideoStarted"
              >
                <CameraIcon size="16" class="mr-1" />
                关闭视频
              </button>
            </div>
          </div>
          
          <!-- 拍照控制区域 -->
          <div style="display: table-cell; padding-right: 1.5rem; width: 20%; vertical-align: top">
            <div class="card p-4 h-full">
              <h2 class="text-lg font-semibold mb-4 flex items-center">
                <ImagePlusIcon size="18" class="mr-2 text-brand-red" />
                拍照控制
              </h2>
              
              <div class="mb-4">
                <label class="block text-sm text-gray-500 mb-1">保存路径</label>
                <input 
                  type="text" 
                  class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm"
                  v-model="savePath"
                />
              </div>
              
              <div class="mb-4">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="perspective-correction" 
                    class="mr-1"
                    v-model="isCorrectingPerspective"
                    @change="togglePerspectiveCorrection"
                    :disabled="!isVideoStarted"
                  />
                  <label for="perspective-correction" class="text-sm">图像纠偏</label>
                </div>
              </div>
              
              <button 
                class="camera-btn red"
                :class="{disabled: !isVideoStarted}"
                @click="capturePicture"
                :disabled="!isVideoStarted"
              >
                <ImagePlusIcon size="16" class="mr-1" />
                拍照
              </button>
              
              <button 
                class="camera-btn blue"
                :class="{disabled: !isVideoStarted}"
                @click="rotateImage"
                :disabled="!isVideoStarted"
              >
                <Rotate3DIcon size="16" class="mr-1" />
                旋转
              </button>
              
              <button 
                class="camera-btn green"
                :class="{disabled: !isVideoStarted}"
                @click="composeIDCardPic"
                :disabled="!isVideoStarted"
              >
                <CreditCardIcon size="16" class="mr-1" />
                身份证合并
              </button>
            </div>
          </div>
          
          <!-- 截图预览区域 -->
          <div style="display: table-cell; width: 20%; vertical-align: top">
            <div class="card p-4 h-full">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold flex items-center">
                  <SaveIcon size="18" class="mr-2 text-green-600" />
                  截图预览
                </h2>
                
                <button 
                  v-if="capturedImages.length > 0"
                  class="btn-gray"
                  style="text-xs; padding: 0.25rem 0.5rem; border-radius: 0.5rem; margin-top: 0; display: flex; align-items: center"
                  @click="clearCapturedImages"
                >
                  清空
                </button>
              </div>
              
              <div v-if="capturedImages.length > 0" class="grid grid-cols-2 gap-2">
                <div 
                  v-for="(img, index) in capturedImages" 
                  :key="index" 
                  class="bg-gray-50 border border-gray-200 rounded-lg p-1 flex items-center justify-center aspect-square"
                >
                  <img 
                    :src="`data:image/jpg;base64,${img}`" 
                    :alt="`截图 ${index + 1}`" 
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400">
                <SaveIcon size="32" class="mb-2 opacity-30" />
                <p class="text-sm">暂无截图</p>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  Camera as CameraIcon, 
  Code as CodeIcon, 
  RefreshCw as RefreshCwIcon, 
  Rotate3D as Rotate3DIcon, 
  Save as SaveIcon, 
  ImagePlus as ImagePlusIcon, 
  CreditCard as CreditCardIcon, 
  Layers as LayersIcon, 
  X as XIcon 
} from 'lucide-vue-next';
import { useCameraService, type Device, type Resolution } from '~/composables/useCameraService';

// 获取相机服务
const cameraService = useCameraService();

// 状态管理
const devices = ref<Device[]>([]);
const selectedDevice = ref<number>(0);
const resolutions = ref<Resolution[]>([]);
const selectedResolution = ref<number>(0);
const isVideoStarted = ref<boolean>(false);
const videoFrame = ref<string>('');
const capturedImages = ref<string[]>([]);
const savePath = ref<string>('/tmp');
const isCorrectingPerspective = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isDeviceFound = ref<boolean>(false);
const showModal = ref<boolean>(false);

// 设备查找
const findDevices = async () => {
  isLoading.value = true;
  try {
    const deviceData = await cameraService.getAllDisplayInfo();
    devices.value = deviceData;
    
    if (deviceData.length > 0) {
      selectedDevice.value = 0;
      resolutions.value = deviceData[0].resolution || [];
      isDeviceFound.value = true;
    }
  } catch (error) {
    console.error('查找设备出错:', error);
    alert('连接设备服务失败，请确保设备已连接且服务已启动');
  } finally {
    isLoading.value = false;
  }
};

// 处理设备选择变更
const handleDeviceChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const deviceIndex = parseInt(target.value);
  selectedDevice.value = deviceIndex;
  
  if (devices.value[deviceIndex]) {
    resolutions.value = devices.value[deviceIndex].resolution || [];
    selectedResolution.value = 0;
  }
};

// 处理分辨率选择变更
const handleResolutionChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  selectedResolution.value = parseInt(target.value);
};

// 直接更新视频帧的回调函数
const updateVideoFrame = (frameData: string) => {
  videoFrame.value = frameData;
};

// 开始视频预览
const startVideo = async () => {
  if (isVideoStarted.value) return;
  
  try {
    // 传递回调函数给startPreview
    await cameraService.startPreview(
      devices.value[selectedDevice.value].dev_idx, 
      selectedResolution.value, 
      updateVideoFrame
    );
    isVideoStarted.value = true;
  } catch (error) {
    console.error('启动视频失败:', error);
    alert('启动视频失败，请检查设备连接');
  }
};

// 停止视频预览
const stopVideo = async () => {
  if (!isVideoStarted.value) return;
  
  try {
    await cameraService.stopPreview(devices.value[selectedDevice.value].dev_idx);
    isVideoStarted.value = false;
    // 清空视频帧
    videoFrame.value = '';
  } catch (error) {
    console.error('停止视频失败:', error);
  }
};

// 拍照
const capturePicture = async () => {
  try {
    const imageData = await cameraService.getPic(savePath.value);
    
    // 限制最多显示4张图片
    capturedImages.value = [...capturedImages.value, imageData].slice(-4);
  } catch (error) {
    console.error('拍照失败:', error);
    alert('拍照失败，请检查设备连接');
  }
};

// 启用/禁用纠偏
const togglePerspectiveCorrection = async () => {
  try {
    await cameraService.enableDeskImage(isCorrectingPerspective.value);
  } catch (error) {
    console.error('设置纠偏失败:', error);
    alert('设置纠偏失败，请检查设备连接');
    isCorrectingPerspective.value = !isCorrectingPerspective.value; // 恢复UI状态
  }
};

// 旋转图像
const rotateImage = async () => {
  try {
    // 先获取当前旋转角度
    const currentRotate = await cameraService.getRotate();
    
    // 计算新的旋转角度
    const newRotate = (currentRotate + 1) % 4;
    
    // 设置新的旋转角度
    await cameraService.rotate(newRotate);
  } catch (error) {
    console.error('旋转图像失败:', error);
    alert('旋转图像失败，请检查设备连接');
  }
};

// 合并身份证正反面
const composeIDCardPic = async () => {
  try {
    // 提示用户放置正面
    if (confirm('请放置身份证，且正面朝上！放置完成后点击确定。')) {
      await cameraService.composeIDcardPic(1);
      
      // 提示用户放置反面
      if (confirm('请放置身份证，反面面朝上！放置完成后点击确定。')) {
        const imageData = await cameraService.composeIDcardPic(2);
        
        if (imageData) {
          // 添加合并后的图片
          capturedImages.value = [...capturedImages.value, imageData].slice(-4);
        }
      }
    }
  } catch (error) {
    console.error('身份证扫描失败:', error);
    alert('身份证扫描失败，请检查设备连接');
  }
};

// 清空截图
const clearCapturedImages = () => {
  capturedImages.value = [];
};

// 组件卸载时清理
onUnmounted(() => {
  // 如果视频已经启动，则停止
  if (isVideoStarted.value) {
    cameraService.stopPreview(devices.value[selectedDevice.value].dev_idx).catch(console.error);
  }
});
</script>
