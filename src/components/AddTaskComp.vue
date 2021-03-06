<template>
  <v-card class="hide-overflow">
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>일정 추가</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-card-text>
        <v-text-field v-model="title" label="제목" required></v-text-field>
        <v-menu
          v-model="menuDate"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              label="날짜를 선택해주세요."
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menuDate = false"></v-date-picker>
        </v-menu>

        <v-menu
          ref="menu"
          v-model="menuTime"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="time"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="time"
              label="시간을 선택해주세요."
              prepend-icon="access_time"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menuTime"
            v-model="time"
            full-width
            format="24hr"
            :allowed-minutes="allowedStep"
            @click:minute="$refs.menu.save(time)"
          ></v-time-picker>
        </v-menu>

        <v-text-field v-model="desc" label="설명" required></v-text-field>
        <v-text-field v-model="cast" label="MC/출연자" required></v-text-field>
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
    <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>저장되었습니다.</v-snackbar>
  </v-card>
</template>

<script>
import { db } from "../firebase";
import {commonAllowedStep} from "../common";
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
      date: "",
      time: "",
      desc: "",
      cast: "",
      valid: false,
      hasSaved: false,
      isEditing: null,
      model: null,
      isUpdating: false
    };
  },

  firestore() {
    return {
      tasks: db.collection("TASK")
    };
  },

  mounted() {
    // Binding Docs
    if (this.$props.id) {
      this.$binding("document", db.collection("TASK").doc(this.$props.id))
        .then(document => {
          this.title = document.title;
          this.date = document.date;
          this.time = document.time;
          this.desc = document.desc;
          this.cast = document.cast;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },

  methods: {
    allowedStep: commonAllowedStep,
    save() {
      this.$firestore.tasks
        .add({
          title: this.title,
          date: this.date,
          time: this.time,
          desc: this.desc,
          cast: this.cast,
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
    },
    deleteItem() {
      this.$firestore.tasks
        .doc(this.$props.id)
        .delete()
        .then(this.$router.go(-1));
    },
    modifyItem() {
      this.$firestore.tasks
        .doc(this.$props.id)
        .set({
          title: this.title,
          date: this.date,
          time: this.time,
          desc: this.desc,
          cast: this.cast,
          update_dt: new Date(),
          update_uid: this.$store.getters["uid"],
          update_name: this.$store.getters["displayName"]
        })
        .then(this.$router.go(-1));
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>