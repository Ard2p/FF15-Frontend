<template>
  <div v-if="can('admin@view')">
    <AdminSidebar />
    <div class="page-wrapper pleft">
      <AdminHeader />
      <main class="main-wrapper">
        <slot />
      </main>
    </div>
  </div>
  <div v-else>
    Страница не найдена
  </div>
</template>

<script>
import AdminHeader from "@/components/organisms/AdminHeader.vue";
import AdminSidebar from "@/components/organisms/AdminSidebar.vue";

export default {
  components: { AdminHeader, AdminSidebar },
};
</script>