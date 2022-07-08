<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <van-cell title="头像" is-link @click="showInput">
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="profile.photo"
        width="0.9rem"
        height="0.9rem"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="profile.name"
      is-link
      @click="isNameShow = true"
    />
    <van-cell
      title="性别"
      :value="profile.gender === 0 ? '男' : '女'"
      is-link
    />
    <van-cell
      title="生日"
      :value="profile.birthday"
      is-link
      @click="isBirthdayShow = true"
    />
    <!-- 修改昵称弹出层 -->
    <van-popup v-model="isNameShow" position="bottom" style="height: 100%">
      <van-nav-bar
        title="更改昵称"
        left-text="取消"
        right-text="保存"
        @click-left="onNameCancel"
        @click-right="onNameSave"
      />
      <!-- 这里filed不能使用v-model 是因为v-model会自动保存 产生问题  $event获取输入框中的内容 相当于把v-model回复原始写法-->
      <van-field
        @input="name = $event"
        :value="profile.name"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      />
    </van-popup>
    <!-- 修改生日弹窗 -->
    <van-popup v-model="isBirthdayShow" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 头像图片上传 -->
    <input
      type="file"
      style="display: none"
      accept="image/jpeg,img/png,image/gif,image/jpg"
      ref="file"
      @change="onChange"
    />
    <van-popup v-model="isAuatarShow" position="bottom">
      <UpdateAvatar
        :imgSrc.sync="imgSrc"
        @close="isAuatarShow = false"
      ></UpdateAvatar>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile } from '@/api/user'
import UpdateAvatar from './commponents/UpdateAvatar.vue'
export default {
  async created () {
    try {
      const { data: res } = await getUserProfile()
      // console.log(res.data)
      this.profile = res.data
    } catch (err) {
      this.$toast.fail('获取用户基本信息失败！')
    }
  },
  data () {
    return {
      // 存储获取到的数据
      profile: {},
      // 控制修改昵称弹窗出现
      isNameShow: false,
      // 昵称
      name: '',
      // 控制生日弹窗的出现
      isBirthdayShow: false,
      // 生日弹窗的数据
      minDate: new Date(1960, 10, 1),
      maxDate: new Date(2025, 10, 1),
      birthday1: '',
      // 控制图像图片弹窗的显示
      isAuatarShow: false,
      // 储存临时图片路径
      imgSrc: ''
    }
  },
  methods: {
    onNameCancel () {
      this.isNameShow = false
    },
    async onNameSave () {
      this.profile.name = this.name
      await this.save()
      this.isNameShow = false
    },
    async save () {
      try {
        const res = await updateUserProfile(this.profile)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    onConfirm () {
      this.profile.birthday = this.birthday1
      this.save()
      this.isBirthdayShow = false
    },
    // 点击实现file文件弹出
    showInput () {
      // 模拟人手的操作
      this.$refs.file.click()
    },
    // input输入框内容变化触发
    onChange () {
      // 浏览器中临时储存的图片路径
      const url = window.URL.createObjectURL(this.$refs.file.files[0])
      // console.log(url)
      this.imgSrc = url
      // 显示图像预览弹窗
      this.isAuatarShow = true
    }
  },
  computed: {
    currentDate: {
      get () {
        return new Date(this.profile.birthday)
      },
      set (newVal) {
        this.birthday1 = newVal.getFullYear() + '-' + (newVal.getMonth() + 1) + '-' + newVal.getDate()
      }
    }
  },
  watch: {},
  filters: {},
  components: { UpdateAvatar }
}
</script>

<style scoped lang='less'>
/deep/ .van-nav-bar__text {
  color: #fff;
}
</style>
