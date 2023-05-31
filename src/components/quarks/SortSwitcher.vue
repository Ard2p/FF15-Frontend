<template>
  <td
    style="line-height: 16px; white-space: nowrap;"

    :style="{
      cursor: sortable ? 'pointer' : '',
      color: (dir === true || dir === false) ? 'var(--secondary-main)' : ''
    }"
    @click="sortable ? $emit('sort-click') : null"
  >
    {{ label }}
    <span v-if="sortable" style="display: inline-flex;">
      <svg v-if="dir === null" class="icon icon-arrow-down">
        <use xlink:href="/img/icons.svg#sort-arrows-none"/>
      </svg>
      <svg v-else-if="dir === true" class="icon icon-arrow-down">
        <use xlink:href="/img/icons.svg#sort-arrows-up"/>
      </svg>
      <svg v-else-if="dir === false" class="icon icon-arrow-down">
        <use xlink:href="/img/icons.svg#sort-arrows-down"/>
      </svg>
    </span>
  </td>
</template>

<script>
export default {
  props: {
    dir: {
      type: Boolean,
      default: null
    },
    column: {
      type: String,
      default: "user"
    },
    label: {
      type: String,
      default: ''
    },
    sortable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>

</style>