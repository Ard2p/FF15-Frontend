<template>
  <div class="modal">
    <div class="card">
      <div class="card__wrapper">
        <div class="card__top">
          <h3>
            {{title}}
          </h3>

          <base-button-close
            @click="$emit('close')"
          />
        </div>

        <div class="card__content">
          <slot />
        </div>

        <div class="card__action">
          <slot name="action" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButtonClose from "./BaseButtonClose";

export default {
  name: "BaseModal",

  components: {
    BaseButtonClose,
  },

  props: {
    title: {
      type: String,
      default: '',
    }
  },

  methods: {
    test() {
      console.log('test')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: rgb(64, 64, 64, 0.4);
}

.card {
  position: fixed;
  width: 30%;
  min-height: 100px;
  background-color: var(--primary-opacity1);
  border-radius: 10px;

  &__wrapper {
     padding: 3%;
     text-align: left;
   }

  &__top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__content {
    margin-top: 5%;
  }

  &__action {
    margin-top: 5%;
  }
}
</style>