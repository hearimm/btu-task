<template>
  <v-layout justify-center>
    <v-flex xs12 sm6>
      <v-card>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex v-for="card in casts" :key="card['.key']" v-bind="{ [`xs${card.flex}`]: true }">
              <v-card @click="routeTo(card['.key'])">
                <v-img :src="card.photoLink" height="200px">
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
                  <v-btn icon>
                    <v-icon>favorite</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>bookmark</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>share</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "../firebase";
export default {
  data() {
    return {};
  },

  firestore() {
    return {
      casts: db.collection("CAST").orderBy("name")
    };
  },

  methods: {
    routeTo(value) {
      console.log(value);
      this.$router.push({ name: "detail", params: { id: value } });
    }
  }
};
</script>