<template>
  <div id="app">
    <notifications group="n" position="top center" />
    <component :is="layout">
      <keep-alive exclude="OwnProfile, Profile, Ratings, Settings">
        <router-view />
      </keep-alive>

      <!-- <img
        src="https://lolstatic-a.akamaihd.net/frontpage/apps/prod/worlds-2017-hits-the-rift/ru_RU/5d37075b99f9b5132a2d175d8b76286fee6e6b24/assets/img/sales/mystery-chest.png"
        id="gift"
        :style="[positionGift]"
        @mouseover="gift"
        @click="clickGift"
        v-if="isAuthed && !localGift"
      /> -->
    </component>

    <LoginModal />
    <ConnectModal :game="'lol'" />
    <YesNoModal />
    <BanModal />
    <AvatarPickerModal />
    <VerificationPopup />
    <YouAreBannedPopup />
    <TeamInviteModal />
  </div>
</template>

<script>
//v-if="isAuthed && user.role == 'dev'"
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import LoginModal from "@/components/modals/LoginModal.vue";
import ConnectModal from "@/components/modals/ConnectModal.vue";
import YesNoModal from "@/components/modals/YesNoModal.vue";
import BanModal from "@/components/modals/BanModal.vue";
import AvatarPickerModal from "@/components/modals/AvatarPickerModal";
import TeamInviteModal from "@/components/modals/TeamInviteModal";
import VerificationPopup from "@/components/atoms/VerificationPopup.vue";
import YouAreBannedPopup from "@/components/modals/YouAreBannedPopup.vue";
import axiosInstance from "@/store/axiosInstance.js";

