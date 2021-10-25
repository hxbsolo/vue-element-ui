import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        requirelist: [],
        usermsg: JSON.parse(sessionStorage.getItem('user')) || {}
    },
    getters: {
    },
    mutations: {
        Permission(state, list) {
            state.requirelist = list
        },
        userID(state, user) {
            state.usermsg = user
        }
    },
    actions: {
        getUserInfo(context, payload) {
            context.commit('userID', payload)
        }
    }
})
export default store