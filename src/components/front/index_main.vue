<template>
  <!--  加载完毕之前显示骨架屏-->
  <!--  <el-skeleton v-if="loading" :rows="5" animated />-->
  <scroll-pics></scroll-pics>
  <article-show :article-list="articleList"></article-show>
  <right-self></right-self>
  <copy-right></copy-right>


  <a-back-top/>

<!--  <el-slider-->
<!--      v-model="value"-->
<!--      :max="max"-->
<!--      :format-tooltip="formatTooltip"-->
<!--      @input="inputSlider"-->
<!--      style="color: #fff;height:10px;margin-bottom: 10px"-->
<!--  />-->

</template>

<script>
import scrollPics from "@/components/pub/scrollPics";
import articleShow from "@/components/pub/articleShow";
import rightSelf from "@/components/pub/rightSelf";
import chat from "@/components/pub/chat";
import BgCover from "@/components/pub/BgCover";
import copyRight from "@/components/pub/copyRight";


export default {
  name: 'index_main',
  components: {
    scrollPics,
    articleShow,
    rightSelf,
    chat,
    BgCover,
    copyRight
  },
  data() {
    return {
      articleList: [],
      currentPage: 0,
      pageSize: 20,
      max: 0,
      value: 0,


    }
  },
  watch: {},

  created() {
    this.queryArticle()
    window.addEventListener('scroll', this.scrollBottom);
  },
  beforeRouteLeave() {
    window.removeEventListener('scroll', this.scrollBottom)//页面离开后销毁监听事件
  },

  methods: {
    queryArticle() {
      this.currentPage++;
      //获取articleList,一次获取20条
      this.$axios.get('/article/list/' + this.currentPage + '/' + this.pageSize).then((res) => {
        let map = res.data.data
        this.articleList = this.articleList.concat(map.records)
        this.$nextTick(() => {
          this.max = document.documentElement.scrollHeight
          this.value = document.documentElement.scrollTop || document.body.scrollTop;
        })
      })
    }
    ,
    //如果滚动条到最底下，加载更多
    scrollBottom() {
      //监听滚动条滚动事件

      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight;
      this.max = scrollHeight - clientHeight
      this.value = scrollTop;
      if (scrollTop + clientHeight >= scrollHeight) {
        this.queryArticle();
      }
    }
    ,
    formatTooltip(value) {
      //保留两位小数
      return `${Math.round(value * 100 / this.max)}%`
    }
    ,
    inputSlider(value) {
      this.value = value;
      //将滚动条滚动到指定位置
      document.documentElement.scrollTop = value
    }
    ,


  }

}

</script>

<style scoped>
.whole {
  margin-top: 504px;
}

::-webkit-scrollbar {
  display: none;
}

:deep(.el-slider__bar) {
  background: #fff !important;
}

:deep(.el-slider) {
  position: fixed;
  bottom: 0px;
  /*margin-top: 20px;*/
}

.whole {
  margin-left: 60px;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

</style>