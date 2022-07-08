<template>
  <div>
    <!-- 已登录 -->
    <div class="header header-login" v-if="user && user.token">
      <div class="avatar">
        <div class="left">
          <van-image
            round
            width="1.76rem"
            height="1.76rem"
            :src="userInfo.photo"
          />
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="button" @click="$router.push('/user')">编辑资料</div>
      </div>
      <ul class="list">
        <li>
          <p>{{ userInfo.art_count }}</p>
          <p>头条</p>
        </li>
        <li>
          <p>{{ userInfo.fans_count }}</p>
          <p>粉丝</p>
        </li>
        <li>
          <p>{{ userInfo.follow_count }}</p>
          <p>关注</p>
        </li>
        <li>
          <p>{{ userInfo.like_count }}</p>
          <p>获赞</p>
        </li>
      </ul>
    </div>
    <!-- 未登录 -->
    <div class="header header-not-login" v-else>
      <div class="inner">
        <img src="@/assets/mobile.png" />
        <p @click="$router.push('/login')">登录 / 注册</p>
      </div>
    </div>
    <!-- 便签栏 格栅 -->
    <van-grid :column-num="2">
      <van-grid-item text="收藏">
        <template #icon>
          <i class="toutiao toutiao-shoucang"> </i>
        </template>
      </van-grid-item>
      <van-grid-item text="历史">
        <template #icon>
          <i class="toutiao toutiao-lishi"> </i>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- 单元格 -->
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="小智同学" is-link />
    </van-cell-group>
    <!-- 退出登录 -->
    <van-button
      type="default"
      block
      class="logout"
      v-if="user && user.token"
      @click="logout"
      >退出登录</van-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'my',
  async created () {
    if (this.user && this.user.token) {
      try {
        const { data: res } = await getUserInfo()
        // console.log(res.data)
        this.userInfo = res.data
      } catch (err) {
        this.$toast.fail('获取用户信息失败')
      }
    }
  },
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    async logout () {
      try {
        await this.$dialog.confirm({ message: '确认退出吗' })
        this.$store.commit('setUser', {})
      } catch (error) {
        this.$toast.fail('退出登录失败,请稍后重试！')
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.header {
  width: 750px;
  height: 401px;
  background: rgb(50, 150, 250, 0.7) url("@/assets/banner.png") no-repeat 0 0 /
    cover;
}
.header-not-login {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 132px;
    height: 132px;
    margin-bottom: 15px;
  }
  p {
    font-size: 28px;
    font-weight: 400;
    color: #fff;
  }
}
.header-login {
  padding: 123px 0 0 0;
  .avatar {
    margin-bottom: 55px;
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .button {
      width: 116px;
      height: 33px;
      background-color: #ffffff;
      border-radius: 16px;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 1px;
      color: #666666;
      text-align: center;
    }
    .left {
      display: flex;
      align-items: center;
      span {
        margin-left: 22px;
        font-size: 30px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 1px;
        color: #ffffff;
      }
    }
  }
  .list {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      p {
        color: #fff;
        font-weight: 400;
        &:nth-child(1) {
          font-size: 36px;
        }
        &:nth-child(2) {
          font-size: 23px;
        }
      }
    }
  }
}
.toutiao {
  font-size: 45px;
}
.van-grid-item {
  &:nth-child(1) {
    color: #eb5253;
  }
  &:nth-child(2) {
    color: #ff9d1d;
  }
  /deep/ .van-grid-item__text {
    font-size: 28px;
  }
}
.van-cell-group {
  margin: 10px 0;
}
.logout {
  color: #d86262;
}
</style>
