<template>
  <v-container>
    <v-layout row grid-list-md>
      <v-flex class="text-sm-left text-xs-center">
        <v-btn @click="prevMonth()">
          <v-icon dark left>keyboard_arrow_left</v-icon>Prev
        </v-btn>
      </v-flex>
      <v-flex>
        <h1>{{todayMonth}}</h1>
      </v-flex>
      <v-flex class="text-sm-left text-xs-center">
        <v-btn @click="nextMonth()">
          Next
          <v-icon right dark>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-sheet>
          <v-calendar
            :now="today"
            :value="today"
            color="primary"
            @click:date="goDateTimeline($event)"
          >
            <template v-slot:day="{ date }">
              <template v-for="item in tasksMap[date]">
                <v-menu :key="item['.key']" v-model="item.open" full-width offset-x>
                  <template v-slot:activator="{ on }">
                    <v-btn :color="item.color" depressed dark small block round v-on="on">
                      {{item.title}}
                      <v-icon v-if="item.vodLink" small>tv</v-icon>
                    </v-btn>
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
                      <v-btn
                        v-if="item.vodLink"
                        flat
                        color="primary"
                        @click="goVodLink(item.vodLink)"
                      >다시보기</v-btn>
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
  </v-container>
</template>

<script>
import moment from "moment";
import { db } from "../firebase";

export default {
  data() {
    return {
      today: moment().format("YYYY-MM-DD"),
      tasks: []
    };
  },
  firestore() {
    return {
      tasks: db
        .collection("TASK")
        .where(
          "date",
          ">=",
          moment(this.today)
            .startOf("month")
            .subtract(7, "days")
            .format("YYYY-MM-DD")
        )
        .where(
          "date",
          "<=",
          moment(this.today)
            .endOf("month")
            .add(7, "days")
            .format("YYYY-MM-DD")
        )
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
    },
    todayMonth() {
      return moment(this.today).format("YYYY-MM");
    }
  },
  methods: {
    goDetail(id) {
      this.$router.push("/task/" + id);
    },
    goVodLink(link) {
      window.open(link, "_blank");
    },
    open(event) {
      alert(event.title);
    },
    goDateTimeline(item) {
      // var t1 = moment(item.date);
      // var t2 = moment(this.today.format("YYYY-MM-DD"));
      // var days = moment.duration(t2.diff(t1)).asDays();
      // var addDays = Math.trunc(days) * -1;
      this.$router.push({
        name: "timelineQuery",
        params: { date: item.date }
      });
    },
    prevMonth() {
      this.today = moment(this.today)
        .subtract(1, "months")
        .format("YYYY-MM-DD");

      db.collection("TASK")
        .where(
          "date",
          ">=",
          moment(this.today)
            .startOf("month")
            .subtract(7, "days")
            .format("YYYY-MM-DD")
        )
        .where(
          "date",
          "<=",
          moment(this.today)
            .endOf("month")
            .add(7, "days")
            .format("YYYY-MM-DD")
        )
        .orderBy("date")
        .orderBy("time")
        .get()
        .then(querySnapshot => {
          const tasks = [];
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            tasks.push(Object.assign({ ".key": doc.id }, doc.data()));
          });
          this.tasks = tasks;
        });
    },
    nextMonth() {
      this.today = moment(this.today)
        .add(1, "months")
        .format("YYYY-MM-DD");

      db.collection("TASK")
        .where(
          "date",
          ">=",
          moment(this.today)
            .startOf("month")
            .subtract(7, "days")
            .format("YYYY-MM-DD")
        )
        .where(
          "date",
          "<=",
          moment(this.today)
            .endOf("month")
            .add(7, "days")
            .format("YYYY-MM-DD")
        )
        .orderBy("date")
        .orderBy("time")
        .get()
        .then(querySnapshot => {
          const tasks = [];
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            tasks.push(Object.assign({ ".key": doc.id }, doc.data()));
          });
          this.tasks = tasks;
        });
    }
  }
};
</script>