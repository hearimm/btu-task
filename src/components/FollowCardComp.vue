<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex v-for="card in items" :key="card['.key']" v-bind="{ [`xs${card.flex}`]: true }">
        <v-card>
          <v-img
            :src="card.photoLink"
            height="200px"
            gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
            @click="goDetail(card['.key'])"
          >
            <v-container fill-height fluid pa-2>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline white--text" v-text="card.name"></span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn v-if="isFollows(card['.key'])" icon @click="deleteFollow(card['.key'])">
              <v-icon color="pink">favorite</v-icon>
            </v-btn>
            <v-btn v-else icon @click="addFollow(card['.key'])">
              <v-icon>favorite</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import { db } from "../firebase";
export default {
  props: ["items"],
  data: () => ({}),
  methods: {
    goDetail(id) {
      this.$router.push({ name: "detail", params: { id: id } });
    },
    isFollows(id) {
      return this.$store.getters["isFollows"](id);
    },
    addFollow(id) {
      if (!this.$store.getters["isUserAuthenticated"]) {
        return this.$router.push("/auth");
      }
      this.$store.dispatch("addFollows", id);
    },
    deleteFollow(id) {
      if (!this.$store.getters["isUserAuthenticated"]) {
        return this.$router.push("/auth");
      }
      this.$store.dispatch("deleteFollows", id);
    }
  }
};
</script>
