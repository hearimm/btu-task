<template>
  <v-card class="hide-overflow">
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>문의 질문</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-card-text>
        <v-text-field v-model="title" label="제목" required></v-text-field>
        <v-textarea label="설명" v-model="desc"></v-textarea>
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions v-if="id">
      <v-spacer></v-spacer>
      <v-btn color="success" @click="cancel">Cancel</v-btn>
      <v-btn color="success" @click="deleteItem">Delete</v-btn>
      <v-btn color="success" @click="modifyItem">수정</v-btn>
    </v-card-actions>
    <v-card-actions v-else>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="save">Save</v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="hasSaved"
      :timeout="2000"
      absolute
      bottom
      left
    >Your profile has been updated</v-snackbar>
  </v-card>
</template>

<script>
import { db } from "../firebase";
export default {
  props: ["id"],
  data() {
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ];

    return {
      menuDate: false,
      menuTime: false,
      title: "",
      desc: "",
      valid: false,
      hasSaved: false,
      isEditing: null,
      model: null,
      isUpdating: false
    };
  },

  firestore() {
    console.log(this.$props.id);
    return {
      collection: db.collection("ASK")
    };
  },

  mounted() {
    // Binding Docs
    if (this.$props.id) {
      this.$binding("document", db.collection("ASK").doc(this.$props.id))
        .then(document => {
          this.title = document.title;
          this.desc = document.desc;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },

  methods: {
    allowedStep: m => m % 10 === 0,
    save() {
      this.$firestore.collection
        .add({
          title: this.title,
          desc: this.desc,
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          this.$router.go(-1);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    },
    deleteItem() {
      this.$firestore.collection
        .doc(this.$props.id)
        .delete()
        .then(this.$router.go(-1));
    },
    modifyItem() {
      this.$firestore.collection
        .doc(this.$props.id)
        .update({
          title: this.title,
          desc: this.desc,
          update_dt: new Date()
        })
        .then(this.$router.go(-1));
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>