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
            <v-text-field v-model="title" label="제목" readonly required></v-text-field>
            <v-textarea label="설명" v-model="desc" readonly></v-textarea>
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
        <v-card-text>
          <v-list>
            <template v-for="(item) in askComment">
              <div :key="item['.key']" style="height:auto;">
                <v-divider></v-divider>
                <v-list-tile-content>
                  <v-list-tile-sub-title class="text--primary">
                    {{item.desc+" - " +item.user_name}}
                    <span
                      class="text--secondary"
                    >{{" "+ item.update_dt.toDate() | dateRemain }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </div>
            </template>
            <v-divider></v-divider>
          </v-list>

          <v-layout row wrap>
            <v-flex>
              <v-text-field v-model="askNewComment" label="댓글쓰기" required></v-text-field>
            </v-flex>
            <v-flex>
              <v-btn color="primary" @click="addAskComment">등록</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <template v-for="item in answers">
        <AskAnswerComp :key="item['.key']" :askId="id" :answerId="item['.key']"/>
      </template>
      <v-card class="hide-overflow">
        <v-toolbar card>
          <v-icon>question_answer</v-icon>
          <v-toolbar-title>답변달기</v-toolbar-title>
        </v-toolbar>
        <v-form v-model="valid">
          <v-card-text>
            <v-textarea label="설명" v-model="newAnswerDesc"></v-textarea>
          </v-card-text>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="addNewAnswer">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "../firebase";
import moment from "moment";
import AskAnswerComp from "./AskAnswerComp";

export default {
  props: ["id"],
  components: {
    AskAnswerComp
  },
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
      isUpdating: false,
      askNewComment: "",
      answerNewComment: "",
      answerComments: "",
      askComment: [],
      answers: [],
      answer: {},
      newAnswerDesc: ""
    };
  },

  computed: {
    toMoment: function() {
      // `this` 는 vm 인스턴스를 가리킵니다.
      return "123";
    }
  },

  firestore() {
    console.log(this.$props.id);
    return {
      askCollection: db.collection("ASK"),
      answerCollection: db.collection("ASK/" + this.$props.id + "/answer"),
      commentCollection: db.collection("ASK/" + this.$props.id + "/comments")
    };
  },

  mounted() {
    // Binding Docs
    if (this.$props.id) {
      this.$binding("document", db.collection("ASK").doc(this.$props.id))
        .then(document => {
          console.log(document);
          this.title = document.title;
          this.desc = document.desc;
        })
        .catch(err => {
          console.error(err);
        });

      this.$binding("askComment", this.$firestore.commentCollection);
    }
  },

  methods: {
    allowedStep: m => m % 10 === 0,
    addAskComment() {
      this.$firestore.commentCollection
        .add({
          desc: this.askNewComment,
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then(console.log())
        .catch();
    },
    save() {
      this.$firestore.askCollection
        .add({
          title: this.title,
          desc: this.desc,
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
          this.$router.go(-1);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    },
    deleteItem() {
      this.$firestore.askCollection
        .doc(this.$props.id)
        .delete()
        .then(this.$router.go(-1));
    },
    modifyItem() {
      this.$firestore.askCollection
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
    },

    addNewAnswer() {
      this.$firestore.answerCollection
        .add({
          desc: this.newAnswerDesc,
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then(() => {
          this.newAnswerDesc = "";
        })
        .catch();
    }
  }
};
</script>