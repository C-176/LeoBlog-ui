<template>
  <a-popover >
    <template #content>
      <a-card hoverable style="width: 300px;">
        <template #cover>
          <img
              alt="pic"
              :src="p(user.userBgPic)"
              style="width: 100%;"
          />
        </template>
        <template #actions>
          <plus-outlined key="setting" />
          <message-outlined key="edit" @click="talk" />
          <ellipsis-outlined key="ellipsis" />
        </template>
        <a-card-meta :title="user.userNickname" :description="user.userCertification">
          <template #avatar>
            <a-avatar :src="p(user.userProfilePhoto)" />
          </template>
        </a-card-meta>
      </a-card>
    </template>
    <slot></slot>
  </a-popover>
</template>

<script>
import { PlusOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
export default {
  name: "user",
  props:["user"],
  components: {
    PlusOutlined,
    MessageOutlined,
    EllipsisOutlined,
  },
  methods:{
    talk(){
      this.$axios.get(this.baseURL + '/chat/connect/'+this.$store.state.user.userId+'/' + this.user.userId).then(res => {
        if (res.data.code === 200) {
          this.$store.commit('changeChatVisible',true)
        }else{
          this.$st(res.data.data, "error")
        }
      })

    },
  }
}
</script>

<style scoped>
:deep(.ant-popover-inner-content){
  padding:0;
}

</style>