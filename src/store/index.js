import {createStore} from 'vuex'
import storage from '@/util/storage'
import mutations from '../store/mutation'

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            shell: false,
            mode: 'light',
            socket: null,
            valueTitle: storage.get("valueTitle"),
            valueContent: storage.get("valueContent"),
            login: true,
            index: true,
            chatVisible: false,
            messageVisible: false,
            token: storage.getToken(),
            user: storage.get("user"),
            color: [
                'magenta',
                'red',
                'volcano',
                'orange',
                'gold',
                'lime',
                'green',
                'cyan',
                'blue',
                'geekblue',
                'purple'
            ],
        }
    },
    mutations: mutations
})

export default store
