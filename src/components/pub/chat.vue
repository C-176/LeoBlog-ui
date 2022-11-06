<template>
    <transition name="fade">
        <div class="whole" v-show="$store.state.chatVisible">
            <a-tooltip title="关闭" id="close" style="position: fixed;top: 100px;right: 10px">
                <a-button type="dashed" shape="circle" size="large"
                          style="position: absolute;top: 10px;right: 10px"
                          @click="$store.commit('changeChatVisible',!$store.state.chatVisible)">
                    <template #icon>
                        <close-outlined/>
                    </template>
                </a-button>
            </a-tooltip>
            <div class="chatWindow">
                <div class="logo">
                    <img id="logo" :src="logoSrc" alt="">
                </div>

                <div class="chat">
                    <div id="list">
                        <a-input-search
                                v-model:value="key"
                                placeholder="搜索用户"
                                style="width: 80%;padding:10px"
                                @search="onSearch"
                        />

                        <div class="user" :class="{select:isSelected[index],hovers:isHovered[index]}"
                             v-for="(chat,index) in chats" :key="index"
                             @click="select(index)"
                             @mouseover="hover(index)"
                             @mouseleave="hover(-1)">
                            <div class="up">{{ this.$moments(chat.record.recordUpdateTime) }}</div>
                            <div class="down">
                                <a-badge :count="redPoint[index]" size="small" style="float: left;">
                                    <user :user="chat.user">
                                        <a-avatar :class="{online:chat.user.userStatus}"
                                                  :src="p(chat.user.userProfilePhoto)" size="large"/>
                                    </user>
                                </a-badge>

                                <div class="right">
                                    <div id="uname">
                                        <router-link :to="'/user/'+chat.user.userId"> {{
                                                chat.user.userNickname
                                            }}
                                        </router-link>
                                    </div>
                                    <div id="uId" style="display: none">{{ chat.user.userId }}</div>
                                    <div id="content">{{ chat.record.recordContent }}</div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="chatMessage" v-loading="$loading">
                        <div class="userIntro">
                            <div class="uname">
                                <router-link :to="'/user/'+talkTo.user.userId"> {{
                                        talkTo.user.userNickname
                                    }}
                                </router-link>
                            </div>
                            <div class="address">{{ talkTo.user.userPos }}</div>
                        </div>

                        <div class="chatting" ref="chat" id="chat">
                            <template v-for="(record,index) in talkTo.record" :key="index">
                                <div id="updateTime" v-if="timeDiff(index,index-1)">
                                    {{ this.$moments(record.recordUpdateTime) }}
                                </div>
                                <template v-if="record.userId != talkTo.user.userId">

                                    <a-dropdown :trigger="['hover']">

                                        <div id="myMessage">{{ record.recordContent }}</div>

                                        <template #overlay>
                                            <a-menu>
                                                <a-menu-item key="1" @click="deleteRecord(record.recordId)">删除
                                                </a-menu-item>
                                                <a-menu-item key="3" @click="deleteRecord(record.recordId)">撤回
                                                </a-menu-item>
                                            </a-menu>
                                        </template>
                                    </a-dropdown>


                                </template>
                                <template v-else>

                                    <a-dropdown :trigger="['hover']">

                                        <div id="yourMessage">{{ record.recordContent }}</div>
                                        <template #overlay>
                                            <a-menu>
                                                <a-menu-item key="1" @click="deleteRecord(record.recordId)">删除
                                                </a-menu-item>
                                                <a-menu-item key="2">回复</a-menu-item>
                                            </a-menu>
                                        </template>
                                    </a-dropdown>


                                </template>
                            </template>
                        </div>


                        <textarea id="input" v-model="message" @keyup.enter="sendMessage" placeholder="请输入内容..."/>
                        <a-button id="enter" type="primary" shape="round" ghost :loading="submitting">
                            <template #icon>
                                <enter-outlined/>
                            </template>
                        </a-button>
                    </div>
                </div>

            </div>

        </div>
    </transition>
</template>

<script>
import {CloseOutlined, EnterOutlined} from '@ant-design/icons-vue';
import user from "@/components/pub/user";

