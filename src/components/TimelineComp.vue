<template>
  <v-card class="mx-auto" max-width="400" min-width="250">
    <v-card dark flat>
      <v-btn absolute bottom color="pink" right fab @click="goTaskAdd()">
        <v-icon>add</v-icon>
      </v-btn>
      <v-card-title class="pa-2 purple lighten-3">
        <h3 class="title font-weight-light text-xs-center grow">Timeline</h3>
      </v-card-title>
      <v-img
        :src="computedImgLink"
        max-height="250"
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
              <strong>
                {{task.title}}
                <v-btn
                  v-if="task.vodLink"
                  flat
                  small
                  icon
                  color="primary"
                  @click="goVodLink(task.vodLink)"
                >
                  <v-icon>tv</v-icon>
                </v-btn>
              </strong>
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
export default {
  props: ["addDays"],
  data() {
    return {
      today: moment()
        .add(this.$props.addDays, "days")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      tommorow: moment()
        .add(this.$props.addDays + 1, "days")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      tasks: [],
      follows: ["yI4k03Ot0oHpaEvgDCES"]
    };
  },

  firestore() {
    const tasks = [];
    const follows = this.$store.getters["follows"];

    db.collection("TASK")
      .where("timestamp", ">=", this.today.format("X") * 1)
      .where("timestamp", "<", this.tommorow.format("X") * 1)
      .orderBy("timestamp")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          if (follows.length > 0) {
            for (const follow of follows) {
              if (doc.data().tags[follow]) {
                tasks.push(doc.data());
                break;
              }
            }
          } else {
            tasks.push(doc.data());
          }
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    this.tasks = tasks;

    return {};
  },

  computed: {
    // 계산된 getter
    computedImgLink: function() {
      //todo 나중에 많아지면 랜덤으로 뽑기?
      const imgMap = new Map();
      imgMap.set(
        "1",
        "https://scontent-icn1-1.cdninstagram.com/vp/087bc151f6277a63355b143c166ad394/5DD48705/t51.2885-15/e35/66504670_3404591962899694_8742569714826371016_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com"
      );
      imgMap.set(
        "2",
        "https://scontent-icn1-1.cdninstagram.com/vp/ec31a39c596b4f66d30c1c29b3f43cff/5E11F4A6/t51.2885-15/e35/57326295_295522308027225_4761856038825118039_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com"
      );
      imgMap.set(
        "4",
        "https://scontent-icn1-1.cdninstagram.com/vp/b9bba1eeb750ea3f43eafae2ff0a61a8/5D731E8D/t51.2885-15/e35/55837738_339904723230823_6511028640868583943_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com"
      );
      imgMap.set(
        "6",
        "https://scontent-icn1-1.cdninstagram.com/vp/f9cf1ccc184d165c19adf5abcd2450e8/5DD99A25/t51.2885-15/e35/59390479_327928747761576_3785550564376759797_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com"
      );

      const week = moment()
        .add(this.$props.addDays, "days")
        .format("e");
      if (imgMap.get(week)) {
        return imgMap.get(week);
      } else {
        return "https://scontent-icn1-1.cdninstagram.com/vp/eb66964bf3a1d8c58daf7483a14bffb6/5DF6A2C0/t51.2885-15/e35/56213822_1208424909319716_1133603525999068246_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com";
      }
    }
  },

  methods: {
    goTaskAdd() {
      this.$router.push({
        name: "taskAdd",
        params: { pDate: this.$data.today.format("YYYY-MM-DD") }
      });
    },
    goVodLink(link) {
      window.open(link, "_blank");
    }
  }
};
</script>