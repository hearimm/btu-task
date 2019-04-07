<template>
  <AddTaskComp :id="id"/>
</template>

<script>
import AddTaskComp from "../components/AddTaskComp";

export default {
  props: ["id"],
  components: {
    AddTaskComp
  }
};
</script>
