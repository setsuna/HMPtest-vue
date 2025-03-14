/**
 * 格式化时间戳为易读格式
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化身份证号码（隐藏中间部分）
 * @param idNumber 身份证号码
 * @returns 格式化后的身份证号码
 */
export function formatIdNumber(idNumber: string): string {
  if (!idNumber || idNumber.length < 8) return idNumber;
  
  return idNumber.substring(0, 4) + '********' + idNumber.substring(idNumber.length - 4);
}

/**
 * 格式化耗时（毫秒转为易读格式）
 * @param ms 耗时（毫秒）
 * @returns 格式化后的耗时字符串
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms} 毫秒`;
  } else if (ms < 60000) {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds} 秒`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes} 分 ${seconds} 秒`;
  }
}