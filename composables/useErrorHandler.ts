import { ref } from 'vue';

export function useErrorHandler() {
  const error = ref<string | null>(null);
  const isLoading = ref<boolean>(false);

  /**
   * 设置错误信息
   * @param message 错误信息
   */
  const setError = (message: string | null) => {
    error.value = message;
  };

  /**
   * 清除错误信息
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * 安全执行异步操作，处理错误
   * @param fn 异步函数
   * @param errorMessage 发生错误时的提示信息
   * @returns 异步函数的结果
   */
  const safeExecute = async <T>(
    fn: () => Promise<T>,
    errorMessage = '操作执行失败'
  ): Promise<T | null> => {
    clearError();
    isLoading.value = true;
    
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(`${errorMessage}: ${errMsg}`);
      console.error(errMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 处理设备类错误
   * @param errorCode 错误代码
   * @param defaultMessage 默认错误信息
   * @returns 格式化的错误信息
   */
  const handleDeviceError = (errorCode: string | number, defaultMessage = '设备错误'): string => {
    const code = String(errorCode);
    
    const errorMessages: Record<string, string> = {
      '-1': '设备未找到',
      '-2': '设备未打开',
      '-3': '设备连接失败',
      '-99': '未知错误',
      '-100': '参数错误',
      '-101': '设备打开失败',
      '-102': '设备未检测到内容',
      '-103': '设备通讯异常',
      '-104': '设备处理失败'
    };
    
    return errorMessages[code] || `${defaultMessage} (${code})`;
  };

  return {
    error,
    isLoading,
    setError,
    clearError,
    safeExecute,
    handleDeviceError
  };
}
