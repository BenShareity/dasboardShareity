<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import BaseLevel from "@/components/BaseLevel.vue";
import UserAvatarCurrentUser from "@/components/UserAvatarCurrentUser.vue";
import CardBox from "@/components/CardBox.vue";
const mainStore = useMainStore();

const userName = computed(() => mainStore.userName);

const userSwitchVal = ref(false);
</script>

<template>
  <CardBox>
    <BaseLevel type="justify-around lg:justify-center">
      <UserAvatarCurrentUser class="lg:mx-12" />
      <div class="space-y-3 text-center md:text-left lg:mx-12">
        <div class="flex justify-center md:block"></div>
        <h1 class="text-2xl">Howdy, <b>Edit your profile settings!</b></h1>
        <div class="flex justify-center md:block">
          <!-- <PillTag label="Verified" color="info" :icon="mdiCheckDecagram" /> -->
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
