<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>프리셋 관리</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn right color="primary" @click="goAdd()">추가하기</v-btn>
        </v-toolbar>
        <v-list>
          <template v-for="item in tasks">
            <v-list-tile :key="item['.key']" @click="goDetail(item['.key'])">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.name"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import { db } from "../firebase";
export default {
  data: () => ({
    today: moment(),
    showAskForm: false,
    tasks: []
  }),
  firestore() {
    return {
      tasks: db.collection("PRESET").orderBy("name")
    };
  },
  methods: {
    goDetail(id) {
      this.$router.push("/preset/" + id);
    },
    goAdd() {
      this.$router.push("/presetAdd");
    }
  }
};
</script>