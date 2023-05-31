<template>
  <div>
    <Sidebar />
    <div class="page-wrapper pleft test">
      <Header />
      <main class="main-wrapper">
        <router-view />
      </main>
      <!-- <div style="margin: 16px 0; color: #808191; font-size: 10px">
        Разработка: Ard2p, Origami1024, Carnage2184. 2021
      </div> -->
    </div>
  </div>
</template>

<script>
import Header from "@/components/organisms/Header.vue";
import Sidebar from "@/components/organisms/Sidebar.vue";

export default {
  components: {
    Header,
    Sidebar,
  },
};
</script>