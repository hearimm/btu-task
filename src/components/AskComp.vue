<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>문의/질문</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn right color="primary" @click.stop="showAskForm=true">
            문의하기
            <AskFormComp v-model="showAskForm"/>
          </v-btn>
        </v-toolbar>
        <v-list three-line>
          <template v-for="item in items">
            <v-list-tile :key="item.title" @click="goDetail(item.id)">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.time" right></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import AskFormComp from "./AskFormComp";

export default {
  data() {
    return {
      showAskForm: false,
      items: [
        {
          id: 0,
          title: "Brunch this weekend?",
          time: "modified 5 min ago"
        },
        { id: 1, title: "?? weekend?", time: "modified 10 min ago" }
      ]
    };
  },
  methods: {
    goDetail(id) {
      console.log(id);
    }
  },
  components: {
    AskFormComp
  }
};
</script>