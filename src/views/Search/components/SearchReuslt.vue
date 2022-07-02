<template>
  <div class="container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'SuggestResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  created () {
    this.getSearchResult()
  },
  data () {
    return {
      page: 1,
      per_page: 20,
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  methods: {
    async getSearchResult () {
      try {
        const { data: res } = await getSearchResult({ page: this.page, per_page: this.per_page, q: this.searchText })
        // 数据加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
          return
        }
        // 新的数据添加要push进去，而不是覆盖
        this.list.push(...res.data.results)
        this.loading = false
        this.refreshing = false
      } catch (error) {
        console.log(error)
      }
    },
    // 滑动到底部自动触发
    onLoad () {
      this.page++
      this.getSearchResult()
    },
    // 下拉刷新时触发
    onRefresh () {
      // 重置
      this.list = []
      this.page = 1
      this.getSearchResult()
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { ArticleItem }
}
</script>

<style scoped lang='less'>
.container {
  overflow: auto;
  height: calc(100vh - 108px);
}
</style>