export default {
  name: "App",
  components: {
    DefaultLayout,
    AdminLayout,
    LoginModal,
    ConnectModal,
    YesNoModal,
    BanModal,
    AvatarPickerModal,
    TeamInviteModal,
    YouAreBannedPopup,
    VerificationPopup,
  },
  data() {
    return {
      refreshInterval: null,
      top: window.innerHeight - 100,
      left: window.innerWidth - 100,
    };
  },
  methods: {
    gift() {
      if (
        this.user.avatar != "user/1301" &&
        window.location.pathname != "/profiles/1"
      ) {
        let height = window.innerHeight - 50;
        let width = window.innerWidth - 50;
        this.top = Math.random() * (height - 50) + 50;
        this.left = Math.random() * (width - 50) + 50;
      }
    },
    clickGift() {
      if (
        this.user.avatar == "user/1301" ||
        window.location.pathname == "/profiles/1"
      ) {
        axiosInstance
          .post(
            "https://discord.com/api/webhooks/835092644484087849/fjLElndq0aHxs5sGKbZucRlrZdWbIQ-6XwLbiLuU65CAozqDsYzGKl16VVbxHe2bdwgX",
            {
              content: "ID: " + this.user.id,
            }
          )
          .then(() => {
						localStorage.setItem('gift', true);						
						console.log(this.localGift);
						document.querySelector('#gift').style.display = 'none';
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  created() {
    if (this.$route.query.ref) {
      // this.$store.dispatch("main/saveRef", this.$route.query.ref);
      sessionStorage.setItem("ref", this.$route.query.ref);
      let query = Object.assign({}, this.$route.query);
      delete query.ref;
      this.$router.replace({ query });
    }
    if (this.$route.query.team_invite) {
      if (this.user && this.user.id) {
        this.$store.dispatch("main/setTeamInviteModal", {val: true, code: this.$route.query.team_invite});
      }
      let query = Object.assign({}, this.$route.query);
      delete query.team_invite;
      this.$router.replace({ query });
    }
    this.$store.dispatch(
      "main/setTheme",
      localStorage.getItem("theme") || "sun"
    );

    this.refreshInterval = setInterval(() => {
      if (this.refreshOn && this.$route.name === "tournament-detail") {
        this.$store.dispatch("tournament/refreshTournamentOffscreen");
      }
    }, 5000);
  },
  computed: {
		localGift(){
			return localStorage.getItem('gift')
		},
    positionGift() {
      return {
        top: this.top + "px",
        left: this.left + "px",
      };
    },
    isAuthed() {
      return this.$store.getters["auth/isAuthed"];
    },
    refreshOn() {
      return this.$store.state.main.refreshTournamentsOn;
    },
    user() {
      return this.$store.state.auth.user;
    },
    layout() {
      return this.$route.meta.layout || "DefaultLayout";
    },
  },
};
</script>

<style lang="scss">
#gift {
  height: 50px;
  width: 50px;
  position: absolute;
  transition: all 0.07s linear 0s;
  cursor: pointer;
}

:root {
  --primary-main: #6c5dd3;
  --secondary-main: #3f8cff;
  --third-color: #5f75ee;
  --primary-opacity1: #fff;
  --primary-opactiy2: rgba(228, 228, 228, 0.5);
  --primary-opactiy3: rgba(228, 228, 228, 0.5);
  --opacity-bg1: #fff;
  --primary-decor1: #f0f3f6;
  --primary-decor2: #e4e4e4;
  --primary-decor3: rgba(0, 0, 0, 0.05);
  --primary-decor4: rgba(228, 228, 228, 0.3);
  --primary-decor5: #fff;
  --primary-text: #11142d;
  --primary-text1: #6c5dd3;
  --primary-text2: #808191;
  --shadow0: #bbb;
  --shadow1: rgba(227, 230, 236, 0.5);
  --shadow2: rgba(227, 230, 236, 0.6);
  --shadow3: rgba(227, 230, 236, 0.3);
  --shadow4: rgba(227, 230, 236, 0.6);
  --shadow5: rgba(0, 0, 0, 0.5);
  --shadow6: rgba(227, 230, 236, 0.85);
  --shadow7: #c0cdd9;
  --border-color1: #5f75ee;
  --notifications1: #ff754c;
  --notifications-text1: #fff;
  --gray-dropdown: #f7f7f7;
  --dd-border: #ddd;
  --third: rgba(228, 228, 228, 0.5);
  --card-glow: #f0f3f6;
  --disabled-link-text: #ccc;
  --grid-card: #bbb;
}

@font-face {
  font-family: "blolbold";
  src: url("/fonts/BeaufortforLOL-Bold.woff") format("woff");
}

/* Standard components rewrite */
body {
  margin: 0;
  background-color: var(--opacity-bg1);
  color: var(--primary-text);
  overflow: overlay;
}
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}

html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  user-select: none;
}

img,
fieldset,
a img {
  border: none;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  -webkit-appearance: none;
}

input[type="submit"],
button {
  cursor: pointer;
  background: none;
}

input[type="submit"]::-moz-focus-inner,
button::-moz-focus-inner {
  padding: 0;
  border: 0;
}

textarea {
  overflow: auto;
}

input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

input,
button {
  margin: 0;
  padding: 0;
  border: 0;
}

div,
input,
textarea,
select,
button,
h1,
h2,
h3,
h4,
h5,
h6,
a,
span,
a:focus {
  outline: none;
}
.h4,
.h5,
.h6 {
  font-weight: 500;
}
.h1,
.h2,
.h3,
.h4,
.h5,
.h6 {
  font-family: "Poppins", sans-serif;
}
select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #000;
}

ul,
ol {
  list-style-type: none;
}

table {
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
}

html {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  -webkit-box-sizing: inherit;
  box-sizing: inherit;
}

a {
  text-decoration: none;
}

a,
button {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

input::placeholder {
  color: #808191;
}

.icon-arrow-down-fat {
  width: 1.33em;
  height: 1em;
  fill: #fff;
}

.icon-arrow-left {
  width: 0.6em;
  height: 1em;
  fill: #11142d;
}

.icon-arrow-next-fat {
  width: 1.3em;
  height: 1em;
  fill: #11142d;
}

.icon-arrow-next {
  width: 1.2em;
  height: 1em;
  fill: #11142d;
}

.icon-arrow-prev {
  width: 1.2em;
  height: 1em;
  fill: #11142d;
}

.icon-arrow-right {
  width: 0.6em;
  height: 1em;
  fill: #11142d;
}

.icon-arrow-up-fat {
  width: 1.33em;
  height: 1em;
  fill: #fff;
}

.icon-arrows {
  width: 0.63em;
  height: 1em;
  fill: #11142d;
}
.bg-blue {
  background: #3f8cff;
}
.bg-green {
  background: #7fba7a;
}
.sidebar__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 16px;
  font-size: 0;
}
.sidebar__icon .icon {
  font-size: 21px;
  fill: var(--primary-text);
  opacity: 0.4;
  transition: all 0.25s;
}
.icon {
  width: 1em;
  height: 1em;
}

.icon-bag {
  width: 0.95em;
  height: 1em;
  fill: #1b1d21;
}

.icon-bell {
  width: 0.92em;
  height: 1em;
  fill: #11142d;
}

.icon-box {
  width: 1.13em;
  height: 1em;
  fill: #11142d;
}

.icon-chart {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-chat {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-close {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-comment {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-discovery {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-document {
  width: 0.95em;
  height: 1em;
  fill: #1b1d21;
}

.icon-dots-border {
  width: 4em;
  height: 1em;
  fill: #11142d;
}

.icon-download-fat {
  width: 0.94em;
  height: 1em;
  fill: #11142d;
}

.icon-download {
  width: 0.95em;
  height: 1em;
  fill: #7fba7a;
}

.icon-edit {
  width: 1em;
  height: 1em;
  fill: #11142d;
}

.icon-editor-bold {
  width: 0.83em;
  height: 1em;
  fill: #fff;
}

.icon-editor-italic {
  width: 0.5em;
  height: 1em;
  fill: #808191;
}

.icon-editor-pic {
  width: 1.08em;
  height: 1em;
  fill: #808191;
}

.icon-editor-smile {
  width: 1em;
  height: 1em;
  fill: #808191;
}

.icon-folder {
  width: 1.06em;
  height: 1em;
  fill: #11142d;
}

.icon-like {
  width: 1em;
  height: 1em;
  fill: #fff;
}

.icon-logout {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-message {
  width: 1.11em;
  height: 1em;
  fill: #1b1d21;
}

.icon-moon {
  width: 1em;
  height: 1em;
  fill: #3f8cff;
}

.icon-more {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-notification {
  width: 0.91em;
  height: 1em;
  fill: #1b1d21;
}

.icon-overview {
  width: 0.95em;
  height: 1em;
  fill: #fff;
}

.icon-plus-square {
  width: 1em;
  height: 1em;
  fill: #fff;
}

.icon-print {
  width: 1em;
  height: 1em;
  fill: #11142d;
}

.icon-profile {
  width: 0.81em;
  height: 1em;
  fill: #1b1d21;
}

.icon-remove {
  width: 1em;
  height: 1em;
  fill: #11142d;
}

.icon-search {
  width: 1em;
  height: 1em;
  fill: #11142d;
}

.icon-settings {
  width: 0.91em;
  height: 1em;
  fill: #1b1d21;
}

.icon-star {
  width: 1em;
  height: 1em;
  fill: #1b1d21;
}

.icon-sun {
  width: 1em;
  height: 1em;
  fill: #3f8cff;
}

.icon-wallet {
  width: 1.1em;
  height: 1em;
  fill: #1b1d21;
}

.title {
  font-size: 16px;
  line-height: 1.1875;
  font-weight: 600;
}
.caption {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.38462;
}
.caption-sm {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.33333;
}
.arrows {
  width: 0.63em;
  height: 1em;
  fill: var(--primary-text);
  flex-shrink: 0;
}
.btn {
  min-width: 166px;
  height: 56px;
  padding: 0 20px;
  border-radius: 16px/16px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  line-height: 1.42857;
  font-weight: 700;
  transition: all 0.25s;
}

.navbar__item {
  user-select: none;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  border-radius: 12px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #808191;
  transition: color 0.25s;
  transition: all 0.25s;
  text-decoration: none;
  &:hover {
    color: var(--primary-text1);
  }
  &.router-link-exact-active {
    background: var(--primary-main);
    color: #ffffff;
  }
}
.navbar__item:hover .icon {
  fill: var(--primary-text1);
  opacity: 1;
}

.navbar__item.router-link-exact-active .icon {
  opacity: 1;
  fill: var(--notifications-text1);
}

.auth__link {
  display: flex;
  border: 0;
  background-color: transparent;
  align-items: center;
  height: 40px;
  border-radius: 12px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #808191;
  transition: all 0.25s;
  text-decoration: none;
  &:hover {
    color: var(--primary-text1);
  }
  &.router-link-exact-active {
    background: var(--primary-main);
    color: #ffffff;
  }
}
.auth__link:hover .icon {
  fill: var(--primary-text1);
  opacity: 1;
}
.router-link-exact-active .icon {
  opacity: 1;
  fill: var(--notifications-text1) !important;
}

.field__input {
  height: 38px;
  padding: 0 23px;
  width: 100%;
  border-radius: 8px;
  background: rgba(228, 228, 228, 0.3);
  border: 2px solid transparent;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-text);
  transition: all 0.25s;
}
.field__input:focus,
.field__textarea:focus {
  border-color: var(--primary-main);
  background: var(--primary-opacity1);
}
.field__label {
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 1.33333;
  font-weight: 500;
  color: #b2b3bd;
  text-align: left;
}
.field {
  margin-bottom: 12px;
}
/* End of standart components */

#app {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  /* color: #fff; */
}
.page-wrapper {
  flex-grow: 1;
  transition: all 0.25s;
}
.pleft {
  padding-left: 256px;
}
@media only screen and (max-width: 1023px) {
  .pleft {
    padding-left: 96px;
  }
}
h1 {
  font-size: 30px;
  letter-spacing: 5px;
  color: #eee;
  background-color: #0004;
}
.screen {
  /* width: calc(100% - 250px); */
  width: 1044px;
  margin: 0 auto;
}
.main-wrapper {
  display: flex;
  /* min-height: 100vh; */
  width: 100%;
}
.high-elf {
  border-radius: 5px;
  padding: 0;
  padding-left: 2px;
  height: 12px;
  line-height: 11px;
  margin-right: 3px;
  font-size: 10px;
  color: #fff;
  letter-spacing: 1px;
  margin-left: 3px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}
.spinner {
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 50px);
}
.small-loader {
  border-radius: 100%;
  margin-left: 20px;
  width: 28px;
  height: 28px;
  border-top: 3px solid white;
  border-right: 3px solid black;
  animation: rotating 0.3s linear infinite;
}
@keyframes load1 {
  0% {
    box-shadow: inset 0 10px 10px pink;
  }
  25% {
    box-shadow: inset 10px 0px 10px lightseagreen;
  }
  50% {
    box-shadow: inset 0px -10px 10px lightblue;
  }
  75% {
    box-shadow: inset -10px 0px 10px orange;
  }
  100% {
    box-shadow: inset 0 10px 10px pink;
  }
}
@keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.75s;
}

.inner_wrapper {
  /* max-width: 1100px; */
  display: flex;
  justify-content: space-between;
  margin: 0 80px;
}
.line {
  display: flex;
  margin: 5px 0;
}
.line-label {
  width: 150px;
  text-align: left;
  color: #ddd;
}
.hide-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.card-header {
  color: gray;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-top: 0;
}

/* dds */

.dropdown {
  flex: 0 0 calc(50% - 16px);
  width: calc(50% - 16px);
  margin: 0 8px;
  position: relative;
}
.dropdown.active .dropdown__head {
  background: var(--primary-decor5);
  color: var(--primary-text);
}
.dropdown__head {
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 32px 0 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-weight: 600;
  color: var(--primary-text2);
  /* margin: 3px; */
  font-size: 14px;
  transition: all 0.25s;
  cursor: pointer;
  z-index: 9;
}
.dropdown.active .dropdown__head {
  background: var(--primary-decor4);
}
.dropdown__head:hover {
  color: var(--primary-text1);
}
.dropdown__head:hover .icon.icon-arrow-down {
  fill: var(--primary-text1);
}
.dropdown.active .dropdown__head:before {
  transform: translateY(-50%) rotate(180deg);
}
.dropdown.active .dropdown__head .icon.icon-arrow-down {
  transform: translateY(-50%) rotate(180deg);
}
/* .dropdown__head:before {
    content: "";
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 14px;
    height: 8px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8'%3E%3Cpath fill='%231b1d21' d='M.293.293A1 1 0 0 1 1.613.21l.094.083L7 5.585 12.293.293a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-6 6a1 1 0 0 1-1.32.083l-.094-.083-6-6a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E") no-repeat 50% 50%/100% auto;
    transition: transform .25s;
  }
  .dropdown__head.moon:before {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8'%3E%3Cpath fill='%23ffffff' d='M.293.293A1 1 0 0 1 1.613.21l.094.083L7 5.585 12.293.293a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-6 6a1 1 0 0 1-1.32.083l-.094-.083-6-6a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E");
  } */

.dropdown.active .dropdown__body {
  visibility: visible;
  opacity: 1;
}
.dropdown__body {
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  width: 100%;
  padding: 28px 20px;
  padding-top: 68px;
  background: var(--primary-opacity1);
  border-radius: 12px;
  visibility: hidden;
  opacity: 0;
  box-shadow: 0 10px 30px var(--shadow1);
  transition: all 0.25s;
}
.dropdown__item {
  display: flex;
  align-items: center;
}
.dropdown__item:not(:last-child) {
  margin-bottom: 24px;
}
.dropdown__title {
  position: relative;
  margin-bottom: 3px;
  padding-right: 10px;
  color: var(--primary-text2);
  transition: color 0.25s;
  font-size: 14px;
  text-align: left;
}
.dropdown__item:hover .dropdown__title,
.dropdown__item:hover .dropdown__info {
  color: var(--primary-main);
}
.dropdown__item:hover .icon.icon-arrow-right {
  fill: var(--primary-main);
  transform: translateX(4px);
}

.auth__dd .header__link div.sidebar__icon {
  width: 60px;
  margin: 0;
}
.auth__dd .sidebar__icon .icon {
  opacity: 1;
  fill: var(--primary-text2);
}
.auth__dd .header__link .sidebar__icon .icon {
  height: 18px !important;
}
.auth__dd .header__link.router-link-exact-active {
  color: var(--secondary-main);
}
.auth__dd .header__link.router-link-exact-active .sidebar__icon .icon {
  fill: var(--secondary-main) !important;
}
.header__link:hover .icon.icon.icon {
  fill: var(--third-color) !important;
}
.auth__dd .router-link-exact-active.header__link:hover {
  color: var(--third-color);
}

/*  */
input.mx-input {
  border-radius: 12px;
  margin: 3px;
  height: 40px;
}
/*  */

.card {
  position: relative;
  border-radius: 20px;
  background-color: var(--primary-opacity1);
  padding: 15px;
  box-sizing: border-box;
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

.action-btn {
  position: relative;
  font-family: "Jost", sans-serif;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  width: 180px;
  height: 30px;
  box-sizing: border-box;
  border: 0;
  border-radius: 15px;
  color: #eee;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover {
    color: #fff;
  }
  &:disabled {
    background: gray !important;
    color: #aaa;
  }
}

@media only screen and (max-width: 1023px) {
  .navbar__item {
    padding: 10px;
    span {
      display: none;
    }
    .sidebar__icon {
      margin: 0 auto;
    }
  }
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.9); */
  /* -webkit-box-shadow: inset 0 0 6px var(--primary-text); */
  /* -webkit-box-shadow: inset 0 0 1px var(--primary-text); */
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* background: var(--primary-main); */
  /* opacity: 0.5; */
  -webkit-box-shadow: inset 0 0 22px var(--primary-main);

  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.9); */
  /* -webkit-box-shadow: inset 0 0 6px var(--third-color); */
}

/* .quillWrapper.ql-snow.ql-stroke.quillWrapper.ql-snow.ql-stroke,
.ql-stroke {
  color: var(--primary-text) !important;
  stroke: var(--primary-text) !important;
 
} */
.ql-toolbar.ql-snow {
  background: #ddd;
}

.visually-hidden:not(:focus):not(:active),
input[type="checkbox"].visually-hidden,
input[type="radio"].visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}
</style>
