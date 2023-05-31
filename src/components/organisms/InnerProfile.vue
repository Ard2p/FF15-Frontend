<template>
  <div class="profile screen">
    <div class="card details-wrapper">
      <div class="acc-one">
        <div style="display: flex;">
          <div class="acc-one__left">
            <Avatar
              :pic="user.avatar"
              :role="user.role"
              :size="132"
              :style="{
                cursor: own ? 'pointer' : ''
              }"
              :class="own ? 'own-ava' : ''"
              style="margin: 8px 0 0;"
              @click.native="avatarClick"
            />
            <!-- <div class="acc-avatar-wrap"> -->
              
              <!-- <img
                :src="user.avatar ? '/storage/img/profileicon/' + user.avatar + '.png' : '/storage/img/profileicon/0.png'"
                width="100%" height="auto"
                class="acc-avatar"
                :style="{
                  cursor: own ? 'pointer' : ''
                }"
                alt="avatar"
                @click="avatarClick"
              /> -->
            <!-- </div> -->
          </div>
          <div class="acc-one__right">
            <div
              class="copied-tt"
              ref="copytt"
            >
              Скопировано
            </div>
            <div
              class="acc-name"
              @click="copyNick"
              v-if="nickname"
            >
              {{nickname}}
            </div>
            <div v-else style="margin-top: 8px;">
              Аккаунт не заполнен
            </div>
            <div
              v-if="nickname && user.role"
              style="font-size: 14px; font-weight: 400; top: 16px; left: 6px;"
              :style="`color: ${$store.state.main.roleToColor[user.role]}`"
            >{{ $t('roles.' + user.role) }}</div>
            <div v-if="!profile || (!profile.rating && !profile.mmr)" style="margin-top: 8px;">
              Профиль не заполнен
            </div>
            <div class="acc-pos" v-if="profile.rating || user.rating">
              Позиция в рейтинге: <span style="color: var(--secondary-main);">{{own ? profile.rating : user.rating}}</span>
            </div>
            <!-- <div v-else class="acc-pos" style="height: 20px;"/> -->
            <div class="acc-leag">
              <span v-if="profile && profile.mmr">
                {{$t('lol.leagues.' + profile.mmr.league)}} {{profile.mmr.division}}
              </span>
            </div>
            <div class="acc-exp"><span style="color: var(--secondary-main);">Уровень {{Math.floor(user.exp / 1000)}}</span><span>{{(user.exp % 1000) / 10}} / 100</span></div>
            <div class="acc-exp__bar" :style="{background: `linear-gradient(90deg, var(--secondary-main) 0%, var(--secondary-main) ${(user.exp % 1000) / 10}%, #808191 ${(user.exp % 1000) / 10}%)`}" />
            <AccStatistics
              v-if="statistics"
              :win="statistics.win"
              :lose="statistics.lose"
              style="margin: 10px 0;"
            />
            <div v-else style="height: 20px; width: 20px; margin: 10px 0; text-align: center;"/>
          </div>
        </div>
      </div>
      <div class="acc-two" v-if="activeAcc" :style="{justifyContent: !(champions && champions.length) ? 'flex-start' : 'center'}">
        <div class="acc-label">
          Приоритет ролей в игре
        </div>
        <RoleTosser
          :style="{
            'margin-bottom': own ? '24px' : '0'
          }"
          :rolesForYou="roles"
        />
        <div v-if="champions && champions.length" class="acc-champs-label acc-label">
          Любимые чемпионы
        </div>
        <FiveChampions
          v-if="champions && champions.length"
          v-bind="{champions}"
        />
      </div>
      <div class="acc-two" v-else/>
      <div class="acc-two" style="width: 20%;">
        <div class="acc-ref" v-if="own">
          <div class="ref-line" v-if="user.referrer" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="font-size: 0.9rem;">Пригласивший: </div>
            <div style="color: var(--primary-text);">{{user.referrer}}</div>
          </div>
          <div class="ref-line" style="text-align: center">
            <button
              v-if="user && user.ref_code"
              class="action-btn"
              :style="{
                backgroundColor: 'var(--primary-main)'
              }"
              @click="refCopy"
            >
              Реферальная ссылка
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import RoleTosser from '@/components/atoms/RoleTosser.vue'
import AccStatistics from '@/components/atoms/AccStatistics.vue'
import Avatar from '@/components/quarks/Avatar'
import FiveChampions from '@/components/atoms/FiveChampions'

