<template functional>
  <div class="navbar__ad">
    <div class="sidebar__banner">
      <div class="sidebar__bg"/>
      <div class="sidebar__details">
        <div class="sidebar__title">Вступай в Discord</div>
        <div class="sidebar__info caption-sm">
          Стань частью нашего сообщества.
        </div>
        <a href="https://discord.gg/yXCRYK8vYe" class="discolink" target="_blank">Вступить</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discolink {
  display: block;
  min-width: 166px;
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  border-radius: 16px/16px;
  font-family: Inter,sans-serif;
  font-size: 14px;
  font-weight: 700;
  transition: all .25s;
  background: #6c5dd3;
  color: #fff;
  text-align: center;
  &:hover {
    background: #5a49ce;
  }
}
</style>