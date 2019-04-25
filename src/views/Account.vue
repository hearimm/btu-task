<template>
  <AccountComp :id="id"/>
</template>

<script>
import AccountComp from "../components/AccountComp";

export default {
  props: ["id"],
  components: {
    AccountComp
  }
};
</script>
