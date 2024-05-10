<script setup>
import { useMainStore } from "@/stores/main";
import UserAvatar from "@/components/UserAvatar.vue";
import { ref, computed } from "vue";
import UserController from "@/controllers/UserController";
import { onBeforeMount } from "vue";

const host = import.meta.env.VITE_IMAGE_HOST;
const profile = ref();
const mainStore = useMainStore();
let userAvatar = ref("");
const validateAvatar = computed(() => {
  if (userAvatar.value && userAvatar.value.match(/.*\..{2,5}/)) {
    return host + userAvatar.value;
  } else {
    return host + "default/user_default.png";
  }
});
onBeforeMount(async () => {
  profile.value = await UserController.getMyProfile();
  console.log(profile.value);
});
</script>

<template>
  <UserAvatar :username="mainStore.userName" :avatar="validateAvatar">
    <slot />
  </UserAvatar>
</template>
