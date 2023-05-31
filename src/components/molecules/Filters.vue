<template>
  <div class="page__nav mobile-hide">
    <div
      class="dropdown js-dropdown"
      :class="typeOpen ? 'active' : ''"
      v-click-outside="TOClose"
    >
      <div
        class="dropdown__head js-dropdown-head filter-tag"
        @click="typeOpen = !typeOpen"
        :class="{
          moon: theme === 'moon',
          'filter-active': typeSelected !== null && typeSelected !== 'all'
        }"
      >
        {{ typeSelected ? $t('filters.' + typeSelected) : $t('filters.types-placeholder') }}
      </div>
      <div
        class="dropdown__body js-dropdown-body"
        v-if="typeOpen"
      >
        <button
          class="dropdown__item"
          v-for="ftyp in ftypes" :key="ftyp"
          @click="$emit('change-x'); $store.dispatch('filters/setType', ftyp); typeOpen = false;"
        >
          <div
            class="dropdown__title title"
            :style="{
              color: typeSelected === ftyp ? 'var(--primary-main)' : ''
            }"
          >
            {{ $t('filters.' + ftyp) }}
          </div>
        </button>
      </div>
    </div>
    <button
      class="page__link filter-tag"
      :class="{ active: status === 'end' }"
      @click="$emit('change-x'); $store.dispatch('filters/toggleStatus')"
    >
      {{ $t('filters.passed-label') }}
    </button>
    <Loader v-if="loading" style="height: 56px; margin-left: auto; margin-right: 0;" />
    <!-- <date-picker
      style="margin-left: auto; margin-right: 0;"
      range
      class="filter-tag"
      :value="initialDate"
      @change="datePickerChange"
      :default-value="new Date()"
    /> -->
  </div>
</template>

<script>
// import DatePicker from 'vue2-datepicker'
// import 'vue2-datepicker/index.css'
import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'Filters',
  components: {
    Loader
  },
  props: [
    'loading'
  ],
  // components: { DatePicker },
  data: () => {
    return {
      typeOpen: false
    }
  },
  computed: {
    theme() {
      return this.$store.state.main.theme
    },

    // filters from store
    typeSelected() {
      return this.$store.state.filters.typeSelected
    },
    ftypes() {
      return this.$store.state.filters.ftypes
    },
    status() {
      return this.$store.state.filters.status
    },
    initialDate() {
      if (!this.$store.state.filters.start || !this.$store.state.filters.end) {
        return null
      } else {
        return [new Date(this.$store.state.filters.start), new Date(this.$store.state.filters.end)]
      }
    }
  },
  methods: {
    TOClose() {
      this.typeOpen = false
    },
    datePickerChange(newVal) {
      this.$store.dispatch('filters/setDates', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.page__nav {
  display: flex;
  margin-top: 18px;
  margin-bottom: 38px;
}
.page__nav .page__link {
  transition: all .25s;
  user-select: none;
}
.page__nav .page__link.active {
  background: var(--primary-main);
  color: var(--notifications-text1);
}
.dropdown {
  width: auto;
  flex: 1;
  max-width: 180px;
  margin: 0;
}
.dropdown__head.filter-active {
  background-color: var(--primary-main);
  color: #fff;
}
.dropdown__head.filter-active:before {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8'%3E%3Cpath fill='%23ffffff' d='M.293.293A1 1 0 0 1 1.613.21l.094.083L7 5.585 12.293.293a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-6 6a1 1 0 0 1-1.32.083l-.094-.083-6-6a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E");
}
.dropdown__body {
  padding-top: 76px;
}

.filter-tag {
  min-width: 96px;
  padding: 0 25px;
  border-radius: 16px;
  background: rgba(108, 93, 211, 0.1);
  text-align: center;
  line-height: 56px;
  height: 56px;
  font-size: 13px;
  font-weight: 700;
  color: var(--third-color);
  transition: opacity .25s;
  margin-right: 5px;
  &:hover {
    opacity: .8;  
  }
}
</style>


// datapicker related
// <style lang="scss">
// .filter-tag input.mx-input {
//   height: 56px;
//   background: transparent;
//   margin: 0;
//   border: 0;
//   box-shadow: none;
//   font-size: 13px;
//   font-weight: 700;
//   color: #5F75EE;
// }
// </style>