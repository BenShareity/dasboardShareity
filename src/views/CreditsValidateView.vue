<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useSessionStore } from "@/stores/session.js";
import UserController from "@/controllers/UserController";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const profile = ref({});
const route = useRoute();

onMounted(async () => {
  profile.value = await UserController.getMyProfile();
  let userId = profile.value.id;
  let amount = route.params.amount;
  let token = route.params.token;

  UserController.addCredits(userId, token, amount).then((data) => {
    setTimeout(() => {
      router.replace("/credits");
    }, 5000);
  });
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div
        class="text-center flex flex-col align-center justify-center h-[80vh]"
      >
        <LoadingSpinner></LoadingSpinner>

        <h1 class="text-xl mt-6">We are processing your purchase</h1>
        <p class="text-gray-500">
          In a few minutes the credits will be added to your account
        </p>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
