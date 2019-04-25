<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>팔로잉</v-toolbar-title>
        </v-toolbar>

        <FollowCardComp :items="items" :isEditable="isEditable"/>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { db } from "../firebase";
import FollowCardComp from "../components/FollowCardComp";
export default {
  props: ["id"],
  components: {
    FollowCardComp
  },
  data: () => ({
    items: []
  }),
  firestore() {
    const items = [];
    const follows = this.$store.getters["follows"];
    db.collection("CAST")
      .orderBy("name")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          if (follows.length > 0) {
            for (const follow of follows) {
              if (doc.id == follow) {
                items.push(Object.assign({ ".key": doc.id }, doc.data()));
                break;
              }
            }
          } else {
            items.push(Object.assign({ ".key": doc.id }, doc.data()));
          }
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    this.items = items;
    return {};
  },
  computed: {
    isEditable() {
      return this.$store.getters["uid"] === this.$props.id;
    }
  },
  methods: {}
};
</script>

