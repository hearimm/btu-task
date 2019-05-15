<template>
  <TimelineComp :addDays="convertDateAddDays()"/>
</template>

<script>
import TimelineComp from "../components/TimelineComp";
import moment from "moment";

export default {
  props: ["date"],
  components: {
    TimelineComp
  },
  methods: {
    convertDateAddDays() {
      let today = moment();
      let t1 = moment(this.date);
      let t2 = moment(today.format("YYYY-MM-DD"));
      let days = moment.duration(t2.diff(t1)).asDays();
      return Math.trunc(days) * -1;
    }
  }
};
</script>
