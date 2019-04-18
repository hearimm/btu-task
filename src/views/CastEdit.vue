<template>
  <CastEditComp :id="id"/>
</template>

<script>
import CastEditComp from "../components/CastEditComp";

export default {
  props: ["id"],
  components: {
    CastEditComp
  }
};
</script>
