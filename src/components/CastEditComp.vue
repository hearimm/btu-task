<template>
  <v-card class="hide-overflow">
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>출연자 추가</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-card-text>
        <v-text-field v-model="name" label="이름" required></v-text-field>
        <v-avatar size="36px">
          <v-img :src="photoLink"/>
        </v-avatar>
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

      <v-btn color="success" @click="cancel">Cancel</v-btn>
      <v-btn color="success" @click="deleteItem">Delete</v-btn>
      <v-btn color="success" @click="modifyItem">수정</v-btn>
    </v-card-actions>
    <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>저장되었습니다.</v-snackbar>
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

  mounted() {
    // Binding Docs
    if (this.$props.id) {
      this.$binding("document", db.collection("CAST").doc(this.$props.id))
        .then(document => {
          this.name = document.name;
          this.photoLink = document.photoLink;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },

  methods: {
    allowedStep: m => m % 10 === 0,
    cancel() {
      this.$router.go(-1);
    },
    deleteItem() {
      this.$firestore.casts
        .doc(this.$props.id)
        .delete()
        .then(this.$router.go(-1));
    },
    modifyItem() {
      this.$firestore.casts
        .doc(this.$props.id)
        .set({
          name: this.name,
          photoLink: this.photoLink,
          update_dt: new Date(),
          update_uid: this.$store.getters["uid"],
          update_name: this.$store.getters["displayName"]
        })
        .then(this.$router.go(-1));
    }
  }
};
</script>