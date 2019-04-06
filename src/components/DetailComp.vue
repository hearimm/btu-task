<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img :src="cast.src" height="300px">
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
      <v-list v-for="item in cast.schedule" :key="item.time || item.title" three-line>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="indigo">{{item.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
            <v-list-tile-sub-title>{{item.desc}}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{item.time}}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{item.cast}}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-speed-dial
              v-model="fab"
              right
              direction="top"
              transition="slide-y-reverse-transition"
            >
              <template v-slot:activator>
                <v-btn v-model="fab" fab dark flat small color="blue darken-2">
                  <v-icon>more_vert</v-icon>
                  <v-icon>close</v-icon>
                </v-btn>
              </template>
              <v-btn fab dark small color="green">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn fab dark small color="indigo">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn fab dark small color="red">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    cast: {
      fab: false,
      name: "윤태진",
      src:
        "https://w.namu.la/s/e083efb3772283675d46562f998e33a767aa3c4fa5d8a8f0c75a914a43512675ce1ed068bd9c221bb1052ab40afa4975219565cddf8267055eb6e1ff1534a5edc9928418ada456a02959ed168f8791286c89f09fba5c290be0688da927e9cd11",
      schedule: [
        {
          icon: "play_circle_filled",
          title: "춘트리밍",
          desc: "데이게될 상담소",
          cast: ["윤태진"],
          time: "2019-04-05 23:00"
        },
        {
          icon: "play_circle_filled",
          title: "과장창",
          desc: "과학으로 장난치는게 창피해 과장창",
          cast: ["윤태진", "궤도", "엑소"],
          time: "2019-04-08 00:00"
        },
        {
          icon: "play_circle_filled",
          title: "춘트리밍",
          desc: "데이게될 상담소",
          cast: ["윤태진"],
          time: "2019-04-08 23:00"
        },
        {
          icon: "radio",
          title: "배성재의 텐",
          desc: "불편한것은 불편한것이다",
          cast: ["배성재", "윤태진"],
          time: "2019-04-09 22:00"
        },
        {
          icon: "play_circle_filled",
          title: "과장창",
          desc: "과학으로 장난치는게 창피해 과장창",
          cast: ["윤태진", "궤도", "엑소"],
          time: "2019-04-23 19:00"
        }
      ]
    }
  }),
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    routeTo(id) {
      this.$router.push({ name: "detail", params: { id: id } });
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