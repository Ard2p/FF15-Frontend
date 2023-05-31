<template>
  <div class="contacts card">
    <div style="display: flex; justify-content: flex-start; margin-top: 10px;">
      <!-- <p style="flex-grow: 2; width: 67%;">Команда FF15 занимается автоматизацией ивентов, чтобы связаться с нами выберите одну из причин обращения!</p> -->
      <div
        class="dropdown js-dropdown"
        style="flex-grow: 1; max-width: 33%; margin-left: 0; margin-right: 20px;"
        :class="ddOpen ? 'active' : ''"
        v-click-outside="close"
      >

      <div
          class="dropdown__body js-dropdown-body"
          v-if="ddOpen"
        >
          <a
            class="dropdown__item"
            v-for="(reason, ridx) in reasons" :key="reason"
            @click="selected = ridx; close()"
            :class="{
              moon: theme === 'moon'
            }"
            style="cursor: pointer"
          >
            <div
              class="dropdown__title title"
              :style="{
                color: selected === ridx ? 'var(--primary-main)' : ''
              }"
              style="margin: 0 auto;"
            >
              {{ reason }}
            </div>
          </a>
        </div>
        <div
          class="zind-fix dropdown__head js-dropdown-head"
          @click="ddOpen = !ddOpen"
          :class="{
            moon: theme === 'moon',
            
          }"
          style="background: var(--primary-decor4);"
        >
          <!-- 'filter-active': leagPicked !== 'wat' -->
          <span v-if="selected || selected === 0" style="margin: 0 auto;">
            {{ reasons[selected] }}
          </span>
          <span v-else style="color: #808191; text-align: center;">Цель обращения</span>
          <svg class="icon icon-arrow-down">
            <use xlink:href="/img/icons.svg#icon-arrow-down"/>
          </svg>
        </div>
      </div>
      <input
        type="email"
        required autocomplete="off"
        v-model="email"
        style="width: 100%;
          height: 48px;
          padding: 0 20px;
          border-radius: 12px;
          background: var(--primary-decor4);
          font-family: Inter, sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-text);
          transition: background 0.25s;
          max-width: 350px;
        "
        placeholder="Электронная почта"
      />
    </div>
    <textarea class="contacts_ta" placeholder="Сообщение" style="font-family: Inter, sans-serif; resize:vertical; color: var(--primary-text); border: 0; border-radius: 0.5rem; padding: 10px 20px; font-size: 14px; background: var(--primary-decor4); width: 100%; height: 420px; margin-top: 20px; font-weight: 600;" v-model="msg"/>
    <div style="display: flex; width: 100%; justify-content: space-between; margin-top: 20px;">
      <input ref="fileinp" type="file" multiple="multiple" @change="handleFileUpload"/>
      <button class="btn" @click="send">Отправить</button>
    </div>
    <h4 v-if="files.length > 0">Файлы к отправлению</h4>
    <ul style="font-size: 15px; line-height: 1.5">
      <li
        v-for="(f, fidx) in files"
        :key="fidx"
      >
        {{f.name}}
      </li>
    </ul>
  </div>
</template>


<script>
import axiosInstance from '@/store/axiosInstance.js'
export default {
  name: 'Contacts',
  data() {
    return {
      ddOpen: false,
      reasons: [
        'Жалоба',
        'Сотрудничество',
        'Ошибка на сайте',
        'Другое'
      ],
      selected: null,
      msg: '',
      email: null,
      files: []
    }
  },
  methods: {
    close() {
      this.ddOpen = false
    },

    handleFileUpload() {
      this.files = this.$refs.fileinp.files
      console.log(this.files)
    },

    send() {
      const fd = new FormData()
      fd.append("reason", this.selected)
      fd.append("msg", this.msg)
      fd.append("email", this.email)
      this.files.forEach(f => fd.append("files[]", f))
      axiosInstance({
        method: 'post',
        url: 'myurl.myy',
        data: fd,
        headers: {'Content-Type': 'multipart/form-data' }
      })
        .then(function (response) {
            //handle success
            console.log(response);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    }
  },
  computed: {
    theme() {
      return this.$store.state.main.theme
    }
  }
}
</script>
<style lang="scss" scoped>
.contacts.card {
  .dropdown__head,
  .dropdown__body {
    z-index: 0;
  }
}
.contacts {
  font-size: 20px;
  min-height: 65vh;
  width: 100%;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  max-width: 900px;
  margin: 20px auto;
  text-align: left;
}
.dropdown__head .icon {
  fill: var(--primary-text);
  transition: .25s;
  margin-right: 7px;
}
.dropdown__head .icon.icon-arrow-down {
  position: absolute;
  width: 10px;
  height: 6px;
  top: 55%;
  right: 5px;
  transform: translateY(-50%);
  font-size: 6px;
  transition: all .25s;
  fill: var(--primary-text2)
}
.btn {
  /* margin: 0 auto; */
  height: 36px;
  line-height: 36px;
  width: fit-content;
  color: #fff;
  background-color: var(--primary-main);
  border-radius: 10px;

  border: 0;
}

.contacts_ta::placeholder {
  color: #808191;
}
</style>