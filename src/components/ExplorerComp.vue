<template>
  <v-layout justify-center>
    <v-flex xs12 sm6>
      <v-card>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex v-for="card in cards" :key="card.id" v-bind="{ [`xs${card.flex}`]: true }">
              <v-card @click="routeTo(card.id)">
                <v-img :src="card.src" height="200px">
                  <v-container fill-height fluid pa-2>
                    <v-layout fill-height>
                      <v-flex xs12 align-end flexbox>
                        <span class="headline white--text" v-text="card.title"></span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-img>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>favorite</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>bookmark</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>share</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    cards: [
      {
        id: "1",
        title: "배성재의 텐",
        src:
          "https://img2.sbs.co.kr/img/sbs_cms/WE/2019/04/02/WE97457852_ori.jpg",
        flex: 12
      },
      {
        id: "2",
        title: "윤태진",
        src:
          "https://w.namu.la/s/e083efb3772283675d46562f998e33a767aa3c4fa5d8a8f0c75a914a43512675ce1ed068bd9c221bb1052ab40afa4975219565cddf8267055eb6e1ff1534a5edc9928418ada456a02959ed168f8791286c89f09fba5c290be0688da927e9cd11",
        flex: 6
      },
      {
        id: "3",
        title: "장예원",
        src:
          "https://w.namu.la/s/33e7a31044cbda3cf89217bcd63d732bbbf6104c23311c19b2b74cd3823ddf8e94fd15c49960807545bb554fa5f21159260de2ccc3588f393510287cf74d6502d8faf7d1ef5192550727fb58826366584def7995e15b740adf037622a17aaa7c",
        flex: 6
      }
    ]
  }),
  methods: {
    routeTo(id) {
      this.$router.push({ name: "detail", params: { id: id } });
    }
  }
};
</script>