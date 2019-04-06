<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card class="hide-overflow">
      <v-toolbar card>
        <v-icon>question_answer</v-icon>
        <v-toolbar-title>문의사항</v-toolbar-title>
      </v-toolbar>
      <v-form v-model="valid">
        <v-card-text>
          <v-text-field label="제목" v-model="title" :rules="titleRules" required></v-text-field>
          <v-textarea
            label="내용"
            v-model="content"
            :rules="contentRules"
            hint="문의/요청사항 등을 입력해주세요."
            required
          ></v-textarea>
        </v-card-text>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="save">Close</v-btn>
        <v-btn :disabled="!valid" color="success" @click.stop="save">Save</v-btn>
      </v-card-actions>
      <v-snackbar
        v-model="hasSaved"
        :timeout="2000"
        absolute
        bottom
        left
      >Your profile has been updated</v-snackbar>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    save() {
      this.show = false;
    }
  },
  data: () => ({
    hasSaved: false,
    valid: false,
    title: "",
    content: "",
    titleRules: [v => !!v || "제목 입력은 필수 입니다."],
    contentRules: [v => !!v || "내용 입력은 필수 입니다."]
  })
};
</script>