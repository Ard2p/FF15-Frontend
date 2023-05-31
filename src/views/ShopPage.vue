<template>
  <base-loader v-if="isLoading" />
  <section v-else class="products screen">
    <div class="products__wrapper">
      <h2 class="visually-hidden">Магазин</h2>

      <div class="balance">
        <div class="balance__wrapper">
          <h3 class="balance__text">Баланс: 3000 руб.</h3>
          <base-button>
            Пополнить баланс
          </base-button>
        </div>
      </div>

      <ul class="products__list">
        <product
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </ul>
    </div>
  </section>
</template>

<script>
import BaseLoader from "../components/common/BaseLoader";
import Product from "../components/ShopPage/Product";

import { products } from "../static/products";
import BaseButton from "../components/common/BaseButton";

export default {
  name: "ShopPage",

  components: {
    BaseButton,
    BaseLoader,
    Product,
  },

  data() {
    return {
      isLoading: true,
      products,
    }
  },

  created() {
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
  .balance {
    &__wrapper {
      display: grid;
      grid-template-columns: 2fr 1fr;
      align-items: center;
      padding: 20px 0;
    }

    &__text {
      font-size: 24px;
      text-align: left;
    }
  }

  .products {
    &__wrapper {
      padding: 20px 10px;
    }

    &__list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      row-gap: 10%;
      column-gap: 5%;
      padding-top: 10px;
    }
  }
</style>