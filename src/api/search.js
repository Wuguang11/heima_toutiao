import request from '@/utils/request'
/**
 * 搜索联想数据的列表
 * q是关键词
 */
export const getSuggestionList = (q) => {
  return request({
    url: 'suggestion',
    params: { q }
  })
}
/**
 * 搜索的结果
 */
// 这里 page=1 相当于一个默认值 相对于传递的形参对象进行结构
// eslint-disable-next-line camelcase
export const getSearchResult = ({ page = 1, per_page, q }) => {
  return request({
    url: 'search',
    params: {
      page, per_page, q
    }
  })
}
