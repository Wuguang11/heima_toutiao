import request from '@/utils/request'
/**
 * 获取文章详情数据
 */
export const getArticle = (article_id) => {
  return request({
    url: `articles/${article_id}`
  })
}
/**
 * 取消用户关注
 */
export const addUser = (target) => {
  return request({
    method: 'POST',
    url: 'user/followings',
    data: {
      target
    }
  })
}
/**
 * 用户关注
 */
export const deleteUser = (target) => {
  return request({
    method: 'DELETE',
    url: `user/followings/${target}`
  })
}
/**
 * 收藏文章
 */
export const addCollect = (target) => {
  return request({
    method: 'POST',
    url: 'article/collections',
    data: {
      target
    }
  })
}
/**
 * 取消收藏文章
 */
export const deleteCollect = (target) => {
  return request({
    method: 'DELETE',
    url: `article/collections/${target}`
  })
}
/**
 * 点赞
 * @param {文章id} target
 */
export const addLike = (target) => {
  return request({
    method: 'POST',
    url: 'comment/likings',
    data: {
      target
    }
  })
}
/*
* @param {要取消点赞的评论id或评论回复id} target
*/

export const delLike = (target) => {
  return request({
    method: 'DELETE',
    url: `comment/likings/${target}`
  })
}
/**
 *@param {评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）} target
 *@param {评论内容）} content
 *@param {文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数）}art_id
 */
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: 'comments',
    data
  })
}
