import Vue from 'vue'
import Vuex from 'vuex'
import {
  db,
  firebaseApp
} from './firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    role: null,
    subscribes: null
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user;
    },
    setRole: (state, role) => {
      state.role = role;
    },
    setSubscribes(state, payload) {
      state.subscribes = {
        ...payload
      };
    }
  },
  actions: {
    setUser: ({
      commit
    }, payload) => {
      commit("setUser", payload);
      db.collection("USER").doc(payload.uid).set({
          email: payload.email,
          displayName: payload.displayName,
          emailVerified: payload.emailVerified,
          login_dt: new Date()
        }, {
          merge: true
        }).then(console.log("success"))
        .catch(err => {
          console.log("err:" + err)
        });
    },
    signOut({
      commit
    }) {
      firebaseApp.auth().signOut().then(() => {
        console.log("signOut success");
        commit("setUser", null);
        commit("setSubscribes", null);
        commit("setRole", null);
      }).catch((err) => {
        console.log("signOut error: " + err)
      });

    },
    fetchUserData({
      commit,
      getters
    }) {
      // db조회해서 유저정보 가져오기
      commit("setRole", null);
    },
    fetchUnLoginUserData({
      commit
    }) {}
  },
  getters: {
    isUserAuthenticated(state) {
      return state.user !== null && state.user !== undefined;
    },
    uid(state) {
      if(state.user !== null && state.user !== undefined){
        return state.user.uid;
      }
    },
    displayName(state) {
      if(state.user !== null && state.user !== undefined){
        return state.user.displayName;
      }
    },
  }
})