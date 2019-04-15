<template >
  <v-layout row wrap>
    <template v-for="(item, index) in array">
      <TimelineComp :addDays="index" :key="index"/>
    </template>
  </v-layout>
</template>
<script>
import TimelineComp from "../components/TimelineComp";

export default {
  components: {
    TimelineComp
  },
  data() {
    return {
      array: new Array(9)
    };
  }
};
</script>