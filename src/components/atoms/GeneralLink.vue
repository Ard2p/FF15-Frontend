<template>
  <router-link
    :to="to"
    :class="{
      'router-link-exact-active': extraTo && $route.name === extraTo,
      [linkClass]: linkClass,
      'navbar__item': !linkClass
    }"
  >
    <div class="sidebar__icon">
      <svg :class="`icon ${icon}`">
        <use :xlink:href="`/img/icons.svg#${icon}`"/>
      </svg>
    </div>
    <span>{{title}}</span>
  </router-link>
</template>

<script>
export default {
  props: [
    'to',
    'extraTo',
    'icon',
    'title',
    'linkClass'
  ]
}
</script>