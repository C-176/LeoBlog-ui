<template>
    <div class="whole" v-if="$store.state.messageVisible">
        <div class="logo">
            <img id="logo" :src="logoSrc" alt="">
            <!--      <span>消息盒子</span>-->

        </div>
        <a-tooltip title="关闭" id="close" style="position: fixed;top: 100px;right: 10px">
            <a-button type="dashed" shape="circle" size="large"
                      style="position: absolute;top: 10px;right: 10px"
                      @click="$store.commit('changeMessageVisible',!$store.state.messageVisible)">
                <template #icon>
                    <close-outlined/>
                </template>
            </a-button>
        </a-tooltip>
        <el-empty v-if="data.length===0"  description="暂无消息">

        </el-empty>
        <template v-else>
            <a-list item-layout="horizontal" :data-source="data" class="messageBox">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        >
                            <template #title>
                                <a href="https://www.antdv.com/">{{ item.title }}</a>
                            </template>
                            <template #avatar>
                            <user :user='item.user'>
                                <a-avatar src="https://joeschmoe.io/api/v1/random"/>
                            </user>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </template>
    </div>
</template>

<script>
import {CloseOutlined, EnterOutlined} from '@ant-design/icons-vue';
import user from "@/components/pub/user";

export default {
    name: "message",
    components: {
        CloseOutlined,
        EnterOutlined,
        user
    },
    data() {
        return {
            logoSrc: '',
            data: [
//                {
//                    title: 'Ant Design Title 1',
//                },
//                {
//                    title: 'Ant Design Title 2',
//                },
//                {
//                    title: 'Ant Design Title 3',
//                },
//                {
//                    title: 'Ant Design Title 4',
//                },
            ],

        }
    },
    created() {
        this.logoSrc = this.baseURL + '/source/images/logoC.png'
    }
}
</script>

<style scoped>

.whole {
    z-index: 100 !important;
    position: fixed;
    top: 60px;
    background: #fff;
    height: 600px !important;
    width: 65%;
    border-radius: 10px !important;
    /*margin-top: 60px;*/
    margin-left: calc(17.5%) !important;
    text-align: left;

}


.logo::before {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
}

.logo {
    width: 20%;
    height: 8%;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    padding-left: 30px;
}

/*.logo {*/
/*  width: 100px;*/
/*  height: 50px;*/
/*  !*margin-left: 35px;*!*/
/*  float: left;*/
/*  margin-left: 35px;*/
/*  !*color: #132c33;*!*/
/*  !*font-size: 35px;*!*/
/*  transition: width 0.5s;*/
/*  !*line-height: 50px;*!*/
/*}*/
#logo {
    width: 100%;
    height: 100%;

}

.messageBox {
    margin-top: 20px;
    margin-left: 30px;
    width: 90%;
    height: 90%;
    overflow: auto;
}


</style>