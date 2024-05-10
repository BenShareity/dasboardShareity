<script setup>
import { ref } from "vue";
import { gradientBgBlueWhite } from "@/colors";
import { useStyleStore } from "@/stores/style.js";
import NavBar from "@/components/NavBar.vue";

const styleStore = useStyleStore();
const full = ref(false);

function fullScreen() {
  !document.fullscreenElement
    ? document.documentElement.requestFullscreen()
    : document.exitFullscreen();
  full.value = !full.value;
}

setInterval(() => {
  if (!document.fullscreenElement) full.value = false;
}, 1000);
</script>

<template>
  <div
    :class="[
      'min-h-screen items-center justify-center',
      gradientBgBlueWhite,
      !full ? 'pt-28 md:pt-14' : '',
    ]"
  >
    <NavBar :class="[!!full ? '-translate-y-32 md:-translate-y-16' : '', 'transition-all']">
      <div class="flex flex-col md:flex-row w-full items-center justify-between">
        <RouterLink to="dashboard">
          <img src="../../assets/shareity-letras.png" alt="Letras" class="h-11"
        /></RouterLink>
        <div>
          <ul class="flex flex-row gap-5 text-sm md:text-base text-center">
            <li
              class="font-bold hover:text-white hover:bg-sky-400 rounded-lg px-3 py-2"
            >
              <button type="button" @click="fullScreen">GO FULL SCREEN</button>
            </li>
            <li
              class="font-bold hover:text-white hover:bg-sky-400 rounded-lg px-3 py-2"
            >
              <RouterLink to="campaigns">CAMPAIGNS</RouterLink>
            </li>
           
          </ul>
        </div>
      </div>
    </NavBar>
    <slot />
  </div>
</template>
