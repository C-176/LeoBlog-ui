<template>

  <div class="wholeDiv">
    <!--    <template v-if="loading">-->
    <!--      <a-skeleton active/>-->
    <!--      <a-skeleton active/>-->
    <!--      <a-skeleton active/>-->
    <!--    </template>-->

    <!--    <template v-else>-->
    <!--      头部滚动图-->
    <div class="a" @mouseleave="leave">
      <transition name="fade">
        <div v-if="show">
          <el-image
              class="b"
              :src="mainPic"
              :initial-index="index"
              fit="cover"
              :preview-src-list="picUrl"
              hide-on-click-modal
              close-on-press-escape
              ref="image"
          />
        </div>
      </transition>
      <div class="c">
        <div v-for="i in [0,1,2,3,4]" class="d" @mouseover="over(i)" :class="{dd:isSelected[i]}">
          <img :src="picUrl[i]" alt="pic">
        </div>
      </div>
    </div>
    <!--    </template>-->
  </div>

</template>

<script>
export default {
  name: 'scrollPics',
  data() {
    return {
      show: true,
      loading: true,
      index: 0,
      randomList: [1, 1, 1, 1, 1],
      picUrl: [],
      mainPic: '',
      isSelected: [true, false, false, false, false],
      integral: null,
    }
  },
  watch: {
    // picUrl() {
    //   this.$nextTick(() => {
    //     this.mainPic = this.picUrl[0]
    //     setTimeout(() => {
    //       this.loading = false
    //     }, 3000)
    //     // this.loading = false
    //   })
    // }
  },

  created() {
    this.randomList = this.randomNum(1, 167, 5);
    this.picUrl = this.randomList.map((item) => {
      // return this.baseURL + '/source/images/index/' + item + '.jpg'
      return '/src/source/images/index/' + item + '.jpg'
    });
    // 将picUrl中的图片存下来,返回链接数组
    // this.mainPic = ()=> import(this.picUrl[0]);
    this.mainPic = this.picUrl[0];
    // 开始循环
    this.scroll();

  },
  methods: {
    //随机产生不重复的5个数
    randomNum(min, max, n) {
      var r = [];
      for (var i = 0; i < n; i++) {
        var flag = true;
        var random = Math.floor(Math.random() * (max - min + 1) + min);
        for (var j = 0; j < r.length; j++) {
          if (random === r[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          r.push(random);
        } else {
          i--;
        }
      }
      return r;
    },
    scroll() {
      this.integral = setInterval(() => {
        this.show = false
        for (var i = 0; i < 5; i++) {
          if (this.isSelected[i]) {
            let select = i === 4 ? 0 : i + 1;
            this.isSelected[select] = true;
            this.index = select;

            this.isSelected[i] = false;


            this.$nextTick(() => {
              this.mainPic = this.picUrl[select];
              this.show = true
            });
            break;
          }
        }
      }, 4000)

    },
    over(index) {
      this.show = false
      this.index = index;
      this.$nextTick(() => {
        this.mainPic = this.picUrl[index];
        this.show = true
      });
      // this.mainPic = this.picUrl[index];
      //取消循环
      this.integral = clearInterval(this.integral);
      // clearInterval(this.integral);
      for (var i = 0; i < 5; i++) {
        this.isSelected[i] = i === index;
      }


    },
    leave() {
      if (this.integral == null) {
        this.scroll();
      }

    }
  }
}


</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.wholeDiv {
  background: #fff;
  /*  background: transparent;*/
  float: left;
  width: 65%;
  margin-left: 60px;
  border-radius: 5px;
  margin-top: 60px;
}

.wholeDiv > div {
  width: 100%;
}

.a {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin: 5px 0 5px 0;
}

.b {
  width: 100%;
  height: 434px;
  transition: all .5s;
  background-size: cover;
  border-radius: 5px;
  /*  margin-left: 10px;*/
  margin-right: 10px;
  /*box-shadow: 1px 3px 11px #134857;*/

}

.c {
  width: 19%;
  height: 434px;
  display: flex;
  /* 纵向布局 */
  flex-direction: column;
  justify-content: space-between;
}

.d {
  position: relative;
  width: 100%;
  height: 100%;
  right: 0;
  transition: .5s;
  overflow: hidden;
  border-radius: 5px;
}

.d img {
  /*position: absolute;*/
  width: 100%;
  height: 100%;
  /* 小图片上移 */
  /*transform: translate(0, -50px);*/
  transition: .5s;
  /*right: 0;*/
  /*height: 100%;*/
}

.d.dd {
  opacity: 0;
  right: 250px;
}

.d:hover img {
  opacity: 0;
  right: 250px;
}

</style>