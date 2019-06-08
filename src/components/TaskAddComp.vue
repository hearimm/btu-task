<template>
  <v-card class="hide-overflow">
    <v-toolbar card>
      <v-icon>question_answer</v-icon>
      <v-toolbar-title>일정 추가</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid">
      <v-card-text>
        <v-select
          v-model="preset"
          :items="presets"
          item-text="name"
          item-value=".key"
          label="프리셋 불러오기"
          chips
          clearable
          prepend-icon="tv"
          return-object
          @change="presetChanged"
        >
          <template v-slot:selection="data">
            <v-chip :selected="data.selected" outline :color="data.item.color">
              <strong>{{ data.item.name }}</strong>
            </v-chip>
          </template>
        </v-select>
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
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" :loading="loadingSave" :disabled="loadingSave" @click="save">Save</v-btn>
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
  props: ["pDate"],
  data() {
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ];

    return {
      preset: null,
      menuDate: false,
      menuTime: false,
      title: "",
      date: "",
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
      loadingSave: false
    };
  },

  firestore() {
    return {
      tasks: db.collection("TASK"),
      casts: db.collection("CAST").orderBy("name"),
      broadcastTypes: db.collection("BROADCAST_TYPE").orderBy("name"),
      presets: db.collection("PRESET").orderBy("name")
    };
  },

  mounted() {
    if (this.$props.pDate) {
      this.date = this.$props.pDate;
    }
  },

  computed: {
    castTextConcat() {
      let result = [];
      if (this.castText === "undefined") {
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
    tags() {
      let obj = new Object();
      if (!shared.isIterable(this.chips)) {
        return null;
      }
      for (const item of this.chips) {
        obj[item[".key"]] = this.timestamp;
      }
      return obj;
    },
    timestamp() {
      return (
        moment(this.date + " " + this.time, "YYYY-MM-DD HH:mm:ss").format("X") *
        1
      );
    }
  },

  methods: {
    allowedStep: commonAllowedStep,
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    save() {
      // Get a new write batch
      this.loadingSave = true;

      var batch = db.batch();
      var saveDoc = {
        title: this.title,
        date: this.date,
        time: this.time,
        desc: this.desc,
        cast: this.cast,
        timestamp: this.timestamp,
        tags: this.tags,
        chips: this.chips,
        broadcastType: this.broadcastType,
        color: this.broadcastType.color,
        castText: this.castText,
        create_dt: new Date(),
        create_uid: this.$store.getters["uid"],
        create_photoURL: this.$store.getters["photoURL"],
        create_name: this.$store.getters["displayName"],
        update_dt: new Date(),
        update_uid: this.$store.getters["uid"],
        update_photoURL: this.$store.getters["photoURL"],
        update_name: this.$store.getters["displayName"]
      };

      var newTaskRef = db.collection("TASK").doc();
      batch.set(newTaskRef, saveDoc);

      // Update the population of 'SF'
      var revRef = newTaskRef.collection("REV").doc();

      saveDoc["change_reason"] = "최초 저장";
      batch.set(revRef, saveDoc);

      // Commit the batch
      batch.commit().then(() => {
        this.hasSaved = true;
        this.isEditing = !this.isEditing;
        this.loadingSave = false;
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    presetChanged(item) {
      if (item) {
        this.title = item.title;
        this.time = item.time;
        this.desc = item.desc;
        this.cast = item.cast;
        this.castText = item.castText;
        this.chips = item.chips;
        this.broadcastType = item.broadcastType;
      } else {
        this.title = "";
        this.time = "";
        this.desc = "";
        this.cast = "";
        this.castText = "";
        this.chips = [];
        this.broadcastType = null;
      }
    }
  }
};
</script>