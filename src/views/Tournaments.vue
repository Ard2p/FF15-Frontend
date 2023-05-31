<template>
  <div class="tournaments">
    <Banners />
    <div class="screen">
      <div class="t-list" :class="theme === 'moon' ? 'moon' : ''">
        <Filters
          ref="filters"
          :loading="tournaments_in_loading"
          @change-x="machineScrollPossble = true"
        />
        <div class="t-list__inner">
          <Card
            @enter-tournament="enterTournament"
            @join-guest="joinGuest"
            :btnIdx="idx"
            v-for="(tournament, idx) in tournamentsList"
            :key="tournament.id"
            :tournament="tournament"
            :authed="user && user.hasOwnProperty('id')"
            :is_in="
              user &&
              user.id &&
              user.tournaments_request &&
              user.tournaments_request.findIndex(
                (t) => t.tournament_id === tournament.id
              )
            "
            :in_rtc="
              user &&
              user.id &&
              user.tournaments_request &&
              user.tournaments_request.findIndex((t) => t.type === 'rtc')
            "
          />
        </div>
      </div>
      <div class="pagination-panel" v-if="pages_to_render.length > 1">
        <button
          v-for="page in pages_to_render"
          :key="page"
          @click="$store.dispatch('tournaments/getSomeTournaments', page)"
          class="page"
          :style="{
            color: page === current_page ? 'var(--primary-main)' : '',
            border:
              page === current_page ? '1px solid var(--primary-main)' : '',
          }"
        >
          {{ page }}
        </button>
      </div>
      <div class="pagination-panel" v-else />
    </div>
  </div>
</template>


<script>
import Card from "@/components/organisms/TournamentsCard.vue";
import Banners from "@/components/organisms/TournamentsBanners.vue";

import Filters from "@/components/molecules/Filters.vue";

// import Loader from '@/components/atoms/Loader.vue'

export default {
  name: "Tournaments",
  components: {
    Card,
    // Loader,
    Filters,
    Banners,
  },
  metaInfo() {
    return {
			title: 'Турниры LoL - Лига легенд | FF15',
    };
  },

  data: () => {
    return {
      game: "",
      registerPlease: false,
      machineScrollPossble: false,
    };
  },
  methods: {
    async enterTournament({ tid, game, idx }) {
      this.game = game;
      this.$store.dispatch("tournament/enterTournament", { tid, idx });
    },
    joinGuest() {
      //joinGuest({ tid })
      this.registerPlease = true;
    },
    filtersChange() {
      if (this.machineScrollPossble) {
        this.$nextTick(() => {
          if (window.scrollY < 510) {
            window.scroll({ top: 600, behavior: "smooth" });
          }
          this.machineScrollPossble = false;
        });
      }
    },
  },
  computed: {
    theme() {
      return this.$store.state.main.theme;
    },
    tournamentsList() {
      return this.$store.state.tournaments.tournaments;
    },
    current_page() {
      return this.$store.state.tournaments.tournamentsPagination.current_page;
    },
    last_page() {
      return this.$store.state.tournaments.tournamentsPagination.last_page;
    },
    pages_to_render() {
      return this.$store.getters["tournaments/pages_to_render"];
    },
    tournaments_in_loading() {
      return this.$store.state.tournaments.in_loading.tournaments;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  beforeRouteEnter(from, to, next) {
    next((vm) => {
      vm.$store.commit("filters/getFromLocalStorage");
      vm.$store.dispatch("tournaments/getSomeTournaments");
      vm.$store.dispatch("banners/getBanners");
    });
  },
  watch: {
    tournamentsList() {
      this.filtersChange();
    },
  },
};
</script>

<style lang="scss" scoped>
.tournaments {
  width: 100%;
  position: relative;
}
.screen {
  padding: 20px 10px;
  position: relative;
}
.page {
  border: 0;
  margin: 3px;
  cursor: pointer;
  padding: 8px;
  font-weight: 900;
  font-size: 16px;
  border-radius: 8px;
  color: var(--primary-text);
  &:hover {
    color: var(--primary-main);
  }
}
.pagination-panel {
  margin-top: 20px;
}

/* .pickAuthMenu {
  position: absolute;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 14px;
  color: black;
  width: 154px;
  padding: 10px;
  p {
    margin: 0;
    margin-bottom: 8px;
    text-align: left;
  }
  a {
    font-size: 16px;
    text-decoration: none;
    color: seagreen;
    font-weight: bold;
    &:hover {
      color: springgreen;
    }
  }
} */
/* .attentionDirector {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #111d;
  clip-path: polygon(0% 0%, 100% 0%, 100% 15px, 78% 15px, 78% 40px, 89% 40px, 89% 15px, 100% 15px, 100% 100%, 0% 100%);
  .point {
    //
    color: red;
    font-size: 20px;
    position: absolute;
    top: 45px;
    left: 74%;
  }
  .close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 100%;
    color: red;
    border: 1px solid red;
    font-size: 20px;
    line-height: 24px;
    width: 24px; height: 24px;
    cursor: pointer;
  }
} */

.t-list {
  max-width: 1000px;
  margin: 0 40px;
}
</style>