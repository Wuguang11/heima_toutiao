<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <template v-else>
        <!-- 加载完成-文章详情 -->
        <div class="article-detail" v-if="article.art_id">
          <!-- 文章标题 -->
          <h1 class="article-title">{{ article.title }}</h1>
          <!-- /文章标题 -->

          <!-- 用户信息 -->
          <van-cell class="user-info" center :border="false">
            <van-image
              class="avatar"
              slot="icon"
              round
              fit="cover"
              :src="article.aut_photo"
            />
            <div slot="title" class="user-name">{{ article.aut_name }}</div>
            <div slot="label" class="publish-date">
              {{ article.pudate | dateformat }}
            </div>
            <!-- <van-button
              class="follow-btn"
              type="info"
              color="#3296fa"
              round
              size="small"
              icon="plus"
              >关注</van-button
            > -->
            <!-- <FollowUser
              :value="article.is_followed"
              @input="article.is_followed = $event"
            ></FollowUser> -->

            <FollowUser
              v-model="article.is_followed"
              :target="article.aut_id"
            ></FollowUser>
            <!-- <van-button
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
          </van-cell>
          <!-- /用户信息 -->

          <!-- 文章内容 -->
          <div
            class="article-content markdown-body"
            v-html="article.content"
          ></div>
          <van-divider>正文结束</van-divider>
          <!-- 文章评论组件 -->

          <!-- 将父组件接收的数据传给 子组件 -->
          <ArticleComment
            :source="article.art_id"
            type="a"
            @set-count="count = $event"
            :commentList="commentList"
            @replay-show="(comment = $event), (isReplay = true)"
          ></ArticleComment>
        </div>
        <!-- /加载完成-文章详情 -->

        <!-- 加载失败：404 -->
        <div class="error-wrap" v-else-if="is404Error">
          <van-icon name="failure" />
          <p class="text">该资源不存在或已删除！</p>
        </div>
        <!-- /加载失败：404 -->

        <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
        <div class="error-wrap" v-else>
          <van-icon name="failure" />
          <p class="text">内容加载失败！</p>
          <van-button class="retry-btn">点击重试</van-button>
        </div>
        <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
      </template>
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom" v-if="!isLoading && !!article.art_id">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="addCommentShow = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" :badge="count" color="#777" />
      <CollectArticle
        :is_collected.sync="article.is_collected"
      ></CollectArticle>
      <van-icon color="#777" name="good-job-o" />
      <van-icon
        name="share"
        color="#777777"
        @click="showShare = true"
      ></van-icon>
    </div>
    <!-- /底部区域 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
    <!-- 弹出框 -->
    <!-- 点击写评论的弹出框 -->
    <van-popup v-model="addCommentShow" position="bottom">
      <!-- 加v-if 是为了每次打开都是一个新的组件 -->
      <!-- 接收从父组件传递过来的数据 -->
      <AddComment
        v-if="addCommentShow"
        :target="article_id"
        @add-comment="commentList.unshift($event), (addCommentShow = false)"
      ></AddComment>
    </van-popup>
    <!-- 点击回复的弹出框 -->
    <van-popup v-model="isReplay" position="bottom" :style="{ height: '100%' }">
      <!-- 弹出层默认隐藏显示内部使用的是v-show 导致数据不更新  改用v-if每次隐藏组件会销毁 显示重新创建 created组件就会重新执行-->
      <ReplayComment
        :comment="comment"
        @close="isReplay = false"
        v-if="isReplay"
      ></ReplayComment>
    </van-popup>
  </div>
</template>

<script>
// 点击回复弹出框内容组件
import ReplayComment from './components/ReplayComment.vue'
// 底部评论弹窗内容组件
import AddComment from './components/AddComment.vue'
// 文章评论组件
import ArticleComment from './components/ArticleComment.vue'
import { ImagePreview } from 'vant'
import 'github-markdown-css'
import { getArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  async created () {
    try {
      const { data: res } = await getArticle(this.article_id)
      // console.log(res.data)
      this.article = res.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.is404Error = true
      }
    }
    // 取消掉加载
    this.isLoading = false
    // 在这一块的时候loading关闭了，页面就显示正文，但是必须还要写在nextTick
    // 因为数据更新 视图不能立即更新 写在nextTick里面可以 更新视图完才会触发nextTick
    // 获取正文里的图片
    // 通过querySelectorAll 获取所有的图片
    // 对图片进行遍历 先把所有图片的src地址放在arr1里
    // 然后给图片添加点击事件 点击的时候预览效果完成
    this.$nextTick(() => {
      const arr = document.querySelectorAll('.article-content img')
      // 防御代码 更安全
      if (arr.length === 0) return
      const arr1 = []
      arr.forEach((img, index) => {
        arr1.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: arr1,
            startPosition: index,
            showIndicators: true,
            maxZoom: 3
          })
        }
      })
    })
  },
  components: { ArticleComment, AddComment, ReplayComment },
  props: {
    article_id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      isLoading: true, // 页面刚打开时显示加载中
      article: {},
      is404Error: false,
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ],
      // 评论总数量
      count: null,
      // 底部弹出框的显示
      addCommentShow: false,
      commentList: [],
      // 控制点击回复弹出框的显示
      isReplay: false,
      // CommentItem传过来的数据
      comment: {}
    }
  },
  computed: {},
  watch: {},

  mounted () { },
  methods: {}
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
