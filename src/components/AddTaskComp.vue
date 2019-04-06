<template>
  <v-card class="hide-overflow">
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>일정 추가</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-card-text>
        <v-text-field label="제목" required></v-text-field>
        <v-text-field label="날짜" required></v-text-field>
        <v-text-field label="시간" required></v-text-field>
        <v-text-field label="설명" required></v-text-field>
        <v-text-field label="MC/출연자" required></v-text-field>
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!isEditing" color="success" @click="save">Save</v-btn>
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
export default {
  data() {
    const srcs = {
      1: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      2: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      3: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
      4: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
      5: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
    };
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ];

    return {
      valid: false,
      hasSaved: false,
      isEditing: null,
      model: null,
      states: [
        { name: "Florida", abbr: "FL", id: 1 },
        { name: "Georgia", abbr: "GA", id: 2 },
        { name: "Nebraska", abbr: "NE", id: 3 },
        { name: "California", abbr: "CA", id: 4 },
        { name: "New York", abbr: "NY", id: 5 }
      ],
      friends: ["Sandra Adams", "Britta Holt"],
      isUpdating: false,
      autoUpdate: true,
      people: [
        { header: "Group 1" },
        { name: "배성재", group: "Group 1", avatar: srcs[1] },
        { name: "윤태진", group: "Group 1", avatar: srcs[2] },
        { name: "장예원", group: "Group 1", avatar: srcs[3] },
        { name: "박문성", group: "Group 1", avatar: srcs[2] },
        { divider: true },
        { header: "Group 2" },
        { name: "이석우", group: "Group 2", avatar: srcs[4] },
        { name: "이말년", group: "Group 2", avatar: srcs[5] },
        { name: "정용국", group: "Group 2", avatar: srcs[1] },
        { name: "홍진호", group: "Group 2", avatar: srcs[3] }
      ]
    };
  },

  methods: {
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.abbr.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    save() {
      this.isEditing = !this.isEditing;
      this.hasSaved = true;
    }
  }
};
</script>