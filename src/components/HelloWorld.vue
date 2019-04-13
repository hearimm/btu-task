<template>
  <v-card class="mx-auto" max-width="400">
    <v-card dark flat>
      <v-btn absolute bottom color="pink" right fab @click="goAddTask()">
        <v-icon>add</v-icon>
      </v-btn>
      <v-card-title class="pa-2 purple lighten-3">
        <v-btn icon>
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <h3 class="title font-weight-light text-xs-center grow">Timeline</h3>
        <v-avatar>
          <v-img
            src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Close&eyebrowType=UpDown&mouthType=Smile&skinColor=Light"
          ></v-img>
        </v-avatar>
      </v-card-title>
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/forest.jpg"
        gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
      >
        <v-container fill-height>
          <v-layout align-center>
            <strong class="display-4 font-weight-regular mr-4">{{today.date()}}</strong>
            <v-layout column justify-end>
              <div class="headline font-weight-light">{{today.format("ddd")}}</div>
              <div class="text-uppercase font-weight-light">{{today.format("MMMM YYYY")}}</div>
            </v-layout>
          </v-layout>
        </v-container>
      </v-img>
    </v-card>
    <v-card-text class="py-0">
      <v-timeline align-top dense>
        <v-timeline-item v-for="(task, i) in tasks" :key="i" :color="task.color" small>
          <v-layout pt-3>
            <v-flex xs3>
              <strong>{{task.time}}</strong>
            </v-flex>
            <v-flex>
              <strong>{{task.title}}</strong>
              <div class="caption">{{task.desc}}</div>
              <div class="caption">{{task.cast}}</div>
            </v-flex>
          </v-layout>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
import { db } from "../firebase";
const param = 0;
export default {
  data: () => ({
    today: moment().add(param, "days"),
    tommorow: moment().add(param + 1, "days"),
    tasks: []
  }),
  firestore() {
    return {
      tasks: db
        .collection("TASK")
        .where("date", ">=", this.$data.today.format("YYYY-MM-DD"))
        .where("date", "<", this.$data.tommorow.format("YYYY-MM-DD"))
        .orderBy("date")
        .orderBy("time")
    };
  },
  methods: {
    goAddTask() {
      this.$router.push("/addTask");
    }
  }
};
</script>