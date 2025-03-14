/**
 * 验证身份证号码
 * @param idNumber 身份证号码
 * @returns 是否为有效的身份证号码
 */
export function validateIdNumber(idNumber: string): boolean {
  // 简单验证 - 18位身份证
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(idNumber);
}

/**
 * 验证IP地址
 * @param ip IP地址
 * @returns 是否为有效的IP地址
 */
export function validateIpAddress(ip: string): boolean {
  const reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return reg.test(ip);
}

/**
 * 验证图像质量是否达标
 * @param quality 图像质量（0-100）
 * @param threshold 阈值
 * @returns 是否达标
 */
export function validateImageQuality(quality: number, threshold: number): boolean {
  return quality >= threshold;
}

/**
 * 验证路径是否为有效的文件路径
 * @param path 文件路径
 * @returns 是否为有效路径
 */
export function validateFilePath(path: string): boolean {
  // 简单判断是否包含非法字符
  const reg = /[<>:"|?*]/;
  return !reg.test(path);
}