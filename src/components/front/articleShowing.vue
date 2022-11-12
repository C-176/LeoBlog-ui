<template>
  <bread>文章</bread>
  <div class="whole" style="margin-top: 60px">
    <template v-if="loading">
      <a-skeleton active/>
      <a-skeleton active/>
      <a-skeleton active/>
    </template>

    <template v-else>

      <img v-if="article.articlePic!=''&&article.articlePic!=null" class="picture" alt="picture"
           :src="p(article.articlePic)"/>

      <div class="title"><span class="iconfont" v-html="article.articleTitle"></span></div>
      <div class="labels">
        <div style="  text-align: left;">
          <Tag :color="getColor()" v-for="label in article.labels" :key="label.labelId">
            {{ label.labelName }}
          </Tag>
        </div>
      </div>
      <div class="author">
        <user :user="article.user">
          <!--          <img class="left" :src="p(article.user.userProfilePhoto)"/>-->
          <a-avatar
              :src="p(article.user.userProfilePhoto)"
              :style="{ backgroundColor: '#067061'  ,verticalAlign: 'middle'}"
              class="left"
              shape="circle"
              size="middle"
          >
            {{ article.user.userNickname }}
          </a-avatar>
        </user>
        <div class="right">
          <div class="name">{{ article.user.userNickname }}</div>
          <div class="detail">{{ article.user.userCertification }}</div>
        </div>
      </div>
      <div class="content">
        <span v-html="article.articleContent"></span>
      </div>

      <div class="updateTime"><span class="iconfont">&#xe6fb;</span>最后更新时间: {{ article.articleUpdateDate }}
      </div>
      <a-divider style="height: 1px"/>
      <!--      <el-affix position="bottom" target=".content" :offset="10">-->

      <template v-if="article.isArticle === 1">
        <div class="toolbar">
          <a class="like" @click="like(article.articleId)">点赞<span
              class="iconfont">&#xe605;</span>{{ article.articleLikes }} </a>
          <a class="reply" @click="comment()">评论<span
              class="iconfont">&#xe646;</span>{{ article.articleComments }} </a>
          <a class="collect" @click="collect(article.articleId)">收藏<span
              class="iconfont">&#xe8b9;</span>{{ article.articleCollects }} </a>
          <a class="share" @click="share(article.articleId)">分享<span class="iconfont">&#xe73a;</span>
          </a>
        </div>
      </template>
      <!--      </el-affix>-->
      <transition name="fade">
        <div v-if="showComment">
            <textarea v-model="commentIn" class="commentIn" placeholder="请输入内容... | Enter键发送"
                      @keyup.enter="saveComment(-1)">
            </textarea>
          <a-button id="enter" ghost shape="round" size="small" type="primary"
                    @click="saveComment(-1,article.user.userId)">
            <!--              <template #icon>-->
            <!--                <enter-outlined/>发送-->
            <!--              </template>-->
          </a-button>
        </div>

      </transition>


    </template>

  </div>

  <comment-template v-if="article.isArticle === 1"
                    :comments="comments" :method="getComments">

  </comment-template>

  <a-back-top/>

</template>

<script>
import h from "@/components/pub/header";
import commentTemplate from "@/components/pub/commentTemplate";
import {Divider, Tag} from 'ant-design-vue';
import {EnterOutlined} from '@ant-design/icons-vue';
import user from "@/components/pub/user";

