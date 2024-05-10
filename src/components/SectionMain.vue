<script setup>
import { containerMaxW } from "@/config.js";
import Alert from "@/components/Alert.vue";
</script>

<template>
  <section class="p-4" :class="containerMaxW">
    <Alert />

    <slot />
  </section>
</template>
