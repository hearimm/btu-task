<template>
  <AskDetailComp :id="id"/>
</template>

<script>
import AskDetailComp from "../components/AskDetailComp";

export default {
  props: ["id"],
  components: {
    AskDetailComp
  }
};
</script>
