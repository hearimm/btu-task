<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>출연자 관리</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn right color="primary" @click="goAdd()">추가</v-btn>
        </v-toolbar>
        <v-list>
          <template v-for="item in items">
            <v-list-tile :key="item['.key']" @click="goDetail(item['.key'])">
              <v-list-tile-avatar>
                <img :src="item.photoLink">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{item.name}}</v-list-tile-title>
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
    items: []
  }),
  firestore() {
    return {
      items: db.collection("CAST")
    };
  },
  methods: {
    goDetail(id) {
      this.$router.push("/cast/" + id);
    },
    goAdd() {
      this.$router.push("/castAdd");
    }
  }
};
</script>