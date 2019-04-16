<template>
  <TaskEditComp :id="id"/>
</template>

<script>
import TaskEditComp from "../components/TaskEditComp";

export default {
  props: ["id"],
  components: {
    TaskEditComp
  }
};
</script>
