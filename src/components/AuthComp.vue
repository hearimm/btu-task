<template>
  <v-container>
    <v-layout row wrap>
      <v-flex mb-2 offset-sm3 sm6 xs12>
        <h1>로그인 혜택</h1>
        <h1>일정추가/팔로우 기능 추가됨</h1>
        <v-card>
          <v-layout align-center justify-center>
            <v-icon x-large>account_circle</v-icon>
          </v-layout>
          <div id="firebaseui-auth-container"></div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import firebase from "firebase";
import * as firebaseui from "firebaseui";
// import "firebaseui/dist/firebaseui.css";
export default {
  name: "auth",
  mounted() {
    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID // Other providers don't need to be given as object.
      ]
    };
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>
<style scoped>
@import "../../node_modules/firebaseui/dist/firebaseui.css";
</style>
