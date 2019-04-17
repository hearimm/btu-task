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
export default {
  props: ["addDays"],
  data() {
    return {
      today: moment().add(this.$props.addDays, "days"),
      tommorow: moment().add(this.$props.addDays + 1, "days"),
      tasks: [],
      imgLink:
        "https://scontent-icn1-1.cdninstagram.com/vp/33bb00bd8b055f8ade9a70a0c90f8161/5D4196F1/t51.2885-15/e35/56553780_2234820109909089_2768817975000366823_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com"
    };
  },

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

  computed: {
    // 계산된 getter
    computedImgLink: function() {
      //todo 나중에 많아지면 랜덤으로 뽑기?
      const imgMap = new Map();
      imgMap.set(
        "1",
        "https://scontent-icn1-1.cdninstagram.com/vp/33bb00bd8b055f8ade9a70a0c90f8161/5D4196F1/t51.2885-15/e35/56553780_2234820109909089_2768817975000366823_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com"
      );
      imgMap.set(
        "2",
        "https://scontent-icn1-1.cdninstagram.com/vp/508ef164852082a64b250e635be43383/5D37542A/t51.2885-15/e35/56344611_288390578752370_4060979878760024738_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com"
      );

      const week = moment()
        .add(this.$props.addDays, "days")
        .format("e");
      if (imgMap.get(week)) {
        return imgMap.get(week);
      } else {
        return "https://scontent-icn1-1.cdninstagram.com/vp/9a16ada2873f1f03f1fa8e1bf111378b/5D30E1C0/t51.2885-15/e35/56213822_1208424909319716_1133603525999068246_n.jpg?_nc_ht=scontent-icn1-1.cdninstagram.com";
      }
    }
  },

  methods: {
    goAddTask() {
      this.$router.push({
        name: "taskAdd",
        params: { pDate: this.$data.today.format("YYYY-MM-DD") }
      });
    }
  }
};
</script>