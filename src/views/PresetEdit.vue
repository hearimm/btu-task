<template>
  <PresetEditComp :id="id"/>
</template>

<script>
import PresetEditComp from "../components/PresetEditComp";

export default {
  props: ["id"],
  components: {
    PresetEditComp
  }
};
</script>
