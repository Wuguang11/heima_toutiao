<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar fixed>
      <template #title>
        <van-button
          type="info"
          icon="search"
          round
          class="search-btn"
          to="/search"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>
    <!-- 频道导航 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
    <van-tabs v-model="active" animated>
      <van-tab
        :title="item.name"
        v-for="(item, index) in myChannelList"
        :key="index"
      >
        <!-- 内容显示区域 -->
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>

      <template #nav-right>
        <div class="menu" @click="isChannelPanelShow = true">
          <span class="toutiao toutiao-gengduo"></span>
        </div>
        <!-- 尾部占位 -->
        <div class="menu1"></div>
      </template>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      v-model="isChannelPanelShow"
      position="bottom"
      :style="{ height: '100%', paddingTop: '1rem' }"
      closeable
      close-icon-position="top-left"
    >
      <ChannlPanel
        :myChannelList="myChannelList"
        :active="active"
        @change-active="
          active = $event;
          isChannelPanelShow = false;
        "
        @del-event="active = $event"
      ></ChannlPanel>
    </van-popup>
  </div>
</template>

<script>
import { getMyChannel } from '@/api/home'
import ArticleList from '@/components/ArticleList.vue'
import ChannlPanel from '@/views/Home/components/ChannelPanel.vue'
import { getItem } from '@/utils/storage'
const CHANNELS = 'channels'
export default {
  name: 'home',
  created () {
    this.getMyChannel()
  },
  data () {
    return {
      active: '',
      myChannelList: [],
      isChannelPanelShow: false
    }
  },
  methods: {
    async getMyChannel () {
      const channels = getItem(CHANNELS)
      // 没有登录 本地有存储拿数据
      if (!(this.$store.state.user && this.$store.state.user.token) && channels) {
        this.myChannelList = channels
      } else { // 登陆过 或者是第一次登录 从服务器拿数据
        try {
          const { data: res } = await getMyChannel()
          // console.log(res.data.channels)
          this.myChannelList = res.data.channels
        } catch (error) {
          this.$toast.fail('获取我的频道失败')
        }
      }
    }
  },
  computed: {},

  filters: {},
  components: { ArticleList, ChannlPanel }
}
</script>

<style scoped lang='less'>
.search-btn {
  width: 555px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 32px;
}
/deep/ .van-nav-bar__title {
  max-width: unset;
}
/deep/ .van-tabs__wrap--scrollable .van-tab {
  padding: 0 70px;
  border-right: 1px solid #edeff3;
}
/deep/ .van-tabs__line {
  width: 31px;
  background-color: #3296fa;
}
.menu {
  position: fixed;
  min-width: 66px;
  height: 82px;
  background-color: rgba(255, 255, 255, 0.9);
  // background-color: pink;
  text-align: center;
  line-height: 82px;
  right: 0;
  span {
    font-size: 33px;
  }
}
.menu1 {
  min-width: 66px;
  height: 82px;
  background-color: rgba(255, 255, 255, 0.9);
}
/deep/.van-tabs--line .van-tabs__wrap {
  //脱标，盒子是被内容撑开的 滑动不了
  width: 750px;
  position: fixed;
  top: 92px;
  z-index: 1;
  border-bottom: 1px solid #edeff3;
}
/deep/.van-pull-refresh {
  height: calc(100vh - 274px);
  overflow: auto;
}
</style>
