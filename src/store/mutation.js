import storage from "@/util/storage";
import main from "@/main";

const mutations = {
    changeLogin(state, login) {
        state.login = login;
    },
    changeIndex(state, index) {
        state.index = index;
    },
    // 保存token
    setToken(state, token) {
        state.token = token;
        storage.setToken(token);
    },
    // 移除token
    removeToken(state) {
        state.token = "";
        storage.rmToken();
    },
    // 设置用户并保存到storage
    setUser(state, user) {
        state.user = user;
        storage.set("user", JSON.stringify(user));
    },
    getColor(state) {
        let color = state.color[Math.floor(Math.random() * state.color.length)]
        console.log("color", color)
        return color;
    },
    changeChatVisible(state, chatVisible) {
        state.chatVisible = chatVisible;
    },
    changeMessageVisible(state, messageVisible) {
        state.messageVisible = messageVisible;
    },
    changeValueTitle(state, valueTitle) {
        if (valueTitle == null || valueTitle == undefined) {
            return
        }
        state.valueTitle = valueTitle;
        storage.set("valueTitle", valueTitle,20);

    },
    changeValueContent(state, valueContent) {
        if (valueContent == null  || valueContent == undefined) {
            return
        }
        state.valueContent = valueContent;
        storage.set("valueContent", valueContent,20);
    },
    initSocket(state) {
        const host = main.config.globalProperties.$host
        state.socket = new WebSocket("ws://" + host + ":8080/net/" + state.user.userId);
    },
    changeMode(state) {
        state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    changeShell(state, shell) {
        state.shell = shell;
    }


}

export default mutations

