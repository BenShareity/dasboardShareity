<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk, mdiAt } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import LoginController from "@/controllers/LoginController";
import { ref } from "vue";

const form = reactive({
  user: "",
  pass: "",
  remember: true,
});

const isLoading = ref(false);
const errorMessage = ref("");
const router = useRouter();
const submit = async () => {
  isLoading.value = true;
  await LoginController.login(form.user, form.pass)
    .then((response) => {
      if (response) router.push("/dashboard");
    })
    .catch((error) => {
      console.error("Error de la consola", error.response.data.message);
      errorMessage.value = error.response.data.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="blueWhite">
      <CardBox :class="`${cardClass} my-8`" is-form @submit.prevent="submit">
        <div>
          <img src="/assets/shareity-logo.png" alt="Shareity Logo" />
        </div>

        <FormField label="Email">
          <FormControl
            v-model="form.user"
            :icon="mdiAt"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <div class="text-center" v-if="errorMessage">
          <span class="mt-2 text-l text-red-600 dark:text-red-400">{{
            errorMessage
          }}</span>
        </div>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />

        <template #footer>
          <BaseButtons type="flex-col justify-center items-center">
            <BaseButton
              type="submit"
              color="info"
              class="sm:w-1/2 w-full"
              label="Login with Shareity"
              :isLoading="isLoading"
            >
            </BaseButton>

            <BaseButton
              to="/register"
              color="info"
              outline
              class="sm:w-1/2 w-full"
              label="Create Account"
            />
          </BaseButtons>
          <div>
            <a href=""></a>
          </div>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
