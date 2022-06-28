<template>
  <div>
    <van-nav-bar title="登录" @click-left="$router.back()">
      <van-icon name="cross" slot="left" />
    </van-nav-bar>
    <!-- 表单 -->
    <van-form @submit="onSubmit" ref="form">
      <van-field
        v-model.trim="mobile"
        name="mobile"
        maxlength="11"
        placeholder="请输入手机号"
        :rules="[
          { required: true, message: '请输入正确手机号' },
          {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
            message: '手机号格式输入错误',
          },
        ]"
      >
        <!-- <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template> -->
        <MyIcon name="shouji" slot="left-icon"></MyIcon>
      </van-field>
      <van-field
        v-model.trim="code"
        name="code"
        maxlength="6"
        placeholder="请输入验证码"
        :rules="[
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码输入格式错误' },
        ]"
      >
        <!-- 前半部的字体图标插槽 -->
        <MyIcon name="yanzhengma" slot="left-icon"></MyIcon>
        <!-- 后半部分的发送验证码插槽 -->
        <template #button>
          <van-button
            v-if="isCountDone"
            size="small"
            class="sendSms"
            native-type="button"
            @click="onGetSms"
            >发送验证码</van-button
          >
          <van-count-down
            :time="time"
            format="ss s"
            v-else
            @finish="isCountDone = true"
          />
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block native-type="submit" class="login"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { getSmsCode, login } from '@/api/user'
export default {
  created () { },
  data () {
    return {
      mobile: '15738829758',
      code: '246810',
      time: 5 * 1000,
      isCountDone: true
    }
  },
  methods: {
    async onSubmit (values) {
      try {
        const { data: res } = await login(values)
        console.log(res.data)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')
        this.$router.push('/')
      } catch (error) {
        this.$toast.fail('提交失败')
      }
    },
    async onGetSms () {
      try {
        await this.$refs.form.validate('mobile')
        try {
          const res = await getSmsCode(this.mobile)
          this.$toast.success('发送验证码成功')
          console.log(res)
        } catch (error) {
          this.$toast.fail('发送验证码失败')
        }
        // 显示倒计时
        this.isCountDone = false
      } catch (error) {
        console.log(error)
        // 轻提示效果
        this.$toast.fail('发送验证码失败')
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.sendSms {
  width: 152px;
  height: 46px;
  background-color: #ededed;
  border-radius: 23px;
  line-height: 46px;
  color: #666;
  .van-button__text {
    zoom: 0.96;
    font-size: 22px;
  }
}
.login {
  width: 694px;
  height: 88px;
  background-color: #6db4fb;
  border-radius: 10px;
  color: #fff;
  font-size: 30px;
}
.van-button {
  position: fixed;
  right: 15px;
}
.van-count-down {
  position: fixed;
  right: 25px;
}
</style>
