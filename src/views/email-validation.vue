<script setup>
import { onMounted, ref, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

import {
  mdiAccount,
  mdiAt,
  mdiCellphone,
  mdiCheckDecagram,
  mdiCity,
  mdiCityVariant,
  mdiPlus,
  mdiStarCircle,
} from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import { regexEmail } from "@/utility/regex";
import UtilityMethods from "@/utility/utilityMethods";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import RegisterController from "../controllers/RegisterConstroller";
import SendEmailController from "../controllers/EmailValidationController";
import { useAlertStore } from "@/stores/alerts";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const alertStore = useAlertStore();
const router = useRouter();
const messageError = ref();
const refEmail = ref();
const showVerify = ref(false);
const route = useRoute();
const errorEmail = ref(null);
const isSubmitDisabled = ref(false);
const token = ref(null);

const form = reactive({
  email: "",
});

const verifyToken = async () => {
  try {
    let res = await RegisterController.authProfile();
    if (res) {
      showVerify.value = true;
    }
  } catch (error) {
    if (error.response.data.statusCode == 401) {
      showVerify.value = false;
    }
  }
};

watch(
  () => form.email,
  () => {
    if (!form.email) {
      errorEmail.value = "Required field";
    } else if (!regexEmail.test(form.email.trim())) {
      errorEmail.value = "Invalid email";
    } else {
      errorEmail.value = null;
    }
  }
);

watch(() => {
  isSubmitDisabled.value = !regexEmail.test(form.email.trim());
});

onMounted(() => {
  if (route.query?.token) {
    token.value = route.query?.token;
    cookies.set("accessToken", route.query?.token);
    if (token.value) {
      router.replace({ query: "" });
      verifyToken();
    }
  }
});

const submit = async () => {
  if (!form.email) {
    errorEmail.value = "Required field";
  } else if (!regexEmail.test(form.email.trim())) {
    errorEmail.value = "Invalid email";
  }

  console.log("entro");
  SendEmailController.sendEmail(form)
    .then(async (res) => {
      console.log("register :>> ", res);
      if (res) {
        try {
          let resVerifify = await SendEmailController.sendEmail(form);

          if (resVerifify) {
            alertStore.createAlert({
              title: "User successfully registered! ",
              icon: "$success",
              text: "the user has been created successfully!",
            });
          }
        } catch (error) {
          console.log("error :>> ", error);
          alertStore.createAlert({
            title: "an error has occurred try later! ",
            icon: "$error",
            text: "the user has been created successfully!",
          });
        }
      }

      router.push("/MessageRegister");
    })
    .catch((error) => {
      console.log("exploto", inValid.value);
      if (error.error) {
        inValid.value = true;
        console.log("akgo");
        messageError.value = "An error occurred while registering the user";
      }
      alertStore.createAlert({
        title: `An error occurred while registering the user ${error.error}`,
        icon: "$danger",
        text: error.message,
        color: "red-accent-4",
      });
    });
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="blueWhite">
      <CardBox
        v-if="!form.setPass"
        :class="`${cardClass} my-8`"
        is-form
        @submit.prevent="submit"
      >
        <div class="flex flex-col items-center">
          <img
            class="w-2/3"
            src="/assets/shareity-logo.png"
            alt="Shareity Logo"
          />

          <CardBoxWidget
            v-if="showVerify"
            :icon="mdiCartOutline"
            label="Verified  Account"
            content="We have successfully validated your email, please login"
            class="text-center"
          />

          <CardBoxWidget
            v-else
            :icon="mdiCartOutline"
            label="Verification error"
            content="We could not validate your email, enter your email again"
            class="text-center mb-25"
          />
        </div>

        <FormField label="Email" class="form_style" v-if="!showVerify"  >
          <input
          
            v-model="form.email"
            :icon="mdiAt"
            name="email"
            autocomplete="current-password"
            class="border rounded-md h-[48px] w-full"
            ref="refEmail"
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorEmail"
          >
            {{ errorEmail }}
          </p>
        </FormField>
        <template #footer>
          <BaseButtons type="flex-col justify-center items-center">
            <BaseButton
              v-if="showVerify"
              to="/"
              color="info"
              class="sm:w-1/2 w-full"
              label="Login"
            />
            <BaseButton
              v-else
              type="submit"
              color="info"
              class="sm:w-1/2 w-full"
              label="Send Email Again"
              :disabled="isSubmitDisabled"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<style>
.form_style .iti {
  width: 100%;
}
</style>
