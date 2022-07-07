<template>
  <div>
    <!-- 我的频道 -->
    <div class="channel-container">
      <div class="title">
        <h3>我的频道</h3>
        <van-button
          type="warning"
          plain
          round
          size="mini"
          @click="isCloseShow = !isCloseShow"
          >{{ isCloseShow ? "完成" : "编辑" }}</van-button
        >
      </div>
      <van-row>
        <van-col span="6" v-for="(item, index) in myChannelList" :key="index">
          <div
            @click="onclick(index)"
            class="inner"
            :style="{ color: active === index ? 'red' : '' }"
          >
            {{ item.name }}
            <!-- 关闭图标 -->
            <van-icon
              v-show="isCloseShow"
              name="close"
              v-if="index !== 0"
              :style="{ color: active === index ? 'red' : '' }"
            />
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- 推荐频道 -->
    <div class="channel-container">
      <div class="title">
        <h3>推荐频道</h3>
      </div>
      <van-row>
        <van-col span="6" v-for="(item, index) in recommandList" :key="index">
          <div class="inner" @click="add(item.id)">+ {{ item.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'
import { getAllList, saveChannel } from '@/api/home'
import _ from 'lodash'
const CHANNELS = 'channels'
export default {
  name: 'ChannlPanel',
  props: {
    myChannelList: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  async created () {
    try {
      const { data: res } = await getAllList()
      // this.recommandList = res.data.channels.filter(item => this.myChannelList.every(item1 => item1.id !== item.id))
      // 使用lodash里面的函数进行简化
      this.recommandList = _.differenceBy(res.data.channels, this.myChannelList, 'id')
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      recommandList: [],
      isCloseShow: false
    }
  },
  methods: {
    add (id) {
      // 根据id找索引
      const index = this.recommandList.findIndex(item => item.id === id)
      // 根据索引新增数据
      this.myChannelList.push(this.recommandList[index])
      // 根据索引删除旧的数据
      this.recommandList.splice(index, 1)
    },
    onclick (index) {
      if (this.isCloseShow) {
        // 推荐标签是不能删除的 防止被删除
        if (index === 0) {
          return
        }
        // 删除
        const obj = this.myChannelList[index]
        this.myChannelList.splice(index, 1)
        this.recommandList.push(obj)
        // 解决点击前面的不能自己显示高亮的问题
        if (index < this.active) {
          this.$emit('del-event', this.active - 1)
        }
      } else {
        // 切换高亮
        this.$emit('change-active', index)
      }
    }
  },
  computed: {},
  watch: {
    // 频道数据持久化
    myChannelList: {
      async handler (newval) {
        // 登录过 就把数据利用ajax把数据存储到服务器中 没有登录就存储到本地
        if (this.$store.state.user && this.$store.state.user.token) { // 登陆过
          const arr = []
          newval.forEach((item, index) => {
            arr.push({ id: item.id, seq: index })
          })
          // 将频道数据传送到服务器
          try {
            await saveChannel(arr)
          } catch (error) {
            console.log(error)
          }
        } else { // 没有登录
          setItem(CHANNELS, newval)
        }
      },
      deep: true
    }
  },
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.channel-container {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
    padding-right: 16px;
    margin-bottom: 16px;
    h3 {
      font-size: 32px;
      font-weight: 400;
      color: #333;
    }
    .van-button {
      width: 104px;
      height: 48px;
      border-radius: 20px;
    }
  }
  .inner {
    position: relative;
    width: 160px;
    height: 86px;
    background-color: #f4f5f6;
    border-radius: 6px;
    font-size: 28px;
    font-weight: 400;
    color: #222;
    text-align: center;
    line-height: 86px;
    margin-left: 14px;
    margin-bottom: 22px;
    .van-icon {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  }
}
</style>
