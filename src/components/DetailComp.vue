<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img :src="cast.photoLink" height="300px">
          <v-layout column fill-height>
            <v-card-title>
              <v-btn dark icon @click="goBack">
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn dark icon class="mr-3">
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-card-title>

            <v-spacer></v-spacer>

            <v-card-title class="white--text pl-5 pt-5">
              <div class="display-1 pl-5 pt-5">{{cast.name}}</div>
              <v-btn color="pink" fab>
                <v-icon>add</v-icon>
              </v-btn>
            </v-card-title>
          </v-layout>
        </v-img>
      </v-card>
      <v-list v-for="item in tasks" :key="item['.key']" three-line>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="indigo">{{item.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
            <v-list-tile-sub-title>{{item.desc}}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{item.date + " " + item.time}}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{item.cast}}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn fab dark small color="green" @click="goTaskEdit(item['.key'])">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "../firebase";
import moment from "moment";
export default {
  props: ["id"],
  data() {
    return {
      casts: null,
      fab: false
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    routeTo(id) {
      this.$router.push({ name: "detail", params: { id: id } });
    },
    goTaskEdit(id) {
      this.$router.push("/task/" + id);
    }
  },

  firestore() {
    return {
      tasks: db.collection("TASK").where("tags." + this.$props.id, ">", 0),
      cast: db.collection("CAST").doc(this.$props.id)
    };
  },
  mounted() {
    // Binding Docs

    const today = moment();
    today.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    if (this.$props.id) {
      this.$binding(
        "tasksList",
        db
          .collection("TASK")
          .where("tags.Y7JZk93oOFrLpA1GoABN", ">", today.format("X") * 1)
      )
        .then(document => {
          this.casts = document;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    activeFab() {
      switch (this.tabs) {
        case "one":
          return { class: "purple", icon: "account_circle" };
        case "two":
          return { class: "red", icon: "edit" };
        case "three":
          return { class: "green", icon: "keyboard_arrow_up" };
        default:
          return {};
      }
    }
  }
};
</script>