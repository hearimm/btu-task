<template>
  <v-app id="keep">
    <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4" app>
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-layout v-if="item.heading" :key="i" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
          </v-layout>
          <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
          <v-list-tile v-else-if="item.show" :key="i" @click="routeTo(item.route)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="amber" app absolute clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5">
        BTU&nbsp;
        <span class="font-weight-light">Task</span>
      </span>
      <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="search"></v-text-field>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null
  }),
  props: {
    source: String
  },
  computed: {
    isUserAuthenticated() {
      return this.$store.getters["isUserAuthenticated"];
    },
    items() {
      return [
        { icon: "home", text: "홈", route: "/", show: true },
        {
          icon: "date_range",
          text: "타임라인",
          route: "/timeline",
          show: true
        },
        {
          icon: "explore",
          text: "탐색",
          route: "/explorer",
          show: true
        },
        { divider: true },
        { heading: "일정" },
        { icon: "event_note", text: "일정 관리", route: "/task", show: true },
        {
          icon: "label",
          text: "프리셋 관리",
          route: "/preset",
          show: true
        },
        { icon: "face", text: "출연자 관리", route: "/cast", show: true },

        { divider: true },
        {
          icon: "person",
          text: "내정보",
          route: "/account/" + this.$store.getters["uid"],
          show: this.$store.getters["isUserAuthenticated"]
        },
        {
          icon: "exit_to_app",
          text: "로그인",
          route: "/auth",
          show: !this.$store.getters["isUserAuthenticated"]
        },
        {
          icon: "exit_to_app",
          text: "로그아웃",
          route: "/logout",
          show: this.$store.getters["isUserAuthenticated"]
        },
        { divider: true },
        {
          icon: "settings",
          text: "설정(만드는중)",
          route: "/setting",
          show: this.$store.getters["isUserAdmin"]
        },
        { icon: "chat_bubble", text: "문의", route: "/ask", show: true },
        {
          icon: "help",
          text: "FAQ(만드는중)",
          route: "/faq",
          show: this.$store.getters["isUserAdmin"]
        },
        { divider: true },
        { heading: "자매품" },
        {
          icon: "send",
          text: "텔레그램 배텐 공지 알리미",
          route: "/telegram",
          show: true
        },
        {
          icon: "web",
          text: "팟캐스트 정주행(팟죽)",
          route: "/podjuk",
          show: true
        },
        {
          icon: "web",
          text: "관리자",
          route: "/admin",
          show: this.$store.getters["isUserAdmin"]
        }
      ];
    }
  },
  methods: {
    routeTo(route) {
      this.$router.push(route);
    },
    signOut() {
      this.$store.dispatch("signOut");
    }
  }
};
</script>

<style lang="stylus">
#keep {
  .v-navigation-drawer__border {
    display: none;
  }
}
</style>