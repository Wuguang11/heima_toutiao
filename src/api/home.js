import request from '@/utils/request'
/**
 * 获取用户频道
 */
export const getMyChannel = () => {
  return request({
    url: 'user/channels'
  })
}
/**
 * 获取文章列表
 */
// eslint-disable-next-line camelcase
export const getArticleList = ({ channel_id, timestamp }) => {
  return request({
    url: 'articles',
    params: { channel_id, timestamp }
  })
}
/**
 * 获取所有的列表
 */
export const getAllList = () => {
  return request({
    url: 'channels'
  })
}
/**
 * 频道数据持久化
 */
export const saveChannel = (channels) => {
  return request({
    url: 'user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
}
