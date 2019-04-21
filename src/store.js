import Vue from 'vue'
import Vuex from 'vuex'
import {
  db,
  firebaseApp
} from './firebase';
import { get } from 'https';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    role: null,
    follows: [],
    subscribes: null
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user;
    },
    setRole: (state, role) => {
      state.role = role;
    },
    setFollows: (state, follows) => {
      state.follows = follows;
    },
    addFollows: (state, item) => {
      state.follows.push(item);
    },
    deleteFollows: (state, item) => {
      const idx = state.follows.indexOf(item);
      if (idx > -1) {
        state.follows.splice(idx, 1);
      }
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
        photoURL: payload.photoURL,
        login_dt: new Date()
      }, {
          merge: true
        }).then(
          console.log("success")
        )
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
        commit("setFollows", []);
        commit("setRole", null);
      }).catch((err) => {
        console.log("signOut error: " + err)
      });

    },
    fetchUserData({
      commit,
      getters
    }, payload) {
      db.collection("USER").doc(payload.uid)
        .onSnapshot(function (document) {
          if (document.data().follows) {
            commit("setFollows", document.data().follows);
            commit("setRole", document.data().role);
          }
        });

    },
    fetchUnLoginUserData({
      commit
    }) {
      commit("setUser", null);
      commit("setFollows", []);
      commit("setRole", null);
    },
    setFollows({
      commit
    }, payload) {
      commit("setFollows", payload);
    },
    addFollows({
      commit
    }, payload) {
      commit("addFollows", payload);
      db.collection("USER").doc(this.getters["uid"])
        .update({
          follows: this.getters["follows"]
        });
    },
    deleteFollows({
      commit
    }, payload) {
      commit("deleteFollows", payload);
      db.collection("USER").doc(this.getters["uid"])
        .update({
          follows: this.getters["follows"]
        });
    },
  },
  getters: {
    isUserAuthenticated(state) {
      return state.user !== null && state.user !== undefined;
    },
    uid(state) {
      if (state.user !== null && state.user !== undefined) {
        return state.user.uid;
      }
    },
    displayName(state) {
      if (state.user !== null && state.user !== undefined) {
        return state.user.displayName;
      }
    },
    photoURL(state) {
      if (state.user !== null && state.user !== undefined) {
        return state.user.photoURL;
      }
    },
    follows(state) {
      if (state.follows !== null && state.follows !== undefined) {
        return state.follows;
      }
    },
    isFollows: (state) => (id) => {
      if (state.follows !== null && state.follows !== undefined) {
        return state.follows.includes(id);
      }
    }
  }
})