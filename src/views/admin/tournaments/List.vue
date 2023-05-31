<template>
  <div class="admin-wrapper">
    <div class="screen-full card" style="padding: 10px;">
      <div style="display: flex; justify-content: space-between;">
        <h2 style="text-align: left;margin: 0 auto; ">Админка турниров</h2>
        <router-link to="/admin/tournaments/new" class="admin__btn" @click.native="$store.dispatch('adminTournaments/new')">
          Новый турнир
        </router-link>
      </div>
      <div class="t-list" :class="theme === 'moon' ? 'moon' : ''">
        <!-- <Filters
          ref="filters"
          :loading="false"         
        /> -->
        <div v-if="!inLoading" style="width: 100%; margin-top: 30px;">
          <TRow
            @edit="editTournament"
            @delete="deleteTournament"
            v-for="tournament in tournamentsList" :key="tournament.id"
            :tournament="tournament"
          />
        </div>
        <div v-else style="height: 300px; line-height: 300px;">
          Загрузка...
        </div>
      </div>
      <div class="pagination-panel">
        <button
          v-for="page in pages_to_render"
          :key="page"
          @click="$store.dispatch('adminTournaments/getList', page)"
          :class="{
            page: true
          }"
        >
          {{ page }}
        </button>
      </div>
    </div>
    <!-- {{tournamentsList}} -->
  </div>
</template>

<script>
// import Filters from "@/components/molecules/Filters.vue";
import TRow from "./TRow.vue";
// import Loader from '@/components/atoms/Loader.vue'

export default {
  name: "AdminTournamentsList",
  components: {
    // Loader,
    TRow,
    // Filters,
  },
  data: () => {
    return {
      game: "lol",
      registerPlease: false,
      machineScrollPossble: false,
    };
  },
  methods: {
    editTournament(tid) {
      //
      this.$store.dispatch('adminTournaments/editTournamentPrefetch', tid)
      console.log(tid)
    },
    deleteTournament(tid) {
      this.$store.dispatch('adminTournaments/deleteTournament', tid)
    }
  },
  computed: {
    theme() {
      return this.$store.state.main.theme;
    },
    tournamentsList() {
      return this.$store.state.adminTournaments.tList;
    },
    current_page() {
      return 1 //this.$store.state.tournaments.tournamentsPagination.current_page;
    },
    last_page() {
      return this.$store.state.tournaments.tournamentsPagination.last_page;
    },
    pages_to_render() {
      return this.$store.getters["adminTournaments/pages_to_render"];
    },
    // tournaments_in_loading() {
    //   return this.$store.state.tournaments.in_loading.tournaments;
    // },
    user() {
      return this.$store.state.auth.user;
    },
    inLoading() {
      return this.$store.state.adminTournaments.inLoading
    }
  },
  async mounted() {
    // await this.$store.commit("filters/getFromLocalStorage");
    // await this.$store.dispatch("adminTournaments/getList");
    // console.log('asdsaddsa', this.tournamentsList)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit("filters/getFromLocalStorage");
      vm.$store.dispatch("adminTournaments/getList");
    })
  }
};
</script>

<style lang="scss" scoped>
.tournaments {
  width: 100%;
  position: relative;
}
.screen-full {
  padding: 0 20px;
  position: relative;
  width: 100%;
  min-width: 1044px;
  max-width: 1044px;
}
.page {
  border: 0;
  margin: 3px;
  cursor: pointer;
  padding: 6px;
  font-weight: 900;
}
.loader {
  position: absolute;
  top: calc(50% - 28px);
  left: calc((50% + 130px) - 28px);
}


.admin-wrapper {
  max-width: 1044px;
  margin: 10px auto;
}
.admin__btn {
  background-color: var(--primary-main);
  color: #fff;
  border-radius: 5px;
  display: block;
  padding: 5px 15px;
  width: fit-content;
}
</style>