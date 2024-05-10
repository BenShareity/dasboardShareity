<script setup>
import { useAlertStore } from "@/stores/alerts.js";

const alertStore = useAlertStore();
</script>
<style>
.alert {
  position: fixed !important;
  width: 43%;
  z-index: 1000;
  top: 3%;
  right: 3%;
  transition: ease-in 0.5s all;
  animation: andres 1s;
}

@keyframes andres {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
<template>
  <v-alert
    class="alert"
    v-if="alertStore.status"
    :color="alertStore.color"
    :icon="alertStore.icon"
    :title="alertStore.title"
    :text="alertStore.text"
  ></v-alert>
</template>
