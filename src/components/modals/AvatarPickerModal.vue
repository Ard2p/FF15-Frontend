<template>
  <div>
    <div
      v-show="isShown"
      class="modal-blur"
      :class="{
        'hide-blur': !isShown
      }"
      @click="$store.dispatch('main/setAvatarModal', false)"
    />
    <div
      class="yesno-modal"
      :style="{
        'transform': isShown ? 'scale(1)' : 'scale(0)',
        'transition': '.25s'
      }"
    >
      <button
        class="close-btn"
        @click="$store.dispatch('main/setAvatarModal', false)"
        :title="$t('login-modal.close-hint')"
      >
        &times;
      </button>
      <div style="margin: 20px auto;">
        Выбор аватара
      </div>
      <Loader v-if="inLoading" style="height: 30px" />
      <div
        v-else
        style="min-height: 30px; overflow-y: auto; max-height: 600px;"
      >
        <div class="category" style="text-align: left; margin-bottom: 12px;" v-for="(cat, catName) in avaData" :key="catName">
          <h4 style="margin-bottom: 6px; text-align: left;">{{$t(`avatar-categories.${catName}`)}}</h4>
          <button
            v-for="a in cat" :key="a.id"
            style="margin: 3px;"
            @click="pickAva(catName, a.id, a.path)"
          >
            <!-- src="/img/685.png" -->
            <img
              width="44"
              :src="`/storage/img/${currentPath}/${a.path}.png`"
              :alt="a.path"
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'AvatarModal',
  components: {
    Loader
  },
  data: () => {
    return {
      inLoading: false,
      avaData: []
    }
  },
  mounted() {
    document.addEventListener("keydown", this.hotKeysModal)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.hotKeysModal)
  },
  methods: {
    hotKeysModal(event) {
      if (event.key === "Escape") {
        this.$store.dispatch('main/setAvatarModal', false)
      }
    },
    getAvatarData() {
      this.inLoading = true
      const dpoint = this.$store.state.main.dpoint
      axiosInstance
        .get(`/api/${dpoint}?page=avatars`)
        .then(resp => {
          // console.log(resp)
          this.avaData = resp.data
          this.inLoading = false
        })
        .catch(err => {
          console.log('error in avatar modal:', err)
          this.inLoading = false
        })
    },
    pickAva(cat, id, path) {
      const dpoint = this.$store.state.main.dpoint
      if (dpoint === 'teams') {
        this.$store.dispatch('team/setTempAva', { category: cat, avatar: id, path })
        this.$store.dispatch('main/setTeamAvatarModal', false)
      } else if (this.inLoading === false) {
        this.inLoading = true
        axiosInstance
          .put(`/api/${dpoint}`, {
            update: 'avatar',
            category: cat,
            avatar: id
          })
          .then(resp => {
            if (resp.data && resp.data.success) {
              this.$notify({
                group: 'n',
                text: 'Аватар изменен',
                duration: 2500
              })
              this.$store.dispatch('auth/setNewAvatar', path)
              this.$store.dispatch('main/setAvatarModal', false)
            }
            this.inLoading = false
          })
          .catch(() => this.inLoading = false)
      }
      
    }
  },
  computed: {
    currentPath () {
      return this.$store.state.main.dpoint === 'teams'
        ? 'teamicon'
        : this.$store.state.main.dpoint === 'champions'
          ? 'champion'
          : 'profileicon'
    },
    isShown() {
      return this.$store.state.main.showAvatarModal
    },
    
  },
  watch: {
    isShown(newVal) {
      if (newVal === true) {
        this.getAvatarData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-blur {
  opacity: 0.8;
  transition: all 0.25s ease-out;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1042;
  overflow: hidden;
  position: fixed;
  z-index: 15;
  background-color: #000;
}
.hide-blur {
  opacity: 0;
}
.yesno-modal {
  z-index: 20;
  position: fixed;
  top: calc(50vh - 400px);
  left: calc(50vw - 482px);
  width: 978px;
  border-radius: 24px;
  padding: 20px 32px;
  background-color: var(--primary-opacity1);
  & h2 {
    margin-bottom: 48px;
    text-align: left;
  }
  &>a {
    line-height: 28px;
  }
}
.close-btn {
  position: absolute;
  font-size: 24px;
  line-height: 48px;
  width: 48px;
  color:var(--primary-text);
  font-weight: 600;
  top: 16px; right: 16px;
  border-radius: 100%;
  &:hover {
    box-shadow: 0 5px 20px var(--shadow6);
  }
}

.soc-btn {
  background-color: var(--primary-main);
  width: 100%;
  border-radius: 12px;
  line-height: 38px;
  color: #ddd;
  font-size: 14px;
  width: 90px;
  /* text-transform: uppercase; */
  font-weight: 600;
  height: 46px;
  &:hover {
    filter: brightness(1.2);
  }
}
</style>
