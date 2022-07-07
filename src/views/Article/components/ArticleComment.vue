<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-cell v-for="(item, index) in commentList" :key="index">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d" slot="title">hello</span>
        <div slot="label">
          <p style="color: #363636">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px">{{
              item.pubdate | dateformat
            }}</span>
            <van-button size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell> -->
      <!-- 封装成组件 -->
      <CommentItem
        @replay-show="$emit('replay-show', $event)"
        v-for="item in commentList"
        :key="item.com_id"
        :item="item"
      ></CommentItem>
    </van-list>
  </div>
</template>

<script>
import { getCommentList } from '@/api/comments'
import CommentItem from './CommentItem.vue'
export default {
  props: {
    type: {
      type: String,
      required: true,
      validate (value) {
        return ['a', 'c'].includes(value)
      }
    },
    source: {
      type: [String, Number],
      required: true
    },
    // 将commentList改为从父亲接受 这样后续更新数据也能实时接收到
    commentList: {
      type: Array,
      required: true
    }
  },
  created () {
    this.getCommentList()
  },
  data () {
    return {
      paramsObj: {
        type: this.type,
        source: this.source,
        limit: 10,
        offset: null
      },
      // commentList: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    async getCommentList () {
      try {
        const { data: res } = await getCommentList(this.paramsObj)
        // console.log(res)
        if (res.data.results.length === 0) {
          // 若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
          this.finished = true
        }
        this.commentList.push(...res.data.results)
        // console.log(this.commentList)
        // 子向父传值 将评论的总数量传给父组件
        this.$emit('set-count', res.data.total_count)
        // 本次返回结果的最后一个评论id，作为请求下一页数据的offset参数，若本次无具体数据，则值为NULL
        this.paramsObj.offset = res.data.last_id
        // 当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    onLoad () {
      this.getCommentList()// 获取下一页的数据
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { CommentItem }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
