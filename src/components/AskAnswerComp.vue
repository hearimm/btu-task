<template>
  <v-card>
    <v-divider></v-divider>
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>답변</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid">
        <v-textarea label="답변" v-model="desc" :readonly="!isPermission"></v-textarea>
        <v-card-actions v-if="isPermission">
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="loadingDelete"
            :disabled="loadingDelete"
            @click="deleteAnswer"
          >Delete</v-btn>
          <v-btn
            color="success"
            :loading="loadingModify"
            :disabled="loadingModify"
            @click="modifyAnswer"
          >수정</v-btn>
        </v-card-actions>
      </v-form>
      <v-list>
        <template v-for="(item, index) in comments">
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
              <v-btn icon v-if="isPermissionComment(item.uid)" @click="deleteComment(item['.key'])">
                <v-icon color="grey lighten-1">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < comments.length" :key="index"></v-divider>
        </template>
      </v-list>
      <v-layout row wrap>
        <v-flex>
          <v-text-field v-model="answerNewComment" label="댓글쓰기" required></v-text-field>
        </v-flex>
        <v-flex>
          <v-btn color="primary" @click="addAnswerComment">등록</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>


<script>
import { db } from "../firebase";
export default {
  props: ["askId", "answerId"],
  data() {
    return {
      desc: "",
      valid: false,
      hasSaved: false,
      isEditing: null,
      model: null,
      isUpdating: false,
      isPermission: false,
      askNewComment: "",
      answerNewComment: "",
      comments: [],
      uid: "",
      loadingModify: false,
      loadingDelete: false
    };
  },

  firestore() {
    return {
      answerCollection: db.collection("ASK/" + this.$props.id + "/answer"),
      answerDocument: db
        .collection("ASK/" + this.$props.askId + "/answer")
        .doc(this.$props.answerId),
      answerCommentCollection: db.collection(
        "ASK/" +
          this.$props.askId +
          "/answer/" +
          this.$props.answerId +
          "/comments"
      )
    };
  },

  mounted() {
    // Binding Docs
    if (this.$props.answerId) {
      this.$binding(
        "answer",
        db
          .collection("ASK/" + this.$props.askId + "/answer")
          .doc(this.$props.answerId)
      )
        .then(document => {
          this.answer = document;
          this.uid = document.uid;
          this.desc = document.desc;
          this.isPermission = this.$store.getters["uid"] === document.uid;
        })
        .catch(err => {
          console.error(err);
        });

      this.$binding(
        "comments",
        db.collection(
          "ASK/" +
            this.$props.askId +
            "/answer/" +
            this.$props.answerId +
            "/comments"
        )
      )
        .then(document => {})
        .catch(err => {
          console.error(err);
        });
    }
  },

  methods: {
    allowedStep: m => m % 10 === 0,
    addAskComment() {
      console.log("newAddAskComment");
    },
    isPermissionComment(uid) {
      return this.$store.getters["uid"] === uid;
    },
    addAnswerComment() {
      console.log(this.$firestore.answerCommentCollection);
      console.log(this.$store);
      this.$firestore.answerCommentCollection
        .add({
          desc: this.answerNewComment,
          uid: this.$store.getters["uid"],
          displayName: this.$store.getters["displayName"],
          create_dt: new Date(),
          update_dt: new Date()
        })
        .then()
        .catch(err => {
          console.log(error);
        });
    },
    deleteComment(id) {
      this.$firestore.answerCommentCollection
        .doc(id)
        .delete()
        .then(() => {
          console.log("delete comments:");
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteAnswer() {
      this.loadingDelete = true;
      this.$firestore.answerDocument
        .delete()
        .then(() => {
          console.log("delete Answer");
          this.loadingDelete = false;
        })
        .catch(err => {
          this.loadingDelete = false;
          console.log(err);
        });
    },
    modifyAnswer() {
      this.loadingModify = true;
      this.$firestore.answerDocument
        .set(
          {
            desc: this.desc,
            update_dt: new Date()
          },
          { merge: true }
        )
        .then(() => {
          this.loadingModify = false;
        })
        .catch(err => {
          this.loadingModify = false;
          console.log(err);
        });
    }
  }
};
</script>