export default {
  name: 'forward-article',
  components: {h, commentTemplate, Divider, Tag, EnterOutlined, user},
  data() {
    return {
      loading: true,
      showComment: false,
      commentIn: '',
      colors: [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple'
      ],
      article: {
        articleId: 1,
        isArticle: 1,
        articleTitle: '',
        articleContent: '',
        articlePic: '',
        articleUpdateDate: '',
        articleLikes: 0,
        articleComments: 0,
        articleCollects: 0,
        labels: [],
        user: {
          userId: 1,
          userName: '',
          userProfilePhoto: '',
          userCertification: ''
        },
      },
      comments: [{
        articleId: 1,
        articleTitle: '',
        commentId: 1,
        user: {
          userId: 1,
          userName: '评论者',
          userProfilePhoto: 'https://pic2.zhimg.com/v2-3b5a34f6a7e09d1b1f6f21400af9de2c_xl.jpg?source=32738c0c',
        },
        commentContent: '评论内容',
        commentLikes: 0,
        commentUpdateTime: '2020-05-27 15:36:05',
        value: [{
          commentId: 1,
          user: {
            userId: 1,
            userNickname: '评论者',
            userProfilePhoto: 'https://pic2.zhimg.com/v2-3b5a34f6a7e09d1b1f6f21400af9de2c_xl.jpg?source=32738c0c',
          },
          commentParentId: 0,
          commentUpdateTime: "2020-05-27 15:36:05",
          commentLikes: 0,
          commentContent: " 你说咱们这个专业从事什么最好"
        }, {
          commentId: 2,
          commentLikes: 1000,
          user: {
            userId: 0,
            userProfilePhoto: 'https://pic2.zhimg.com/v2-3b5a34f6a7e09d1b1f6f21400af9de2c_xl.jpg?source=32738c0c',
            userNickname: '回复人',
          },
          commentParentId: 0,
          commentUpdateTime: "2020-05-27 15:36:05",
          commentContent: "2.那么怎么知道左子树与右子树对不对称呢？在这我直接叫为左树和右树 答案：如果左树的左孩子与右树的右孩子对称，左树的右孩子与右树的左孩子对称，那么这个左树和右树就对称。"
        },

        ]
      }
      ]

    }
  },
  created() {
    this.$axios.get(this.baseURL + "/article/" + this.$route.params.articleId).then((res) => {
      if (res.data.code === 200) {
        this.article = res.data.data
        this.article.user = JSON.parse(this.article.user)
        //将articleUpdateDate转换为yyyy-MM-dd HH:mm:ss格式
        this.article.articleUpdateDate = this.$moments(this.article.articleUpdateDate)
      }
    })

    //获取评论
    this.getComments()

  },
  methods: {

    getColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
    share(articleId) {
      this.$st("分享成功", "success")
    },
    collect(articleId) {
      this.$axios.get("/article/collect/" + articleId).then((res) => {
        if (res.data.code === 200) {
          if (res.data.data == "取消收藏成功") {
            this.article.articleCollects -= 1
          } else {
            this.article.articleCollects += 1
          }
        } else {
          this.$st(res.data.data, 'error')
        }

      })
    },
    like(articleId) {
      this.$axios.get("/article/like/" + articleId).then((res) => {
        if (res.data.code === 200) {

          if (res.data.data == "取消点赞成功") {
            this.article.articleLikes -= 1
            this.$st(res.data.data, 'success')
          } else {
            this.article.articleLikes += 1
            this.$st(res.data.data, 'success')
          }
        } else {
          this.$st(res.data.data, 'error')
        }


      })
    },
    comment() {
      this.showComment = !this.showComment
      if (!this.showComment) {
        this.commentIn = ""
        //清除行内样式
        document.getElementsByClassName("reply")[0].style.backgroundColor = ""
      } else {
        document.getElementsByClassName("reply")[0].style.backgroundColor = "#edf3f4"
      }

    },
    saveComment(commentParentId, commentUserId) {
      //输入框是否focus
      if (this.commentIn.trim() == "") {
        this.$st("评论内容不能为空", "error")
        this.commentIn = ""
        return
      }
      if (commentParentId == -1) {
        this.$axios.post(this.baseURL + "/comment/add", {
          userId: this.$store.state.user.userId,
          articleId: this.$route.params.articleId,
          commentParentId: -1,
          commentContent: this.commentIn,
          receiverId: this.article.user.userId
        }).then((res) => {
          if (res.data.code === 200) {
            this.$st(res.data.data, 'success')
            this.commentIn = ""
            this.article.articleComments += 1
            this.getComments()
            this.comment()

          } else {
            this.$st(res.data.data, 'error')
          }


        })
        return
      }
      this.$axios.post(this.baseURL + "/comment/add", {
        userId: this.$store.state.user.userId,
        articleId: this.$route.params.articleId,
        commentParentId: commentParentId,
        commentContent: this.commentIn,
        receiverId: commentUserId
      }).then((res) => {
        if (res.data.code === 200) {
          this.$st(res.data.data, 'success')
          this.commentIn = ""
          this.getComments()

        } else {
          this.$st(res.data.data, 'error')
        }


      })

    },
    getComments() {
      this.$axios.get(this.baseURL + "/comment/list/article/" + this.$route.params.articleId).then((res) => {
        if (res.data.code === 200) {
          this.comments = res.data.data
          this.comments.forEach((item) => {
            item.articleTitle = ''
            item.articleId = this.article.articleId
            item.commentUpdateTime = this.$moments(item.commentUpdateTime)
            item.value.forEach((item3) => {
              item3.commentUpdateTime = this.$moments(item3.commentUpdateTime)
            })
          })

        }
      })
    }

  },
  watch: {
    article() {
      this.$nextTick(() => {
        this.loading = false
      })
    }
  }
}

