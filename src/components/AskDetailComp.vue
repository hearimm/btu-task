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
            <v-text-field v-model="title" label="제목" :readonly="!isPermission(uid)" required></v-text-field>
            <v-textarea label="설명" v-model="desc" :readonly="!isPermission(uid)"></v-textarea>
          </v-card-text>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions v-if="isPermission(uid)">
          <v-spacer></v-spacer>
          <v-btn color="success" @click="cancel">Cancel</v-btn>
          <v-btn
            color="success"
            :loading="loadingDelete"
            :disabled="loadingDelete"
            @click="deleteItem"
          >Delete</v-btn>
          <v-btn
            color="success"
            :loading="loadingModify"
            :disabled="loadingModify"
            @click="modifyItem"
          >수정</v-btn>
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
            <template v-for="(item, index) in askComment">
              <v-list-tile :key="item['.key']" style="height:auto;">
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{item.displayName}}
                    <span
                      class="text--secondary"
                    >{{ item.update_dt.toDate() | dateRemain}}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">{{item.desc}}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon v-if="isPermission(item.uid)" @click="deleteComment(item['.key'])">
                    <v-icon color="grey lighten-1">delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < askComment.length" :key="index"></v-divider>
            </template>
          </v-list>

          <v-layout row wrap v-if="isUserAuthenticated()">
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

      <v-card class="hide-overflow" v-if="isUserAuthenticated()">
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
      newAnswerDesc: "",
      uid: "",
      loadingModify: false,
      loadingDelete: false
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
          this.uid = document.uid;
        })
        .catch(err => {
          console.error(err);
        });

      this.$binding(
        "answers",
        db.collection("ASK/" + this.$props.id + "/answer")
      )
        .then(document => {
          console.log(document);
          this.answer = document[0];
          console.log(this.answer);
        })
        .catch(err => {
          console.error(err);
        });

      this.$binding("askComment", this.$firestore.commentCollection);
    }
  },

  methods: {
    isPermission(uid) {
      return this.$store.getters["uid"] === uid;
    },
    isUserAuthenticated() {
      return this.$store.getters["isUserAuthenticated"];
    },
    addAskComment() {
      this.$firestore.commentCollection
        .add({
          desc: this.askNewComment,
          uid: this.$store.getters["uid"],
          displayName: this.$store.getters["displayName"],
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then(() => {
          this.askNewComment = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteComment(id) {
      this.$firestore.commentCollection
        .doc(id)
        .delete()
        .then(() => {
          console.log("delete comments:");
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteItem() {
      this.loadingDelete = true;
      this.$firestore.askCollection
        .doc(this.$props.id)
        .delete()
        .then(() => {
          this.loadingDelete = false;
          this.$router.go(-1);
        });
    },
    modifyItem() {
      this.loadingModify = true;
      this.$firestore.askCollection
        .doc(this.$props.id)
        .update({
          title: this.title,
          desc: this.desc,
          update_dt: new Date()
        })
        .then(() => {
          this.loadingModify = false;
          this.$router.go(-1);
        });
    },
    cancel() {
      this.$router.go(-1);
    },

    addNewAnswer() {
      this.$firestore.answerCollection
        .add({
          desc: this.newAnswerDesc,
          uid: this.$store.getters["uid"],
          displayName: this.$store.getters["displayName"],
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then(doc => {
          console.log(doc);
          this.newAnswerDesc = "";
        })
        .catch();
    }
  }
};
</script>