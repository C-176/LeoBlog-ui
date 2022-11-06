<template>
  <div>
<!--    <object type="text/html" data="https://www.baidu.com" style="width:1000px; height:1000px">-->
<!--      <p>backup content</p>-->
<!--    </object>-->
    <iframe src='https://cupfox.app/' style="width:100vw; height:100vh"></iframe>
  </div>
</template>

<script>
import emoji from "@/components/pub/emoji";


export default {
  name: "test",
  components: {
    emoji,
    // APlayer
  },
  data() {
    return {};
  },
  mounted() {


  }
}
</script>

<style scoped>

</style>