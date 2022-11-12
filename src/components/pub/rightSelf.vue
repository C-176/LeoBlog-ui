<template>
  <div class="rightSelf">

    <div class="script"><span class="iconfont">&#xe823;</span> 创作中心
      <a @click="$router.push('/back/scripts')">
        <span class="iconfont">&#xe7c4;</span>草稿箱 ({{ scriptSize }})</a></div>
    <div class="user">
      <div class="img">
        <!--        <img id="profilePhoto" alt="picture" :src="p(user.userProfilePhoto)">-->
        <a-avatar
            id="profilePhoto"
            :src="p(user.userProfilePhoto)"
            :style="{ backgroundColor: '#067061'  ,verticalAlign: 'middle' }"
            shape="square"
            size="middle"
        >
          {{ user.userNickname }}
        </a-avatar>
      </div>
      <div class="intro">
        <div class="name"><span class="iconfont">&#xe6b3;</span>
          {{ user.userNickname }}
        </div>
        <div class="intro1"><span class="iconfont">&#xe78b;</span>
          {{ user.userIntro }}
        </div>
      </div>
    </div>

    <div class="read">
      <a @click="$router.push('/back/articles')">
        <div class="artSum"><span class="iconfont">&#xe610;</span> 文章 <h3> {{ articleSize }}</h3></div>
      </a>
      <a @click="$router.push('/back/comments')">
        <div class="comSum"><span class="iconfont">&#xe654;</span> 评论 <h3>{{ commentSize }}</h3></div>
      </a>
    </div>
    <div class="news">
      <span class="iconfont">&#xe6db;</span>今日话题: <br>{{ hotTopic }}
    </div>
    <div class="go">
      <a id="go" @click="$router.push('/write/0')">开始创作 <span class="iconfont">&#xe823;</span></a>
    </div>

  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'rightSelf',
  data() {
    return {
      articleSize: 0,
      commentSize: 0,
      scriptSize: 0,
      hotTopic: '今天天气不错',
    }
  },
  created() {
    this.$axios.get('/article/sum/user/' + this.user.userId).then(res => {
      this.articleSize = res.data.data.articleSize;
      this.scriptSize = res.data.data.scriptSize;
      this.commentSize = res.data.data.commentSize;
    });
  },
  watch: {
    user() {

    }
  },
  methods: {}, computed: {
    ...mapState(['user'])
  }
}

</script>

<style scoped>
.rightSelf {
  background: #fff;
  height: auto;
  /*box-shadow: 1px 3px 11px #869d9d;*/
  border-radius: 5px;
  margin-left: 30px;
  width: 330px;
  position: fixed;
  top: 60px;
  right: 5%;
  /*margin-top: 0*/
}


.rightSelf .script {
  width: 100%;
  height: 30px;
  margin: 5px;
  position: relative;
  line-height: 30px;
  font-size: 13px;
  font-weight: 600;
}

.rightSelf .script a {
  /* display: block; */
  height: 100%;
  width: 100%;
  color: #9ca29d;
  font-size: 13px;
  margin-left: 150px;
  font-weight: 400;
}

.rightSelf .user {
  height: 120px;
  width: 100%;
  /*background: #fff;*/
  padding: 20px 10px;
  background-color: rgba(216, 227, 231, 0.39);
}

.user .img {

  height: 85px;

  width: 85px;

  border-radius: 5px;

  float: left;

  margin-right: 15px;
  overflow: hidden;
}

#profilePhoto {
  width: 100%;
  height: 100%;
  /*backgorund-size: 100% 100%;*/
  vertical-align: middle;
  /*border-style: none;*/
}

.rightSelf .creat {
  margin-top: 0px;
  width: 100%;
  height: 62px;
  /* background-color: #0086b3; */
  line-height: 62px;
}

.intro {
  float: left;
  width: 60%;
  height: 120px;
  line-height: 40px;
  text-align: left;
}

.intro .name {
  height: 40px;
  width: 100%;
  color: #134857;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
}

.intro .intro1 {
  height: 60px;
  width: 100%;
  color: #134857;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
}

.creat > span {
  width: 0px;
  height: 50px;
  margin-left: 35px;
  float: left;
  font-size: 35px;
  margin-right: 140px;
  transition: width 0.5s;
  line-height: 50px;
}

.creat > a {
  display: block;
  margin: 0px 21px;
  color: #8590a6;
  float: left;
  height: 100%;
  transition: all 0.5s;
  line-height: 62px;
  font-weight: 600;
}


.creat > a > span {
  font-size: 30px;
}

.read {
  height: 80px;
  width: 100%;
  /* background-color: rgba(216, 227, 231, 0.39); */
  color: black;
  font-size: 15px;
  padding: 10px;
  line-height: 30px;
}

.news {
  margin-top: 7px;
  height: auto;
  width: 100%;
  /*background-color: #ff6700;*/
  color: black;
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  line-height: 27px;
  border-top: 1px solid #8590a661;
}

.go {
  margin: 20px auto 20px auto;
  width: 50%;
  height: 40px;
  line-height: 40px;
  background-color: #eef2f4;
  border-radius: 10px;
  /*box-shadow: 1px 1px 5px #134857;*/
  outline: none;
  /*border: none;*/
  position: relative;

}

.go:hover {
  cursor: pointer;
}

.go::before {
  content: '';
  z-index: -1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 2px solid rgba(134, 157, 157, 0.19);
  transform-origin: center;
  transform: scale(1);
  border-radius: 10px;
}

.go:hover::before {
  transition: all 0.75s ease-in-out;
  transform-origin: center;
  transform: scale(1.75);
  opacity: 0;
}

.go a {
  display: block;
  height: 100%;
  width: 100%;
  color: #134857;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
}

.rightSelf .script a:hover {
  transition: all .2s;
}

.read .artSum, .read .comSum {
  float: left;
  height: 100%;
  width: 45%;
  font-size: 16px;
  color: #134857;
  border-radius: 10px;
  background: #f0f4f6;
  line-height: 29px;
}

.read .comSum {
  margin-left: 30px;
}
</style>