<template>
  <div
    class="gameswitcher dropdown js-dropdown"
    :class="ddOpen ? 'active' : ''"
    v-click-outside="ddClose"
  >
    <div
      @click="ddOpen = !ddOpen"
      class="dropdown__head js-dropdown-head"
      :class="theme === 'moon' ? 'moon' : ''"
    >
      {{
        !selected
        ? $t('header.choose-game')
        : selected
      }}
      <svg class="icon icon-arrow-down">
        <use xlink:href="/img/icons.svg#icon-arrow-down"></use>
      </svg>
    </div>
    <div
      v-if="ddOpen"
      class="dropdown__body js-dropdown-body"
      :class="theme === 'moon' ? 'moon' : ''"
    >
      <button
        class="dropdown__item"
        @click.prevent="$store.dispatch('accounts/setGame', 'lol'); selected = 'League of Legends'; ddOpen = false"
      >
        <!-- @click.prevent="selected = 'League of Legends'; ddOpen = false" -->
        <div style="min-width: 28px; text-align: left;">
          <svg v-if="selected === 'League of Legends'" class="icon icon-star">
            <use xlink:href="/img/icons.svg#icon-star"/>
          </svg>
        </div>
        <div class="dropdown__title title">League of Legends</div>
        <svg class="icon icon-arrow-right">
          <use xlink:href="/img/icons.svg#icon-arrow-right"/>
        </svg>
      </button>
      <a
        class="dropdown__item game-disabled"
        href="#"
      >
        <!-- @click.prevent="selected = 'Teamfight Tactics'; ddOpen = false" -->
        <div style="min-width: 28px; text-align: left;">
          <svg v-if="selected === 'Teamfight Tactics'" class="icon icon-star">
            <use xlink:href="/img/icons.svg#icon-star"/>
          </svg>
        </div>
        <div class="dropdown__title title title-disabled">Teamfight Tactics</div>
        <svg class="icon icon-arrow-right">
          <use xlink:href="/img/icons.svg#icon-arrow-right"/>
        </svg>
      </a>
      <a
        class="dropdown__item game-disabled"
        href="#"
      >
        <!-- @click.prevent="selected = 'Valorant'; ddOpen = false" -->
        <div style="min-width: 28px; text-align: left;">
          <svg v-if="selected === 'Valorant'" class="icon icon-star">
            <use xlink:href="/img/icons.svg#icon-star"/>
          </svg>
        </div>
        <div class="dropdown__title title title-disabled">Valorant</div>
        <svg class="icon icon-arrow-right">
          <use xlink:href="/img/icons.svg#icon-arrow-right"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameSwitcher',
  data: () => {
    return {
      ddOpen: false,
      selected: 'League of Legends'
    }
  },
  methods: {
    ddClose() {
      this.ddOpen = false
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
  .gameswitcher {
    max-width: 188px;
  }
  .dropdown__head .icon {
    fill: var(--primary-text);
    transition: .25s;
    margin-right: 7px;
  }
  .dropdown__item .icon.icon-star {
    fill: var(--primary-text);
  }
  .icon.icon-arrow-right {
    fill: var(--primary-text);
    transition: fill .25s;
    margin-left: auto;
    height: 10px;
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


  /* DISABLED GAMES */
  .title-disabled:hover {
    color: var(--disabled-link-text) !important;
    cursor: no-drop;
  }
  .game-disabled {
    & .icon {
      fill: var(--disabled-link-text) !important;
      cursor: no-drop;
    }
  }
  .game-disabled.dropdown__item:hover .icon.icon-arrow-right {
    fill: var(--disabled-link-text);
    transform: translateX(0px);
    cursor: no-drop;
  }
  .game-disabled.dropdown__item:hover .dropdown__title, .dropdown__item:hover .dropdown__info {
    color: var(--disabled-link-text);
    cursor: no-drop;
  }
  .game-disabled.dropdown__item .dropdown__title {
    color: var(--disabled-link-text);
    cursor: no-drop;
  }
</style>