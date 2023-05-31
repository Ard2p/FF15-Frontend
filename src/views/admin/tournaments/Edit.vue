<template>
  <div class="admin screen">
    <div class="card">
      <h2 style="text-align: left; margin: 12px 0">Admin smth</h2>
      <div class="field-wrapper">
        <span class="lab">name</span>
        <input class="field-input" type="text" v-model="tournament.name" />
      </div>
      <div class="field-wrapper">
        <span class="lab">img</span>
        <input class="field-input" type="text" v-model="tournament.img" />
      </div>
      <div class="field-wrapper">
        <span class="lab">desc</span>
        <!-- <textarea class="ta" v-model="tournament.desc"/> -->
<!--        <vue-editor v-model="tournament.desc"></vue-editor>-->
        <editor
          api-key="4ewp816kf6iz90hloda6zqhd131dxq0jy111yatrdmkdduhy"
          v-model="tournament.desc"
          :init="{
             width: 800,
             height: 500,
             language: 'ru',
             statusbar: false,
             plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste imagetools wordcount'
             ],
             toolbar:
              'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
           }"
        />
      </div>
      <div class="field-wrapper">
        <span class="lab">prize</span>
<!--        <vue-editor v-model="tournament.prize"></vue-editor>-->
        <!-- <textarea class="ta" v-model="tournament.prize" /> -->
        <editor
            api-key="4ewp816kf6iz90hloda6zqhd131dxq0jy111yatrdmkdduhy"
            v-model="tournament.prize"
            :init="{
             width: 800,
             height: 500,
             language: 'ru',
             statusbar: false,
             plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste imagetools wordcount'
             ],
             toolbar:
              'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
           }"
        />
      </div>
      <div class="field-wrapper">
        <span class="lab">twitch</span>
        <input class="field-input" type="text" v-model="tournament.twitch" />
      </div>
      <div class="field-wrapper">
        <span class="lab">discord</span>
        <input class="field-input" type="text" v-model="tournament.discord" />
      </div>
      <div class="field-wrapper">
        <span class="lab">game</span>
        <input class="field-input" type="text" v-model="tournament.game" />
      </div>
      <div class="field-wrapper">
        <span class="lab">type</span>
        <select v-model="tournament.type">
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="field-wrapper">
        <span class="lab">level</span>
        <input class="field-input" type="text" v-model="tournament.lvl" />
      </div>
      <div class="field-wrapper">
        <span class="lab">min league</span>
        <select name="select" v-model="tournament.league">
          <option 
            v-for="leagkey in Object.keys($t('lol.leagues'))"
            :key="leagkey"
            :value="leagkey"
          >{{$t('lol.leagues.' + leagkey)}}</option>
        </select>
      </div>
      <div class="field-wrapper">
        <span class="lab">min rank</span>
        <select name="select" v-model="tournament.rank">
          <option 
            v-for="rank in ['I','II','III','IV','V','VI','VII','VIII','IX','X']"
            :key="rank"
            :value="rank"
          >{{rank}}</option>
        </select>
      </div>
      <div class="field-wrapper">
        <span class="lab">max_players</span>
        <input
          class="field-input"
          type="text"
          v-model="tournament.max_players"
        />
      </div>
      <div class="field-wrapper">
        <span class="lab">leave_disable</span>
        <input
          style="appearance: auto"
          type="checkbox"
          v-model="tournament.leave_disable"
        />
      </div>
      <div class="field-wrapper">
        <span class="lab">grid_disable</span>
        <input
          style="appearance: auto"
          type="checkbox"
          v-model="tournament.grid_disable"
        />
      </div>
      <div class="field-wrapper">
        <span class="lab">start</span>
        <DatePicker
          :lang="{
            formatLocale: {
              firstDayOfWeek: 1,
            },
          }"
          type="datetime"
          v-model="tournament.start"
          :default-value="new Date()"
        />
        <!-- <input class="field-input" type="text" v-model="tournament.start"> -->
      </div>
      <div class="field-wrapper">
        <span class="lab">status</span>
        <select v-model="tournament.status">
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div style="display: flex; justify-content: space-between">
        <router-link
          class="btn"
          style="min-width: auto; margin-right: 5px; margin-top: 15px"
          to="/admin/tournaments"
        >
          Вернуться к списку
        </router-link>
        <button class="btn" @click="send">Сабмит</button>
      </div>
    </div>
  </div>
</template>


<script>
import axiosInstance from "@/store/axiosInstance.js";
import DatePicker from "vue2-datepicker";
// import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/ru";

import Editor from '@tinymce/tinymce-vue';

// import { VueEditor } from "vue2-editor";

export default {
  name: "Admin",
  components: {
    DatePicker,
    // VueEditor,
    Editor,
  },
  data: () => {
    return {
      statuses: ["create", "pending", "open"],
      types: ["rtc", "rtc_se", "team", "team_de"],
      tournament: {},
    };
  },
  mounted() {
    if (this.tCurrent) {
      this.$set(this, "tournament", this.tCurrent);
      if (this.tournament.start) {
        this.tournament.start = new Date(this.tournament.start);
      }
    }
  },
  methods: {
    send() {
      const method =
        this.tournament.id || this.tournament.id === 0 ? "put" : "post";
      const url =
        "/api/admin/tournaments" +
        (this.tournament.id || this.tournament.id === 0
          ? "/" + this.tournament.id
          : "");
      axiosInstance[method](url, this.tournament)
        .then((response) => {
          if (
            response.data &&
            response.data.id &&
            (response.statusText === "OK" || response.statusText === "")
          ) {
            this.$notify({
              group: "n",
              text: "Изменен",
              duration: 2500,
            });
            this.$router.push("/admin/tournaments");
          } else if (
            response.data &&
            response.data.id &&
            (response.statusText === "Created" || response.statusText === "")
          ) {
            this.$notify({
              group: "n",
              text: "Создан",
              duration: 2500,
            });
            this.$router.push("/admin/tournaments");
          } else {
            throw Error(JSON.stringify(response.data));
          }
        })
        .catch((err) => {
          this.$notify({
            group: "n",
            text: err,
            duration: 2500,
            type: "error",
          });
        });
    },
  },
  computed: {
    tCurrent() {
      return this.$store.state.adminTournaments.tCurrent;
    },
  },
  watch: {
    tCurrent(newVal) {
      this.$set(this, "tournament", newVal);
      if (this.tournament.start) {
        this.tournament.start = new Date(this.tournament.start);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.admin {
  padding: 10px;
}
.card {
  position: relative;
  border-radius: 20px;
  background-color: var(--primary-opacity1);
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}
.card:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--card-glow);
  filter: blur(43px);
  border-radius: 24px;
  transition: background 0.25s;
}
.field-wrapper {
  display: flex;
  margin: 4px 0;
}
.lab {
  display: block;
  width: 110px;
  min-width: 110px;
  text-align: left;
  display: flex;
  align-items: center;
}
.field-input {
  border: 1px solid #ccc;
  font-size: 16px;
  width: 60%;
  padding: 6px;
  border-radius: 6px;
}
.ta {
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 6px;
  width: 100%;
  min-height: 120px;
  font-size: 16px;
}
.btn {
  height: 36px;
  line-height: 36px;
  margin-top: 16px;
  width: fit-content;
  color: #fff;
  background-color: var(--primary-main);
  border-radius: 10px;

  border: 0;
}
</style>
