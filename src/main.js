import 'babel-polyfill';
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import { config } from "./config/firebaseConfig";
// import firebase from "firebase/app";
import VueFirestore from "vue-firestore";
import DateRemainFilter from "./filters/dateRemainFilter";
import {
  firebaseApp
} from "./firebase";

Vue.config.productionTip = false;
Vue.use(VueFirestore);
Vue.use(require("vue-moment"));
Vue.filter("dateRemain", DateRemainFilter);

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    // console.log(config);
    // firebase.initializeApp(config);
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("setUser", firebaseApp.auth().currentUser);
        this.$store.dispatch("fetchUserData", firebaseApp.auth().currentUser);
      } else {
        this.$store.dispatch("fetchUnLoginUserData");
        // this.$router.push('/auth')
      }
    });
  }
}).$mount("#app");