<template>
  <v-card class="hide-overflow">
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>프리셋 수정</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-card-text>
        <v-select
          v-model="rev"
          :items="revs"
          label="Rev"
          :item-text="revItemText"
          item-value=".key"
          return-object
          @change="rollback_rev()"
        ></v-select>
        <v-text-field v-model="change_reason" label="수정 사유" required></v-text-field>
        <v-text-field v-model="name" label="프리셋 이름" required></v-text-field>
        <v-text-field v-model="title" label="제목" required></v-text-field>
        <!-- <v-text-field v-model="weekday" label="요일" required></v-text-field> -->

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
        <v-select
          v-model="broadcastType"
          :items="broadcastTypes"
          item-text="name"
          item-value=".key"
          label="방송타입"
          chips
          clearable
          prepend-icon="tv"
          return-object
        >
          <template v-slot:selection="data">
            <v-chip :selected="data.selected" outline :color="data.item.color">
              <strong>{{ data.item.name }}</strong>
            </v-chip>
          </template>
        </v-select>
        <v-select
          v-model="chips"
          :items="casts"
          item-text="name"
          item-value=".key"
          label="MC/출연자"
          chips
          clearable
          prepend-icon="account_circle"
          multiple
          return-object
        >
          <template v-slot:selection="data">
            <v-chip :selected="data.selected" close @input="remove(data.item)">
              <v-avatar>
                <v-img :src="data.item.photoLink"/>
              </v-avatar>
              <strong>{{ data.item.name }}</strong>&nbsp;
            </v-chip>
          </template>
        </v-select>
        <v-text-field v-model="castText" label="MC/출연자(기타)" required></v-text-field>
        <v-text-field v-model="castTextConcat" label="MC/출연자(저장양식)" readonly box required></v-text-field>
        <v-list-tile avatar>
          <v-spacer/>
          <v-spacer/>

          <v-list-tile-avatar>
            <v-img :src="update_photoURL" v-if="update_photoURL"/>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{update_name}}</v-list-tile-title>
            <v-list-tile-sub-title>edited {{computed_update_dt}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
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
    <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>저장되었습니다.</v-snackbar>
  </v-card>
</template>

<script>
import { db } from "../firebase";
import {commonAllowedStep} from "../common";
import moment from "moment";
import shared from "../shared";

export default {
  props: ["id"],
  data() {
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ];

    return {
      name: "",
      // weekday: "",
      menuTime: false,
      title: "",
      time: "",
      desc: "",
      cast: "",
      castText: "",
      valid: false,
      hasSaved: false,
      isEditing: null,
      model: null,
      isUpdating: false,
      chips: [],
      broadcastType: null,
      create_dt: "",
      create_name: "",
      update_uid: "",
      update_dt: null,
      update_photoURL: null,
      update_name: "",
      document: null,
      change_reason: "",
      revs: [],
      rev: null,
      loadingModify: false,
      loadingDelete: false
    };
  },

  firestore() {
    return {
      casts: db.collection("CAST").orderBy("name"),
      broadcastTypes: db.collection("BROADCAST_TYPE").orderBy("name")
    };
  },

  mounted() {
    // Binding Docs
    if (this.$props.id) {
      this.$binding("document", db.collection("PRESET").doc(this.$props.id))
        .then(document => {
          this.name = document.name;
          // this.weekday = document.weekday;
          this.title = document.title;
          this.time = document.time;
          this.desc = document.desc;
          this.cast = document.cast;
          this.castText = document.castText;
          this.chips = document.chips;
          this.create_dt = document.create_dt;
          this.broadcastType = document.broadcastType;
          this.create_name = document.create_name;
          this.update_uid = document.update_uid;
          this.update_dt = document.update_dt;
          this.update_photoURL = document.update_photoURL;
          this.update_name = document.update_name;
          this.document = document;
        })
        .catch(err => {
          console.error(err);
        });

      this.$binding(
        "revsCollection",
        db
          .collection("PRESET")
          .doc(this.$props.id)
          .collection("REV")
          .orderBy("update_dt", "desc")
      )
        .then(collection => {
          if (collection.length > 0) {
            this.revs = collection;
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },

  computed: {
    castTextConcat() {
      let result = [];
      if (typeof this.castText === "undefined") {
        this.castText = "";
      }
      if (!shared.isIterable(this.chips)) {
        return "";
      }
      for (const item of this.chips) {
        result.push(item.name);
      }
      if (this.castText.length > 0) {
        this.cast = result.join(",") + "," + this.castText;
      } else {
        this.cast = result.join(",");
      }
      return this.cast;
    },
    computed_update_dt() {
      if (this.update_dt) {
        return moment(this.update_dt.toDate()).fromNow();
      } else {
        return "";
      }
    }
  },

  methods: {
    allowedStep: commonAllowedStep,
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    revItemText(item) {
      return (
        item.update_name +
        " - " +
        moment(item.update_dt.toDate()).format("lll") +
        " - " +
        item.change_reason
      );
    },
    rollback_rev(item) {
      this.name = this.rev.name;
      // this.weekday = this.rev.weekday;
      this.title = this.rev.title;
      this.time = this.rev.time;
      this.desc = this.rev.desc;
      this.cast = this.rev.cast;
      this.castText = this.rev.castText;
      this.chips = this.rev.chips;
      this.broadcastType = this.rev.broadcastType;
      this.create_dt = this.rev.create_dt;
      this.create_name = this.rev.create_name;
      this.update_uid = this.rev.update_uid;
      this.update_dt = this.rev.update_dt;
      this.update_photoURL = this.rev.update_photoURL;
      this.update_name = this.rev.update_name;
    },
    deleteItem() {
      this.loadingDelete = true;
      db.collection("PRESET")
        .doc(this.$props.id)
        .delete()
        .then(this.$router.go(-1));
    },
    modifyItem() {
      // Get a new write batch
      this.loadingModify = true;
      var batch = db.batch();

      // Set the value of 'NYC'
      var nowDoc = {
        name: this.name,
        // weekday: this.weekday,
        title: this.title,
        time: this.time,
        desc: this.desc,
        cast: this.cast,
        chips: this.chips,
        broadcastType: this.broadcastType,
        color: this.broadcastType.color,
        castText: this.castText,
        update_dt: new Date(),
        update_uid: this.$store.getters["uid"],
        update_photoURL: this.$store.getters["photoURL"],
        update_name: this.$store.getters["displayName"]
      };
      var taskRef = db.collection("PRESET").doc(this.$props.id);
      batch.update(taskRef, nowDoc);

      // Update the population of 'SF'
      var revRef = db
        .collection("PRESET")
        .doc(this.$props.id)
        .collection("REV")
        .doc();

      nowDoc["change_reason"] = this.change_reason;
      batch.set(revRef, nowDoc);

      // Commit the batch
      batch.commit().then(() => {
        this.loadingModify = true;
        this.$router.go(-1);
      });
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>