<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>일정관리</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn right color="primary" @click="goTaskAdd()">
            일정추가하기
            <AskFormComp v-model="showAskForm"/>
          </v-btn>
        </v-toolbar>
        <v-list three-line>
          <template v-for="item in tasks">
            <v-list-tile :key="item['.key']" @click="goDetail(item['.key'])">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.desc" right></v-list-tile-sub-title>
                <v-list-tile-sub-title right>{{item.date + " "+ item.time}}</v-list-tile-sub-title>
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
import AskFormComp from "./AskFormComp";

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
      tasks: db
        .collection("TASK")
        .where("date", ">=", this.$data.today.format("YYYY-MM-DD"))
        .orderBy("date")
        .orderBy("time")
    };
  },
  methods: {
    goDetail(id) {
      this.$router.push("/task/" + id);
    },
    goTaskAdd() {
      this.$router.push("/taskAdd");
    }
  },
  components: {
    AskFormComp
  }
};
</script>