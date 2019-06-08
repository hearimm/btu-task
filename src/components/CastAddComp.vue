<template>
  <v-card class="hide-overflow">
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>출연자 추가</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-card-text>
        <v-text-field v-model="name" label="이름" required></v-text-field>
        <v-text-field v-model="photoLink" label="사진링크" required></v-text-field>
        <v-img
          :src="photoLink"
          max-height="250"
          gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
        />
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="save">Save</v-btn>
    </v-card-actions>
    <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>저장되었습니다.</v-snackbar>
  </v-card>
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
      name: "",
      photoLink: "",
      valid: false,
      hasSaved: false,
      isEditing: null
    };
  },

  firestore() {
    return {
      casts: db.collection("CAST")
    };
  },

  methods: {
    save() {
      this.$firestore.casts
        .add({
          name: this.name,
          photoLink: this.photoLink,

          create_dt: new Date(),
          create_uid: this.$store.getters["uid"],
          create_name: this.$store.getters["displayName"],
          update_dt: new Date(),
          update_uid: this.$store.getters["uid"],
          update_name: this.$store.getters["displayName"]
        })
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
          this.hasSaved = true;
          this.isEditing = !this.isEditing;
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  }
};
</script>