export default {
    name: 'chat',
    components: {
        CloseOutlined,
        EnterOutlined,
        user
    },
    data() {
        return {
            submitting: false,
            logoSrc: '',
            key: '',
            count: 1,
            talkTo: {
                user: {
                    userId: '',
                    userNickname: '',
                    userAddress: '',
                },
                record: [{
                    recordId: -1,
                    userId: -1,
                    receiverId: -1,
                    recordContent: '聊天记录加载中...',
                    recordUpdateTime: '2021-05-01 12:00:00',
                }]
            },
            chats: [
                //     {
                //   user: {
                //     userId: 1,
                //     userStatus: 0,
                //     userNickname: 'LeoBlog',
                //     userProfilePhoto: 'http://localhost:8080/source/images/default_pic.png',
                //     userAddress: '江苏南京',
                //     userIntro: 'LeoBlog',
                //   },
                //   record: {
                //     userId: 1,
                //     receiverId: 1,
                //     recordContent: 'hello',
                //     recordUpdateTime: '2021-05-01 12:00:00',
                //   }
                // }
            ],
            isSelected: [],
            isHovered: [],
            redPoint: [],
            ws: null,
            message: '',
        }

    },
    created() {
        this.getUsers();
        setInterval(() => {
            this.getUsers()
        }, 10000)
        this.logoSrc = this.baseURL + '/source/images/logoC.png'
        this.$nextTick(() => {
            this.redPoint = new Array(this.chats.length).fill(0)
            this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
        })

        this.ws = this.connectSocket()
    },
    watch: {
        talkTo: {
            handler() {
                this.$nextTick(() => {
                    this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
                    this.$loading = false
                })
            },
            deep: true
        }

    },

    methods: {
        getStatus() {
            const ids = this.chats.map(chat => chat.user.userId);
            this.$axios.post(this.baseURL + "/net/list/status", {
                ids: ids
            }).then(res => {
                if (res.data.code === 200) {
                    this.chats.forEach((chat, index) => {
                        chat.user.userStatus = res.data.data[index];
                    })
                } else {
                    this.$st(res.data.data, 'error')
                }
            })
        },

        getUsers() {
            this.$axios.get(this.baseURL + '/chat/list/' + this.$store.state.user.userId).then(res => {
                if (res.data.code === 200) {
                    if (res.data.data == "暂无聊天对象") {
                        this.$st("暂无聊天对象，快去找人聊天吧", "info");
                    } else {
                        this.chats = res.data.data;
                        if (this.chats.length === 1) {
                            this.chats[0].record = {
                                userId: this.chats[0].user.userId,
                                receiverId: this.chats[0].user.userId,
                                recordContent: 'hello',
                                recordUpdateTime: '2021-05-01 12:00:00',
                            }
                        }
                    }
                    this.talkTo.user = this.chats[0].user;


                    this.$nextTick(() => {
                        this.select(0)
                    })

                } else {
                    this.$st("获取聊天对象失败", "error");
                }


            })
        },
        onSearch() {
            let x = this.key.trim()
            if (x !== '') {
                //遍历chats，选出user.userNickname中包含key的
                let a = []
                for (let i = 0; i < this.chats.length; i++) {
                    if (this.chats[i].user.userNickname.indexOf(x) !== -1) {
                        a.push(this.chats[i])
                    }
                }

                if (a.length === 0) {
                    this.$st("未查到相关用户", 'error')
                } else {
                    let b = []
                    for (let i = 0; i < this.chats.length; i++) {
                        if (this.chats[i].user.userNickname.indexOf(x) === -1) {
                            b.push(this.chats[i])
                        }
                    }
                    this.chats = a.concat(b)
                    this.select(0)
                    this.key = ''
                }
            }
        }
        ,
        select(index) {
            this.talkTo.user = this.chats[index].user
            let isSelected = []
            for (let i = 0; i < this.chats.length; i++) {
                if (this.chats[i].user.userId === this.talkTo.user.userId) {
                    isSelected.push(true)
                } else {
                    isSelected.push(false)
                }
            }
            this.isSelected = isSelected
            this.redPoint[index] = 0
            this.talkTo.user = this.chats[index].user
            //更新聊天记录
            this.$axios.get(this.baseURL + '/chat/connect/' + this.$store.state.user.userId + '/' + this.talkTo.user.userId).then(res => {
                if (res.data.code === 200) {
                    this.talkTo.record = res.data.data;

                } else {
                    this.$st(res.data.data, "error")
                }
            })
        }
        ,
        hover(index) {
            if (index === -1) {
                this.isHovered = new Array(this.chats.length).fill(false)
            }
            let isHovered = []
            for (let i = 0; i < this.chats.length; i++) {
                if (i === index) {
                    isHovered.push(true)
                } else {
                    isHovered.push(false)
                }
            }
            this.isHovered = isHovered

        },
        timeDiff(index1, index2) {
            if (index1 === 0) {
                return true
            }
            let time1 = this.talkTo.record[index1].recordUpdateTime
            let time2 = this.talkTo.record[index2].recordUpdateTime
            //将time转化为日期类型
            let date1 = new Date(time1)
            let date2 = new Date(time2)
            //获取两个日期的时间戳
            let diff = date1.getTime() - date2.getTime()
            //如果差值大于10分钟，打印时间差
            return (diff / 60000) > 10
        },

        connectSocket() {
            this.$store.commit('initSocket')
            let ws = this.$store.state.socket
            ws.onopen = this.onOpen
            // 收到消息
            ws.onmessage = this.onMessage
            // 关闭webSocket
            ws.onclose = this.onClose
            return ws;
        },
        sendMessage() {
            const msg = this.message.trim()
            if (msg === '') {
                this.$st("消息不能为空", 'error')
                return
            }
            this.submitting = true
            let data = {
                "userId": this.$store.state.user.userId,
                "receiverId": this.talkTo.user.userId,
                "message": msg,
                "update_time": new Date(),
            }
            if (this.ws.readyState === 1) {
                this.ws.send(JSON.stringify(data))
                // this.$st("发送成功", 'success')
                this.select(this.chats.findIndex(item => item.user.userId === this.talkTo.user.userId))
                this.message = ''
                this.select(this.chats.findIndex(item => item.user.userId === this.talkTo.user.userId))
                this.submitting = false

            } else {
                this.$st("发送失败", 'error')
            }
        },
        onMessage(event) {
            let data = JSON.parse(event.data);

            if (data.type === 1) {
                if (data.message.indexOf("已连接") !== -1) {
                    let index = data.message.indexOf("已连接")
                    let userName = data.message.substring(0, index)
                    let index2 = this.chats.findIndex(item => item.user.userNickname == userName)
                    if (index2 !== -1) {
                        this.chats[index2].user.userStatus = 1
                    }
                }
            } else if (data.type === 2) {
                if (data.message.indexOf("已断开连接") !== -1) {
                    let index = data.message.indexOf("已断开连接")
                    let userName = data.message.substring(0, index)
                    let index2 = this.chats.findIndex(item => item.user.userNickname == userName)
                    if (index2 !== -1) {
                        this.chats[index2].user.userStatus = 0
                    }
                }
            } else {
                const userId = data.userId;
                if (userId === this.talkTo.user.userId) {
                    //如果是当前聊天对象发来的消息
                    this.select(this.chats.findIndex(item => item.user.userId === this.talkTo.user.userId))
                } else {

                    this.chats.forEach((item, index) => {
                        if (item.user.userId === userId) {
                            if (this.redPoint[index] == undefined) {
                                this.redPoint[index] = 1
                            } else {
                                this.redPoint[index]++
                            }


                        }
                    })
                }
            }
        },
        onOpen() {
            // this.$st("连接成功", 'success')
        },
        onClose() {
            // this.$st("连接关闭", 'error')
        },
        deleteRecord(recordId) {
            this.$axios.delete(this.baseURL + '/chat/record/' + recordId).then(res => {
                if (res.data.code === 200) {
                    this.$st("删除成功", 'success')
                    this.talkTo.record = this.talkTo.record.filter(item => item.recordId !== recordId)
                } else {
                    this.$st(res.data.data, "error")
                }
            })

        }
    },

}


