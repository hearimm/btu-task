<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 sm6>
      <v-card class="hide-overflow">
        <v-toolbar card>
          <v-icon>question_answer</v-icon>
          <v-toolbar-title>문의/질문</v-toolbar-title>
        </v-toolbar>
        <v-form v-model="valid">
          <v-card-text>
            <v-text-field v-model="title" label="제목" required></v-text-field>
            <v-textarea label="설명" v-model="desc"></v-textarea>
          </v-card-text>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="loadingSave" :disabled="loadingSave" @click="save">Save</v-btn>
        </v-card-actions>
        <v-snackbar
          v-model="hasSaved"
          :timeout="2000"
          absolute
          bottom
          left
        >Your profile has been updated</v-snackbar>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "../firebase";

export default {
  data() {
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ];

    return {
      title: "",
      desc: "",
      valid: false,
      hasSaved: false,
      loadingSave: false
    };
  },

  firestore() {
    return {
      askCollection: db.collection("ASK")
    };
  },

  methods: {
    save() {
      this.loadingSave = true;
      this.$firestore.askCollection
        .add({
          title: this.title,
          desc: this.desc,
          uid: this.$store.getters["uid"],
          displayName: this.$store.getters["displayName"],
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
          this.loadingSave = false;
          this.$router.go(-1);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
          this.loadingSave = false;
        });
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>