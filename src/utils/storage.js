// 为了方便项目中使用本地储存的时候写的时候 简化操作 封装 读取 储存 删除 全部删除工具函数
/**
 *
 * @param {*} key
 * @returns 拿本地数据
 */
export function getItem (key) {
  const res = window.localStorage.getItem(key)
  try {
    return JSON.parse(res)
  } catch (error) {
    return res
  }
}
/**
 * 存储本地数据
 */
export function setItem (key, value) {
  if (typeof value === 'object') { // 复合数据类型
    window.localStorage.setItem(key, JSON.stringify(value))
  } else { // 简单数据类型
    window.localStorage.setItem(key, value)
  }
}
/***
 * 删除本地存储
 */
export function removeItem (key) {
  window.localStorage.removeItem(key)
}
/**
 * 删除所有本地存储
 */
export function clearItem (key) {
  window.localStorage.clearItem()
}
