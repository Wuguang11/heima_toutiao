<template>
  <div>
    <van-cell
      icon="search"
      v-for="(item, index) in list"
      :key="index"
      @click="$emit('search', item)"
    >
      <template #title>
        <span v-html="highlight(item)"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestionList } from '@/api/search'
let timer = null
export default {
  name: 'SearchSuggeat',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  created () { },
  data () {
    return {
      list: []
    }
  },
  methods: {
    highlight (str) {
      // 定义符合条件的正则
      const reg = new RegExp(this.searchText, 'g')
      // 利用正则进行替换
      return str.replace(reg, ` <span style="color: red">${this.searchText}</span>`)
    }
  },
  computed: {},
  watch: {
    searchText: {
      handler (newVal) {
        // console.log(newVal)
        // 防抖
        clearTimeout(timer)
        timer = setTimeout(async () => {
          try {
            const { data: res } = await getSuggestionList(newVal)
            console.log(res.data.options)
            this.list = res.data.options
          } catch (error) {
            console.log(error)
          }
        }, 500)
      },
      immediate: true
    }
  },
  filters: {},
  components: {},
  // 组件销毁之前清除定时器 防止内存泄漏 组件销毁了还在执行
  beforeDestroy () {
    clearTimeout(timer)
  }
}
</script>

<style scoped lang='less'>
</style>
