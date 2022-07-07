import request from '@/utils/request'
/*
* 获取评论的列表（首页的评论列表和点击回复的弹出框的评论列表）
* @param type 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
* @param source 源id，文章id或评论id
* @param offset 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
* @param limit 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
*/
export const getCommentList = ({ type, source, offset, limit }) => {
  return request({
    url: 'comments',
    params: {
      type, source, offset, limit
    }
  })
}
