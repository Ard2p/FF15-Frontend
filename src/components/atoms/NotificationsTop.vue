<template>
  <div
    class="notifications"
    :class="ntOpen ? 'active' : ''"
    v-click-outside="ntClose"
  >
    <button
      class="notifications__open disabled"
    >
      <!-- @click="ntOpen = !ntOpen" -->
      <svg class="icon icon-bell">
        <use xlink:href="/img/icons.svg#icon-bell"></use>
      </svg>
      <span v-if="false" class="notifications__counter">2</span>
    </button>
    <div class="notifications__wrap">
      <div class="notifications__info h6">{{$t('header.recent-noti')}}</div>
      <div class="notifications__list">
        <a class="notifications__item" href="notifications.html">
          <div class="notifications__ava">
            <img class="notifications__pic" :src="(user.avatar || user.avatar === 0) ? '/storage/img/profileicon/' + user.avatar + '.png' : ''" alt=""/>
            <div class="notifications__status bg-blue">
              <!-- xx -->
            </div>
          </div>
          <div class="notifications__details">
            <div class="notifications__line">
              <div class="notifications__user caption">Sarah Saunders</div>
              <div class="notifications__time caption">8h</div>
            </div>
            <div class="notifications__text caption-sm">
              Commented on <span class="notifications__project">Collab Design</span>
            </div>
          </div>
        </a>
        <a class="notifications__item" href="notifications.html">
          <div class="notifications__ava">
            <img class="notifications__pic" :src="(user.avatar || user.avatar === 0) ? '/storage/img/profileicon/' + user.avatar + '.png' : ''" alt=""/>
            <div class="notifications__status bg-green">
              <img class="notifications__pic" :src="(user.avatar || user.avatar === 0) ? '/storage/img/profileicon/' + user.avatar + '.png' : ''" alt=""/>
            </div>
          </div>
          <div class="notifications__details">
            <div class="notifications__line">
              <div class="notifications__user caption">Glenn Greer</div>
              <div class="notifications__time caption">12h</div>
            </div>
            <div class="notifications__text caption-sm">
              Just pushaded <span class="notifications__project">Sapiens Illustration</span>
            </div>
          </div>
        </a>
      </div>
      <div class="notifications__btns"><a class="notifications__btn btn btn_black" href="notifications.html">See all incoming activity</a></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationsTop',
  data: () => {
    return {
      ntOpen: false
    }
  },
  methods: {
    ntClose() {
      this.ntOpen = false
    }
  },
  computed: {
    theme() {
      return this.$store.state.main.theme
    },
    user() {
      return this.$store.state.auth.user
    },
  }
}
</script>

<style lang="scss" scoped>
  .notifications {
    position: relative;
    margin-left: 10px;
  }
  /* .notifications__open:hover {
    box-shadow: 0 0px 10px var(--shadow0);
  } */
  .notifications__open {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 0;
    transition: all .25s;
  }
  .notifications__open .icon {
    font-size: 20px;
    fill: var(--primary-text2);
    transition: fill .25s;
  }
  .notifications__open:hover .icon {
    fill: var(--primary-text1);
  }
  .icon-bell {
    width: 0.92em;
    height: 1em;
    fill: var(--primary-text);
  }
  .notifications.active .notifications__open .icon {
    fill: var(--primary-text1);
  }
  .notifications__counter {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    min-width: 16px;
    line-height: 16px;
    border-radius: 50%;
    background: var(--notifications1);
    font-size: 12px;
    font-weight: 600;
    color: var(--notifications-text1);
  }
  .notifications.active .notifications__wrap {
    visibility: visible;
    opacity: 1;
  }
  .notifications__wrap {
    position: absolute;
    top: calc(100% + 24px);
    right: -12px;
    width: 360px;
    padding: 32px 8px 36px;
    box-shadow: 0 10px 36px var(--shadow4);
    background: var(--primary-opacity1);
    border-radius: 24px;
    visibility: hidden;
    opacity: 0;
    transition: all .25s;
  }
  .notifications__info {
    margin-bottom: 32px;
    padding: 0 24px;
  }
  .h6 {
    font-size: 18px;
    line-height: 1.33333;
  }
  .notifications__list {
    margin-bottom: 32px;
  }
  .notifications__item {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 16px 28px 16px 20px;
    border-radius: 12px;
    background: transparent;
    cursor: pointer;
    -webkit-transition: background .25s;
    -o-transition: background .25s;
    transition: background .25s;
  }
  .notifications__ava {
    position: relative;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    margin-right: 24px;
    font-size: 0;
  }
  .notifications__ava > .notifications__pic {
    width: 100%;
    min-height: 100%;
    border-radius: 50%;
  }
  .notifications__status {
    position: absolute;
    top: 0;
    right: -1px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 21px;
    height: 21px;
    border: 2px solid #fff;
    border-radius: 50%;
    font-size: 0;
  }
  .notifications__details {
    flex-grow: 1;
  }
  .notifications__line {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 6px;
  }
  .notifications__status .notifications__pic {
    max-width: 10px;
  }
  .notifications__user {
    margin-right: auto;
    color: var(--primary-text);
    -webkit-transition: color .25s;
    -o-transition: color .25s;
    transition: color .25s;
  }
  .notifications__time {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    margin-left: 20px;
  }
  .notifications__time, .notifications__text {
    color: #B2B3BD;
    -webkit-transition: color .25s;
    -o-transition: color .25s;
    transition: color .25s;
    text-align: left;
  }
  .notifications__item:hover {
    background: var(--primary-main);
  }
  .notifications__item:hover .notifications__user, .notifications__item:hover .notifications__time, .notifications__item:hover .notifications__text, .notifications__item:hover .notifications__project {
    color: #ffffff;
  }
  .notifications__project {
    padding-left: 5px;
    color: var(--border-color1);
    -webkit-transition: all .25s;
    -o-transition: all .25s;
    transition: all .25s;
  }

  .notifications__open.disabled {
    cursor: auto;
  }
  .notifications__open.disabled:hover .icon {
    fill: var(--primary-text2);
  }
</style>