</script>

<style scoped>
#updateTime {
    display: inline-block;
    width: 100%;
    font-size: 12px;
}


.whole {
    z-index: 110 !important;
    position: fixed;
    top: 60px;
    background: #fff;
    height: 600px !important;
    width: 65%;
    border-radius: 10px !important;
    /*margin-top: 60px;*/
    margin-left: calc(17.5%) !important;

}

.chatWindow {
    width: 100%;
    height: 100%;
    border-radius: 0 30px 30px 0;

}

.online {
    border: 2px #06f006 solid;
}

#enter {
    color: #7c929c;
    border-color: #7c929c;
    position: absolute;
    margin-left: -60px;
    margin-top: calc(7%);
}

#enter:hover {
    background: #eaeef0;
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

.chat {
    height: 90%;
    width: 100%;
}

#list, .chatMessage {
    float: left;
}

#list {
    width: 40%;
    height: 100%;
    overflow: auto;
}

.user {
    width: 80%;
    height: 11%;
    background: #ecf0f2;

    margin: 10px auto;
    padding: 2px 10px;
    border-radius: 10px;
    transition: all 0.3s;

}

.user:hover {
    cursor: pointer;

}


.user .up {
    height: 20%;
    text-align: right;
    font-size: 12px;
    /*color: #0f6674;*/
    padding-right: 10px;
}

