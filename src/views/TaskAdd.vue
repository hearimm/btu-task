<template>
  <TaskAddComp :pDate="pDate"/>
</template>

<script>
import TaskAddComp from "../components/TaskAddComp";

export default {
  props: ["pDate"],
  components: {
    TaskAddComp
  }
};
</script>
