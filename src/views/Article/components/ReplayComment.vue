<template>
  <div>
    <van-nav-bar :title="title" left-arrow @click-left="$emit('close')" fixed>
      <template #left><van-icon name="cross" /></template>
    </van-nav-bar>
    <CommentItem :item="comment" class="comment"></CommentItem>
    <van-cell title="全部回复" />
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :item="item"
    ></CommentItem>
    <!-- 防止底部盖住评论内容 -->
    <div class="place-holder"></div>
    <div class="bottom">
      <van-button
        type="primary"
        block
        round
        plain
        @click="isAddCommentShow = true"
        >新建评论</van-button
      >
    </div>
    <!-- 新建评论弹出层 -->
    <van-popup v-model="isAddCommentShow" position="bottom">
      <!-- 传递数据的回调函数：增加渲染的数据 关闭弹窗 让评论数量自增 给组件也加v-if让它每次重启都是最新的-->
      <AddComment
        :target="comment.com_id"
        :art_id="$route.params.article_id"
        v-if="isAddCommentShow"
        @add-comment="
          list.unshift($event),
            (isAddCommentShow = false),
            comment.reply_count++
        "
      ></AddComment>
    </van-popup>
  </div>
</template>

<script>
import { getCommentList } from '@/api/comments'
import CommentItem from './CommentItem.vue'
import AddComment from './AddComment.vue'
export default {
  props: {
    comment: {
      type: Object,
      default: () => ({})
    }
  },
  created () {
    this.getCommentList()
  },
  data () {
    return {
      // 发送请求封装的函数
      offset: null,
      limit: 9999, // 一次性把所有数据都获取到
      // 请求获取到的评论数据
      list: [],
      // 控制新建回复弹出层
      isAddCommentShow: false
    }
  },
  methods: {
    async getCommentList () {
      try {
        const { data: res } = await getCommentList({ type: 'c', source: this.comment.com_id, offset: this.offset, limit: this.limit })
        // console.log(res)
        this.list = res.data.results
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    title () {
      const count = this.comment.reply_count
      if (count === 0) {
        return '暂无回复'
      } else {
        return count + '条回复'
      }
    }
  },
  watch: {},
  filters: {},
  components: { CommentItem, AddComment }
}
</script>

<style scoped lang='less'>
.comment {
  margin-top: 92px;
}
.place-holder {
  margin-bottom: 110px;
}
.bottom {
  position: fixed;
  height: 110px;
  width: 750px;
  bottom: 0;
  box-sizing: border-box;
  padding: 10px 30px;
  background-color: #afbed2;
}
</style>
