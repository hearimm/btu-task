<template>
  <DetailComp :id="id"/>
</template>

<script>
import DetailComp from "../components/DetailComp";

export default {
  props: ["id"],
  components: {
    DetailComp
  }
};
</script>
