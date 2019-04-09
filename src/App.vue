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
          <v-list-tile v-else :key="i" @click="routeTo(item.route)">
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
    drawer: null,
    items: [
      { icon: "lightbulb_outline", text: "타임라인", route: "/" },
      { icon: "touch_app", text: "살펴보기", route: "/explorer" },
      { divider: true },
      { heading: "Labels" },
      { icon: "add", text: "일정 추가", route: "/addTask" },
      { icon: "add", text: "일정 관리", route: "/task" },
      { divider: true },
      { icon: "archive", text: "내정보(만드는중)", route: "/account" },
      { icon: "exit_to_app", text: "가입", route: "/auth" },
      { divider: true },
      { icon: "settings", text: "설정(만드는중)", route: "/setting" },
      { icon: "chat_bubble", text: "문의", route: "/ask" },
      { icon: "help", text: "FAQ(만드는중)", route: "/faq" }
    ]
  }),
  props: {
    source: String
  },
  methods: {
    routeTo(route) {
      this.$router.push(route);
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