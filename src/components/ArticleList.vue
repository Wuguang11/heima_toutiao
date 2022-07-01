<template>
  <van-cell-group>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      ref="pullrefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(item, index) in articlelist"
          :key="index"
          :title="item.title"
          value="内容"
          :label="item.aut_name"
        /> -->
        <ArticleItem
          v-for="(item, index) in articlelist"
          :key="index"
          :article="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </van-cell-group>
</template>

<script>
import ArticleItem from '@/components/ArticleItem'
import { getArticleList } from '@/api/home'
let ele = null // 全局
let scrollTop = 0
export default {
  name: 'ArticleList',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  created () {
    this.getArticleList()
  },
  // 操作dom的时候用mounted
  mounted () { // 给有滚动条的pull-refresh绑定滚动事件 在滚动的时候记住最新的滚动位置
    // 组件最终渲染成html dom ，$el就是渲染好的根标签
    // 记住滚动位置
    ele = this.$refs.pullrefresh.$el
    ele.addEventListener('scroll', function () {
      scrollTop = this.scrollTop
    })
  },
  // keepalive的生命周期
  activated () {
    // 跳到记住的滚动位置
    ele.scrollTop = scrollTop
  },
  data () {
    return {
      timestamp: Date.now(),
      articlelist: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },

  methods: {
    async getArticleList () {
      if (this.refreshing) {
        this.articlelist = []
        this.refreshing = false
      }
      try {
        const res = await getArticleList({ channel_id: this.id, timestamp: this.timestamp })
        // console.log(res)
        this.timestamp = res.data.data.pre_timestamp
        // 若数据已全部加载完毕，则直接将 finished 设置成 true 即可
        if (this.timestamp === null) {
          this.finished = true
        }
        this.articlelist.push(...res.data.data.results)
        // 数据更新完毕后，将 loading 设置成 false 即可
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    },
    onLoad () {
      this.getArticleList()
    },
    // 刷新
    onRefresh () {
      console.log('下拉刷新了')
      this.finished = false // 防止用户把加载更多搞结束了
      this.loading = true // 重新加载数据
      this.timestamp = Date.now()
      this.getArticleList()
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { ArticleItem }
}
</script>

<style scoped lang='less'>
.van-cell-group {
  margin-top: 178px;
}
</style>
