import request from '@/utils/request'

// 发送验证码
export const getSmsCode = (mobile) => {
  return request({
    url: `/sms/codes/${mobile}`
  })
}
// 登录

export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/authorizations',
    data: { mobile, code }
  })
}
/**
 * 获取用户资料
 */
export const getUserInfo = () => {
  return request({
    url: 'user'
  })
}
/**
 *获取用户基本信息
 */
export const getUserProfile = () => {
  return request({
    url: 'user/profile'
  })
}
/**
 * 更改用户信息
 * @param {对象 用户个人资料} profile
 */
export const updateUserProfile = (profile) => {
  return request({
    method: 'PATCH',
    url: 'user/profile',
    data: profile
  })
}
/**
 * 更新头像
 * @param {裁剪之后的头像数据} data
 */
export const updateAvatar = data => {
  return request({
    method: 'PATCH',
    url: 'user/photo',
    data
  })
}
