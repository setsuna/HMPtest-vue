// 设备和分辨率类型定义
export interface Resolution {
  width: number;
  height: number;
}

export interface Device {
  name: string;
  dev_idx: number;
  resolution: Resolution[];
}

export interface APIResponse<T> {
  returnCode: number;
  returnMsg?: string;
  data?: T;
}

export interface FrameData {
  img: string;
}

// 高拍仪API基础URL
const API_BASE_URL = 'http://127.0.0.1:6543';

// 回调函数类型
type FrameCallback = (frameData: string) => void;

/**
 * 相机服务
 */
export function useCameraService() {
  // 模块级的定时器变量
  let frameTimer: NodeJS.Timeout | null = null;
  
  // 保存当前的回调函数
  let currentFrameCallback: FrameCallback | null = null;

  /**
   * 获取所有设备信息
   * @returns 设备信息列表Promise
   */
  const getAllDisplayInfo = async (): Promise<Device[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetAllDisplayInfo`);
      const data: APIResponse<Device[]> = await response.json();
      
      if (data.returnCode === 0 && data.data) {
        return data.data;
      }
      throw new Error(data.returnMsg || '获取设备信息失败');
    } catch (error) {
      console.error('获取设备信息出错:', error);
      throw error;
    }
  }

  /**
   * 获取设备数量
   * @returns 设备数量Promise
   */
  const getDeviceCount = async (): Promise<number> => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetDeviceCount`);
      const data: APIResponse<number> = await response.json();
      
      if (data.returnCode === 0 && data.data !== undefined) {
        return data.data;
      }
      throw new Error(data.returnMsg || '获取设备数量失败');
    } catch (error) {
      console.error('获取设备数量出错:', error);
      throw error;
    }
  }

  /**
   * 获取设备名称
   * @param dev_idx 设备索引
   * @returns 设备名称Promise
   */
  const getDisplayName = async (dev_idx: number): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetDisplayName?dev_idx=${dev_idx}`);
      const data: APIResponse<string> = await response.json();
      
      if (data.returnCode === 0 && data.data) {
        return data.data;
      }
      throw new Error(data.returnMsg || '获取设备名称失败');
    } catch (error) {
      console.error('获取设备名称出错:', error);
      throw error;
    }
  }

  /**
   * 获取指定设备的分辨率列表
   * @param dev_idx 设备索引
   * @returns 分辨率列表Promise
   */
  const getResolution = async (dev_idx: number): Promise<Resolution[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetResolution?dev_idx=${dev_idx}`);
      const data: APIResponse<Resolution[]> = await response.json();
      
      if (data.returnCode === 0 && data.data) {
        return data.data;
      }
      throw new Error(data.returnMsg || '获取分辨率列表失败');
    } catch (error) {
      console.error('获取分辨率列表出错:', error);
      throw error;
    }
  }

  /**
   * 获取视频帧并通过回调更新UI
   * @private 内部方法，不直接暴露给外部
   */
  const fetchFrameAndUpdate = async (): Promise<void> => {
    try {
      const frameData = await getFrame();
      
      // 如果有回调函数且获取到了有效的帧数据，则调用回调更新UI
      if (currentFrameCallback && frameData) {
        currentFrameCallback(frameData);
      }
    } catch (error) {
      console.error('获取视频帧出错:', error);
      // 只有在严重错误时才清除定时器
      if (frameTimer) {
        clearInterval(frameTimer);
        frameTimer = null;
      }
    }
  }

  /**
   * 启动视频预览
   * @param dev_idx 设备索引
   * @param res_id 分辨率索引
   * @param onFrame 每获取一帧时的回调函数，用于更新UI
   * @param pixfmt 像素格式
   * @returns void Promise
   */
  const startPreview = async (
    dev_idx: number, 
    res_id: number, 
    onFrame?: FrameCallback,
    pixfmt: string = 'pixfmt'
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/StartPreview?dev_idx=${dev_idx}&res_id=${res_id}&pixfmt=${pixfmt}`);
      const data: APIResponse<unknown> = await response.json();
      
      if (data.returnCode === 0) {
        // 保存回调函数
        if (onFrame) {
          currentFrameCallback = onFrame;
        }
        
        // 清除可能存在的旧定时器
        if (frameTimer) {
          clearInterval(frameTimer);
        }
        
        // 立即启动定时器调用getFrame()方法
        frameTimer = setInterval(fetchFrameAndUpdate, 300); // 使用300毫秒作为默认间隔
        
        // 立即获取一帧，不等待定时器
        fetchFrameAndUpdate();
        
        return;
      }
      throw new Error(data.returnMsg || '启动视频预览失败');
    } catch (error) {
      console.error('启动视频预览出错:', error);
      throw error;
    }
  }

  /**
   * 停止视频预览
   * @param dev_idx 设备索引
   * @returns void Promise
   */
  const stopPreview = async (dev_idx: number): Promise<void> => {
    try {
      // 首先清除定时器
      if (frameTimer) {
        clearInterval(frameTimer);
        frameTimer = null;
      }
      
      // 清除回调函数
      currentFrameCallback = null;
      
      const response = await fetch(`${API_BASE_URL}/StopPreview?dev_idx=${dev_idx}`);
      const data: APIResponse<unknown> = await response.json();
      
      if (data.returnCode === 0) {
        return;
      }
      throw new Error(data.returnMsg || '停止视频预览失败');
    } catch (error) {
      console.error('停止视频预览出错:', error);
      throw error;
    }
  }

  /**
   * 获取视频帧
   * @returns 帧数据Promise
   */
  const getFrame = async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/getFrame`);
      const responseText = await response.text();
      
      try {
        // 尝试解析JSON响应
        const data = JSON.parse(responseText);
        
        // 检查标准返回码
        if (data.returnCode === 0 && data.data && data.data.img) {
          return data.data.img;
        }
        
        // 检查非标准返回码 "21returnCode" 
        if ("21returnCode" in data && data["21returnCode"] === -1) {
          // 这是"请稍候..."的情况，返回null表示需要继续尝试
          console.log("收到'请稍候...'的响应，将继续尝试获取帧");
          return data.returnMsg;
        }
        
        // 其他错误情况
        throw new Error(data.returnMsg || '获取视频帧失败');
      } catch (parseError) {
        console.error('解析响应出错:', parseError, '原始响应:', responseText);
        throw new Error('解析响应失败');
      }
    } catch (error) {
      console.error('获取视频帧出错:', error);
      throw error;
    }
  }

  /**
   * 拍照
   * @param savePath 保存路径
   * @param quality 图像质量
   * @returns 图像数据Promise
   */
  const getPic = async (savePath: string = '/tmp', quality: number = 80): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/getPic?savepath=${savePath}&quality=${quality}`);
      const data: APIResponse<FrameData> = await response.json();
      
      if (data.returnCode === 0 && data.data && data.data.img) {
        return data.data.img;
      }
      throw new Error(data.returnMsg || '拍照失败');
    } catch (error) {
      console.error('拍照出错:', error);
      throw error;
    }
  }

  /**
   * 设置纠偏
   * @param enable 是否启用纠偏
   * @returns void Promise
   */
  const enableDeskImage = async (enable: boolean): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/EnableDeskImage?enable=${enable ? 1 : 0}`);
      const data: APIResponse<unknown> = await response.json();
      
      if (data.returnCode === 0) {
        return;
      }
      throw new Error(data.returnMsg || '设置纠偏失败');
    } catch (error) {
      console.error('设置纠偏出错:', error);
      throw error;
    }
  }

  /**
   * 获取当前旋转角度
   * @returns 旋转角度Promise
   */
  const getRotate = async (): Promise<number> => {
    try {
      const response = await fetch(`${API_BASE_URL}/getRotate`);
      const data: APIResponse<string> = await response.json();
      
      if (data.returnCode === 0 && data.data !== undefined) {
        return parseInt(data.data);
      }
      throw new Error(data.returnMsg || '获取旋转角度失败');
    } catch (error) {
      console.error('获取旋转角度出错:', error);
      throw error;
    }
  }

  /**
   * 设置旋转角度
   * @param count 旋转角度
   * @returns void Promise
   */
  const rotate = async (count: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Rotate?count=${count}`);
      const data: APIResponse<unknown> = await response.json();
      
      if (data.returnCode === 0) {
        return;
      }
      throw new Error(data.returnMsg || '设置旋转角度失败');
    } catch (error) {
      console.error('设置旋转角度出错:', error);
      throw error;
    }
  }

  /**
   * 身份证合并
   * @param step 步骤 (1: 正面, 2: 反面)
   * @returns 步骤2返回图像数据Promise
   */
  const composeIDcardPic = async (step: number): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/composeIDcardPic?step=${step}`);
      const data: APIResponse<FrameData> = await response.json();
      
      if (data.returnCode === 0) {
        // 步骤1不返回图像数据
        if (step === 1) {
          return null;
        }
        // 步骤2返回图像数据
        if (step === 2 && data.data && data.data.img) {
          return data.data.img;
        }
        return null;
      }
      throw new Error(data.returnMsg || '身份证合并失败');
    } catch (error) {
      console.error('身份证合并出错:', error);
      throw error;
    }
  }

  // 返回服务函数
  return {
    getAllDisplayInfo,
    getDeviceCount,
    getDisplayName,
    getResolution,
    startPreview,
    stopPreview,
    getFrame,
    getPic,
    enableDeskImage,
    getRotate,
    rotate,
    composeIDcardPic
  }
}