.user .down {
    height: 80%;
}


.right {
    float: left;
    margin-left: 20px;
    width: 70%;
    height: 100%;
}

.right #uname {
    font-size: 16px;
    font-weight: 600;
    height: 60%;
    /*background: #00ff80;*/
}

.right #content {
    font-size: 12px;
    /*background: #cf0f0f;*/
    /* 内容溢出隐藏 */
    overflow: hidden;
    /* 设置文本不换行 */
    white-space: nowrap;
    /* 元素溢出省略号 */
    text-overflow: ellipsis;
}

.right #uname::before {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
}


.right #uname, .right #content {

    width: 100%;
    height: 50%;
    /*line-height: 25px;*/
    text-align: left;
}


.chatMessage {
    width: 50%;
    height: 100%;
    padding: 10px;
    /*margin-left: 30px;*/

}

.chatMessage .userIntro {
    width: 100%;
    height: 10%;
    text-align: center;
    margin-top: -50px;
}

.userIntro .uname, .userIntro .address {
    width: 20%;
    height: 50%;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
}

.userIntro .uname {
    font-size: 16px;
    font-weight: 600;
}

.userIntro .address {

}

.chatting {
    height: 80%;
    width: 100%;
    background: #ecf0f2;
    /*margin: 10px 0;*/
    border-radius: 20px;
    padding: 10px 20px;
    overflow: auto;
    transition: all .3s;

}

#input {
    margin-top: 10px;
    width: 100%;
    height: 20%;
    /*background: #848fa5;*/
    border-radius: 10px;
    text-align: left;
    line-height: 20px;
    font-size: 14px;
    padding: 10px;
    border: 1px solid #838ea4;
    overflow: auto;
    resize: none;
    outline: none;
}

#input div {
    float: left;
}

#myMessage, #yourMessage {
    font-size: 13px;
    line-height: 25px;
    border-radius: 12px;
    padding: 5px 10px;
    max-width: 60%;
    text-align: left;
    word-break: break-all;
    margin-bottom: 10px;
}

#myMessage {
    float: right;
    margin-left: 50%;
    background: #134857;
    color: #fff;
    box-shadow: 1px 1px 3px #134857;
}

#yourMessage {
    margin-right: 50%;
    float: left;
    color: #000;
    background: #fdfdfd;
    box-shadow: 1px 1px 3px #d8e3e7;
}


.select, .hovers {
    width: 90%;
    height: 15%;

}

:deep(.ant-btn-dashed:hover) {
    color: #eaeef0 !important;
    transition: all .2s;
}

.fade-enter-active, .fade-leave-active {
transition: opacity .3s;
}

.fade-enter-from, .fade-leave-to {
opacity: 0;
}

</style>