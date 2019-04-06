<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>일정관리</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn right color="primary" @click.stop="showAskForm=true">
            일정추가하기
            <AskFormComp v-model="showAskForm"/>
          </v-btn>
        </v-toolbar>
        <v-list three-line>
          <template v-for="item in tasks">
            <v-list-tile :key="item.title" @click="goDetail(item.id)">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.desc" right></v-list-tile-sub-title>
                <v-list-tile-sub-title v-html="item.time" right></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon color="grey lighten-1">info</v-icon>
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
import AskFormComp from "./AskFormComp";

export default {
  data() {
    return {
      showAskForm: false,
      tasks: [
        {
          color: "green",
          time: "22:00",
          title: "주짱구의 라이브",
          desc: "주짱구의 라이브",
          cast: "주시은"
        },
        {
          color: "amber",
          time: "22:00",
          title: "배성재의 텐",
          desc: "막나가는 용한 상담소",
          cast: "배성재, 스님"
        },
        {
          color: "pink",
          time: "23:00",
          title: "춘트리밍",
          desc: "담소 오픈! (베타ver.) | 나미춘 스트리밍",
          cast: "윤태진"
        }
      ]
    };
  },
  methods: {
    goDetail(id) {
      console.log(id);
    }
  },
  components: {
    AskFormComp
  }
};
</script>