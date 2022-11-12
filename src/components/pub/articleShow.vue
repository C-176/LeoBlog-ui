<template>
  <div class="whole">
    <template v-if="$loading">
      <a-skeleton active/>
      <a-skeleton active/>
      <a-skeleton active/>
    </template>

    <template v-else>

      <el-empty v-if="articles.length===0" description="暂无结果"/>
      <!--      文章展示-->
      <div v-for="(article,index) in myArticles" v-else :key="article.articleId" class="Article">

        <div v-if="article.articlePic!='' && article.articlePic!=null" class="img">
          <el-image
              :preview-src-list="[p(article.articlePic)]"
              :src="p(article.articlePic)"
              close-on-press-escape
              fit="cover"
              hide-on-click-modal
              style="height: 100%"
          />
        </div>

        <div :class="{isFull:article.articlePic=='' || article.articlePic==null}"
             class="right">
          <div class="at"><a href="javascript:void(0)">
            <router-link :to="'/article/'+article.articleId"><span class="iconfont">&#xe630;</span>
              <span v-html="article.articleTitle"></span>
            </router-link>
          </a>
          </div>

          <div class="author">
            <el-link style="color:#111" type="info" @click="$router.push('/user/'+article.userId)"><span
                class="iconfont">&#xe6b3;</span> {{ article.author }}
            </el-link>
          </div>
          <div class="comment"><span v-html="article.articleContent"></span></div>

          <div class="toolbar">
            <a class="like" @click="like(article.articleId,index)">点赞<span
                class="iconfont">&#xe605;</span>{{ article.articleLikes }} </a>
            <!--          <a class="reply" @click="comment(article.articleId)">评论<span-->
            <!--              class="iconfont">&#xe646;</span>{{ article.articleComments }} </a>-->
            <a class="collect" @click="collect(article.articleId,index)">收藏<span
                class="iconfont">&#xe8b9;</span>{{ article.articleCollects }} </a>
            <a class="share" @click="share(article.articleId,index)">分享<span class="iconfont">&#xe73a;</span> </a>
          </div>
        </div>

        <a-divider style="height: 2px; background-color: #afb2b2"/>
      </div>

    </template>

  </div>

</template>

<script>

export default {
  name: 'articleShow',
  props: ['articleList', 'scrollBottom'],
  data() {
    return {
      articles: [
        {
          articleId: 1,
          articleTitle: '文章标题',
          articleContent: '文章内容',
          articlePic: '',
          author: '作者',
          articleUpdateDate: '2020-05-27 15:36:05',
          articleLikes: 0,
          articleComments: 0,
          articleCollects: 0,

        },

      ],
    }
  },
  computed: {

    myArticles() {
      this.articles = this.articleList
      // 根据articleList中每个article的userId获取user信息
      this.articleList.forEach((item, index) => {
        this.$axios.get("/user/" + item.userId).then((res) => {
          if (res.data.data != null) {
            this.articles[index].author = res.data.data.userNickname
          }
        })

      })
      // for(let i=0;i<this.articles.length;i++){
      //   this.$store.dispatch('getUserById', this.userId).then(res => {
      //     //获取promise中的信息
      //     this.articles[index].author = res.data.data.userNickname
      //   })
      // }
      return this.articles

    }


  },
  watch: {},
  methods: {
    share(articleId) {
      this.$message.success("分享成功")
    },
    addCollectMessage(articleId) {
      let a = this.articles.find(item => item.articleId === articleId)
      this.$axios.post("/message/add", {
        messageTitle: "收藏了你的文章",
        messageContent: a.articleTitle,
        userId: this.$store.state.user.userId,
        receiverId: a.userId,
      }).then(res => {
        console.log(res.data.data)
      })
    },
    collect(articleId, index) {
      this.$axios.get("/article/collect/" + articleId).then((res) => {
        if (res.data.code === 200) {
          if (res.data.data == "取消收藏成功") {
            this.articles[index].articleCollects -= 1
          } else {
            this.articles[index].articleCollects += 1
            this.addCollectMessage(articleId)
          }
        } else {
          this.$st(res.data.data, 'error')
        }


      })
    },
    comment(articleId) {
      this.$router.push("/article/" + articleId)
    },
    like(articleId, index) {
      this.$axios.get("/article/like/" + articleId).then((res) => {
        if (res.data.code === 200) {

          if (res.data.data == "取消点赞成功") {
            this.articles[index].articleLikes -= 1
          } else {
            this.articles[index].articleLikes += 1
          }
        } else {
          this.$st(res.data.data, 'error')
        }


      })
    }
  },
  mounted() {
    // console.log(this.articleList)
    this.$loading = false
  },


}

</script>

<style scoped>
.iconfont {
  /*font-size: 20px;*/
}

:deep(.at p) {
  display: inline-block !important;
}

.toolbar {
  width: 100%;
  height: 10%;
  text-align: center;
  text-align: center;

}

.toolbar a {
  font-size: 13px;
  color: #8590a6;
  float: left;
  display: block;
  width: 33%;
  height: 100%;
  line-height: calc(200%);
  margin-top: 10px;
  border-radius: 5px;
}

.toolbar a:hover {
  background-color: #edf3f4;
  transition: all 0.3s;

}

/*.index {*/

/*  width: 100vw;*/
/*  height: calc(100vh - 50px);*/
/*  background-size: 100% 100%;*/
/*}*/

.whole {
  background: #fff;
  width: 65%;

  border-radius: 5px;
  padding: 10px;
}

.whole > div {
  width: 100%;
}

.whole .Article {
  /*position: relative;*/
  border-radius: 5px;
  height: 250px;
  /*border-bottom: 1px solid #869d9d;*/
  margin: 10px 0;
}

.whole .Article .img {
  float: left;
  margin: 40px 10px;
  height: 67%;
  width: 25%;
  border-radius: 10px;
  /*box-shadow: 1px 3px 11px #134857;*/
  overflow: hidden;
}

.Article .img img {
  /*background-size: 100% 100%;*/
  background-repeat: no-repeat;
  height: 100%;
  /*width: 100%;*/
  border-radius: 5px;

}

.right {
  float: left;
  height: 100%;
  width: 70%;
  padding: 0 0 0 10px;
}

.right .at {
  width: 100%;
  height: 15%;
  line-height: 30px;
  font-size: 15px;
  text-align: left;
  -webkit-mask-image: -webkit-linear-gradient(right, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 1) 10%);

}

.right .at a {
  display: block;
  color: #132c33;
  height: 100%;
  width: 100%;
  font-weight: 600;
}

.right .author {
  height: 10%;
  line-height: 25px;
  font-size: 13px;
  color: #8590a6;
  text-align: left;
}

.right .comment {
  height: 60%;
  width: 100%;
  font-size: 13px;
  text-align: left;
  color: #8590a6;
  line-height: 25px;
  margin-top: -2px;
  -webkit-mask-image: -webkit-linear-gradient(bottom, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 1) 10%);
}

.isFull {
  width: 80%;
  margin-left: 10%;

}

:deep(video,img) {
  width: 60%;
  margin-left: 20%;
  border-radius: 10px;
}
</style>