<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>문의/질문</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn right color="primary" @click.stop="goAddPage()">
            문의하기
            <AskFormComp v-model="showAskForm"/>
          </v-btn>
        </v-toolbar>
        <v-list three-line>
          <template v-for="item in items">
            <v-list-tile :key="item['.key']" @click="goDetail(item['.key'])">
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
import { db } from "../firebase";

export default {
  data() {
    return {
      showAskForm: false,
      items: []
    };
  },
  firestore() {
    return {
      items: db.collection("ASK")
    };
  },
  methods: {
    goAddPage() {
      this.$router.push("/addAsk/");
    },
    goDetail(id) {
      console.log(id);
      this.$router.push("/ask/" + id);
    },
    addItem() {
      console.log("addItem");
    },
    modifyItem() {
      console.log("modifyItem");
    },
    deleteItem() {
      console.log("deleteItem");
    }
  },
  components: {
    AskFormComp
  }
};
</script>