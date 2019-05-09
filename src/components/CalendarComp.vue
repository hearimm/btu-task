<template>
  <v-layout>
    <v-flex>
      <v-sheet height="500">
        <v-calendar now="2019-05-09" value="2019-05-09" color="primary">
          <template v-slot:day="{ date }">
            <template v-for="item in tasksMap[date]">
              <v-menu :key="item['.key']" v-model="item.open" full-width offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :color="item.color"
                    depressed
                    dark
                    small
                    block
                    round
                    v-on="on"
                  >{{item.title}}</v-btn>
                </template>
                <v-card color="grey lighten-4" min-width="350px" flat>
                  <v-toolbar :color="item.color" dark dense>
                    <v-toolbar-title>{{item.title}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="goDetail(item['.key'])">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-title primary-title>
                    <div>
                      <span class="grey--text">{{item.time}}</span>
                      <br>
                      <span>{{item.desc}}</span>
                      <br>
                      <span>{{item.cast}}</span>
                    </div>
                  </v-card-title>

                  <v-card-actions>
                    <v-btn flat color="secondary">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </template>
          </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import { db } from "../firebase";

export default {
  data() {
    return {
      today: moment(),
      tasks: []
    };
  },
  firestore() {
    return {
      tasks: db
        .collection("TASK")
        .where("date", ">=", this.today.startOf("month").format("YYYY-MM-DD"))
        .orderBy("date")
        .orderBy("time")
    };
  },
  computed: {
    // convert the list of events into a map of lists keyed by date
    tasksMap() {
      const map = {};
      for (let i = 0; i < this.tasks.length; i++) {
        const e = this.tasks[i];
        e["open"] = false;
        if (map[e.date]) {
          map[e.date].push(e);
        } else {
          map[e.date] = [];
          map[e.date].push(e);
        }
      }
      return map;
    }
  },
  methods: {
    goDetail(id) {
      this.$router.push("/task/" + id);
    },
    open(event) {
      alert(event.title);
    }
  }
};
</script>