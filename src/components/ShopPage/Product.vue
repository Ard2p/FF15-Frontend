<template>
  <li class="products__item">
    <base-modal
      v-show="isShowModal"
      :title="product.name"
      @close="isShowModal = false"
    >
      <div class="product__info-card">
        <div>
          <p>Информация о товаре</p>
        </div>

        <div>
          <a>
            <img :src="product.img" width="250" height="200">
          </a>
        </div>
      </div>

      <template #action>
        <div class="product__action">
          <base-button>
            Купить
          </base-button>

          <div></div>

          <div>
            <h3>
              {{product.price}} руб.
            </h3>
          </div>
        </div>
      </template>
    </base-modal>

    <div
      class="product"
      @click="isShowModal = true"
    >
      <div class="product__wrapper">
        <div class="product__card">
          <a>
            <img :src="product.img" width="250" height="200">
          </a>

          <div class="product__information">
            <h3 class="product__title">
              {{ product.name }}
            </h3>
            <span class="product__price">
            {{ product.price }} руб.
          </span>
          </div>
        </div>
      </div>
    </div>
  </li>

</template>

<script>
import BaseModal from "../common/BaseModal";
import BaseButton from "../common/BaseButton";

export default {
  name: "Product",
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    product: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      isShowModal: false,
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  background-color: var(--primary-opacity1);
  border-radius: 10px;
  box-shadow: 0px 0px 15px 5px #424242;
  cursor: pointer;

  &:hover,
  &:focus {
    box-shadow: 0px 0px 15px 5px #BDBDBD;
  }

  &__wrapper {
    padding: 7%;
  }

  &__information {
    padding-top: 5%;
    text-align: left;
  }

  &__info-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &__action {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
  }
}


</style>