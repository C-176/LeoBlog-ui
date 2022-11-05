<template>
  <div class="bg-cover" v-if="showCover"></div>
</template>

<script>
export default {
  name: "BgCover",

  props:["showCover"],
  watch: {
    showCover(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";

      }
    }
  }
}

</script>



<style scoped >

.bg-cover {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1E2427BE;
  z-index: 90;
}
</style>