export default {
  name: 'InnerProfile',
  components: {
    RoleTosser,
    AccStatistics,
    Avatar,
    FiveChampions
  },
  props: ['own', 'user', 'profile', 'statistics', 'activeAcc', 'nickname', 'roles'],
  computed: {
    champions () {
      return this.own ? this.user && this.user.profile && this.user.profile.champions || [] : (this.profile.champions || [])
    }
  },
  methods: {
    copyNick() {
      if (!this.$refs.copytt.classList.contains('animate-tt')) {
        navigator.clipboard.writeText(this.nickname).then(() => {
          this.$refs.copytt.classList.add('animate-tt')
          setTimeout(() => {
            this.$refs.copytt.classList.remove('animate-tt')
          }, 700)
        }, () => {
          this.$notify({
            group: 'n',
            text: 'Провал',
            duration: 1500,
          })
        });
      }
    },
    avatarClick() {
      if (this.own) {
        this.$store.dispatch('main/setAvatarModal', true)
      }
    },
    refCopy() {
      navigator.clipboard.writeText(window.location.origin + '/?ref=' + this.user.ref_code).then(() => {
        /* clipboard successfully set */
        this.$notify({
          group: 'n',
          text: 'Скопировано',
          duration: 1500,
        })
      }, () => {
        /* clipboard write failed */
        this.$notify({
          group: 'n',
          text: 'Провал',
          duration: 1500,
        })
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.profile {
  padding: 10px;
  color: #BDBDBD;
}

.details-wrapper {
  display: flex;
  padding: 16px;
}
.acc-one {
  width: 40%;
}
.acc-two {
  min-width: 250px;
  width: 40%;
  border-left: 1px solid var(--primary-decor2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12px;
}
.acc-one__left {
  width: 40%;
  display: flex;
}
.acc-one__right {
  text-align: left;
  width: 60%;
  padding-right: 10px;
  padding-left: 12px;
}
.acc-avatar-wrap {
  border-radius: 100%;
  padding: 5px;
  padding-bottom: 1px;
  margin: auto;
  background: linear-gradient(110deg, #6BA4D1, #7D80D1)
}
.acc-avatar {
  border-radius: 100%;
  border: 3px solid var(--primary-opacity1);
}
.acc-roles {
  display: flex;
  justify-content: space-around;
}

.acc-refill {
  display: flex;
}

.acc-name {
  /* user-select: all; */
  color: var(--primary-text);
  font-size: 20px;
  line-height: 36px;
  font-weight: bold;
  cursor: pointer;
  overflow: hidden;
  /* margin-left: -25px; */
}
.acc-pos {
  color: #BDBDBD;
  margin: 5px 0;
}
.acc-leag {
  margin: 0;
  height: 26px;
  line-height: 26px;
  color: #BDBDBD;
  font-weight: bold;
}
.acc-exp {
  display: flex;
  justify-content: space-between;
  color: #BDBDBD;
  font-weight: 500;
  margin: 10px 0;
}
.acc-exp__bar {
  width: 100%;
  height: 6px;
  background-color: #BDBDBD;
  border-radius: 3px;
}
.acc-label {
  color: #BDBDBD;
  font-weight: 500;
  margin: 6px 0;
}
.acc-two .acc-label {
  margin-top: 10px;
  margin-bottom: 14px;
}
.role {
  border-radius: 100%;
  border: 2px solid #BDBDBD;
  width: 32px; height: 32px;
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: 50%;
}
.acc-ref {
  text-align: left;
}
.ref_link {
  color: var(--primary-main);
  &:active {
    color: var(--secondary-main);
  }
}

.copied-tt {
  position: absolute;
  top: -8px; 
  background: var(--secondary-main);
  box-shadow: 0 0 10px #333;
  border-radius: 6px;
  padding: 4px 12px;
  color: #fff;
  height: 28px;
  transform-origin: bottom;
  /* transform: scaleY(0); */
  display: none;
  animation: copy-tt;
  animation-duration: 0.7s;
  z-index: 10;
}
.animate-tt {
  display: block;
}
@keyframes copy-tt {
  0% {
    transform: scaleY(0);
  }
  5% {
    transform: scaleY(1);
  }
  75% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}
.own-ava:hover {
  border-style: dashed;
}
</style>