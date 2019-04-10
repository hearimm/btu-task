<template>
    <v-card>
        <v-divider></v-divider>
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>답변</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
    <v-form v-model="valid">
      <v-textarea label="답변" v-model="answer.desc"></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="deleteAnswer">Delete</v-btn>
        <v-btn color="success" @click="modifyAnswer">수정</v-btn>
      </v-card-actions>
    </v-form>
    <v-list>
      <template v-for="(item) in answerComments">
        <div :key="item['.key']" style="height:auto;">
          <v-divider></v-divider>
          <v-list-tile-content>
            <v-list-tile-sub-title class="text--primary">{{item.desc+" - " +item.user_name}}
              <span class="text--secondary">{{" "+item.update_dt}}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </div>
      </template>
      <v-divider></v-divider>
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
      menuDate: false,
      menuTime: false,
      title: "",
      desc: "",
      valid: false,
      hasSaved: false,
      isEditing: null,
      model: null,
      isUpdating: false,
      askNewComment:"",
      answerNewComment:"",
      answerComments:"",
      askComment: [
        {desc: "야야야",user_name:"나",update_dt:"2019-04-10 22:00"},
        {desc: "야야야",user_name:"나",update_dt:"2019-04-10 22:00"},
        {desc: "야야야",user_name:"나",update_dt:"2019-04-10 22:00"},
        {desc: "야야야",user_name:"나",update_dt:"2019-04-10 22:00"},
      ],
      answer: {
        desc: "", user_name:"나",update_dt:"2019-04-10 22:00"
      }
    };
  },


  firestore() {
    console.log(this.$props.askId);
    console.log(this.$props.answerId);
    return {
      answerCollection: db.collection("ASK/" + this.$props.id + "/answer"),
      answerCommentCollection: db.collection("ASK/" + this.$props.askId + "/answer/" + this.$props.answerId + "/comments" )
    };
  },

  mounted() {
    // Binding Docs
    if (this.$props.answerId) {

      this.$binding(
        "answers",
        db.collection("ASK/" + this.$props.askId + "/answer").doc(this.$props.answerId)
      )
      .then(document => {
        this.answer = document;
      })
      .catch(err => {
        console.error(err);
      });
      

      this.$binding(
        "answerComments",
        db.collection("ASK/" + this.$props.askId + "/answer/" + this.$props.answerId + "/comments")
      )
        .then(document => {
          console.log("answerComments:" +  document);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },

  methods: {
    allowedStep: m => m % 10 === 0,
    addAskComment(){
      console.log("newAddAskComment")
    },
    addAnswerComment() {
      console.log("new");
    },
    deleteAnswer() {
      console.log("deleteAnswer");
    },
    modifyAnswer() {
      console.log("modifyAnswer");
    },
    save() {
      this.$firestore.askCollection
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
    }
  }

};
</script>