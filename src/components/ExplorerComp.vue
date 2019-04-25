<template>
  <v-layout justify-center>
    <v-flex xs12 sm6>
      <v-card>
        <FollowCardComp :items="casts"/>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { db } from "../firebase";
import FollowCardComp from "../components/FollowCardComp";

export default {
  components: {
    FollowCardComp
  },
  data() {
    return {};
  },

  firestore() {
    return {
      casts: db.collection("CAST").orderBy("name")
      // userDoc: db.collection("USER").doc(this.$store.getters["uid"])
    };
  },

  methods: {
  }
};
</script>