</script>

<style scoped>

#enter {
  color: #7c929c;
  border-color: #7c929c;
  position: absolute;
  margin-left: -100px;
  margin-top: calc(4%);
}

#enter:hover {
  background: rgba(124, 146, 156, 0.68);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.commentIn {

  background-color: #fff;
  border: 2px solid #ecf0f2;
  width: 100%;
  height: 100px;
  border-radius: 10px;
  resize: none;
  outline: none;
  padding: 10px;
}

.picture {
  height: calc(60%);
  /*height: calc(50%);*/
  width: 60%;
  overflow: hidden;
  border-radius: 10px;
  /*box-shadow: 1px 3px 11px #134857;*/
}

.toolbar {
  width: 100%;
  height: 30px;
  text-align: center;


}

.toolbar a {
  font-size: 13px;
  background: #fff;
  color: #8590a6;
  float: left;
  display: block;
  width: 25%;
  height: 100%;
  line-height: 30px;
  margin-top: 10px;
  border-radius: 5px;
}

.toolbar a:hover {
  background-color: #edf3f4;
  transition: all 0.3s;

}

.whole {
  background: #fff;
  float: left;
  width: 65%;
  margin-left: calc(17.5%);
  border-radius: 5px;
  padding: 10px;
  /*margin-top: 60px;*/

}


.title {
  /*height: 60px;*/
  line-height: 60px;
  font-size: 22px;
  font-weight: 600;
  text-align: left;
}

.author {
  height: 60px;
  width: 100%;
  font-weight: 600;
  margin-top: 10px;

}

.author .left {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  float: left;
  margin-top: 5px;
}

.left:hover {
  cursor: pointer;
}

.author .right {
  float: left;
  margin-left: 10px;
  margin-top: 5px;
}

.right .name {
  font-size: 20px;
  /*margin-bottom: 5px;*/
  text-align: left;
}

.right .detail {
  font-size: 14px;
  text-align: left;
}


.content {
  line-height: 30px;
  font-size: 14px;
  /* font-weight: 600; */
  margin-bottom: 20px;
  padding: 10px 10px;
  text-align: left;
}

.updateTime {
  width: 100%;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  color: #8590a6;

  text-align: right;
  margin-bottom: 10px;
}

:deep(video) {
  width: 60%;
  margin-left: 20%;
  /*height: 100%;*/
  border-radius: 10px;
}

:deep(pre) {
  background: #f4f4f4 !important;
  border-radius: 5px !important;
  padding: 10px !important;
}
</style>