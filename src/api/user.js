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
