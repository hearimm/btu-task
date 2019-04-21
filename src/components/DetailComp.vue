<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img
          :src="cast.photoLink"
          height="300px"
          gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
        >
          <v-layout column fill-height>
            <v-card-title>
              <v-btn dark icon @click="goBack">
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn dark icon class="mr-3" @click="goCastEdit">
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-card-title>

            <v-spacer></v-spacer>

            <v-card-title class="white--text pl-5 pt-5">
              <div class="display-1 pl-5 pt-5">{{cast.name}}</div>
              <v-btn color="pink" fab @click="goTaskAdd">
                <v-icon>add</v-icon>
              </v-btn>
            </v-card-title>
          </v-layout>
        </v-img>

        <v-list three-line>
          <template v-for="item in tasksList">
            <v-list-tile :key="item['.key']" @click>
              <v-list-tile-action>
                <v-icon color="indigo">{{item.icon}}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
                <v-list-tile-sub-title>{{item.date + " " + item.time + " " + item.desc}}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{item.cast}}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn fab small color="primary" @click="goTaskEdit(item['.key'])">
                  <v-icon>edit</v-icon>
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
import { db } from "../firebase";
import moment from "moment";

export default {
  props: ["id"],
  data() {
    return {
      casts: null,
      tasksList: [],
      fab: false
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goCastEdit() {
      this.$router.push({ name: "castEdit", params: { id: this.$props.id } });
    },
    goTaskAdd() {
      this.$router.push("/taskAdd");
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