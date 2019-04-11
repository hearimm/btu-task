import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import { config } from "./config/firebaseConfig";
// import firebase from "firebase/app";
import VueFirestore from "vue-firestore";
import DateRemainFilter from "./filters/dateRemainFilter";

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
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.$store.dispatch("user/setUser", firebase.auth().currentUser);
    //     this.$store.dispatch("user/fetchUserData");
    //   } else {
    //     this.$store.dispatch("user/fetchUnLoginUserData");
    //     // this.$router.push('/auth')
    //   }
    // });
  }
}).$mount("#app");