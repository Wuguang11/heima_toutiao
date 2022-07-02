<template>
  <div>
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3269fa"
        @cancel="$router.back()"
        @search="onSearch"
        autofocus
        @focus="isSearch = false"
      />
    </form>
    <SearchHistory v-if="searchText === ''" @search="onSearch"></SearchHistory>
    <template v-else>
      <SearchReuslt v-if="isSearch" :searchText="searchText"></SearchReuslt>
      <SearchSuggest
        v-else
        :searchText="searchText"
        @search="onSearch"
      ></SearchSuggest>
    </template>
  </div>
</template>

<script>
import SearchHistory from '@/views/Search/components/SearchHistory.vue'
import SearchSuggest from '@/views/Search/components/SearchSuggest.vue'
import SearchReuslt from '@/views/Search/components/SearchReuslt.vue'
export default {
  name: 'Search',
  created () { },
  data () {
    return {
      searchText: '',
      isSearch: false
    }
  },
  methods: {
    onSearch (str) {
      this.isSearch = true
      this.searchText = str
      // 将str存储起来
      this.$store.commit('setSearchHistoryList', str)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { SearchHistory, SearchSuggest, SearchReuslt }
}
</script>

<style scoped lang='less'>
</style>
