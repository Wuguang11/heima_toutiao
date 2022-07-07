<template>
  <van-field
    v-model.trim="message"
    rows="2"
    autosize
    type="textarea"
    maxlength="50"
    placeholder="请输入留言"
    show-word-limit
    class="add-field"
    ref="field"
  >
    <template #extra>
      <!-- 当输入框没有内容的时候，按钮就应该是禁用的 -->
      <van-button
        type="default"
        class="btn"
        :disabled="message.length === 0"
        @click="onClick"
        >发布</van-button
      >
    </template>
  </van-field>
</template>
<script>
import { addComment } from '@/api/article'
export default {
  name: 'AddComment',
  props: {
    target: {
      type: [String, Number],
      required: true
    },
    art_id: {
      type: [String, Number]
    }
  },
  created () { },
  data () {
    return {
      message: ''
    }
  },
  mounted () {
    // 组件最终会渲染成dom结构 $el 可以获取到这个组件的根标签
    this.$refs.field.$el.querySelector('textarea').focus()
  },
  methods: {
    async onClick () {
      try {
        const res = await addComment({
          target: this.target,
          content: this.message,
          // 这里的art_id 是ReplayComment组件传递过来的 不会影响前面发送请求
          art_id: this.art_id
        })
        // console.log(res)
        // 状态提升 将获取到的数据传递给父组件
        this.$emit('add-comment', res.data.data.new_obj)
      } catch (err) {
        console.log(err)
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
.add-field {
  align-items: center;
  .btn {
    border: none;
  }
}
</style>
