<script setup>
import { reactive } from "vue";
import { mdiAccount, mdiArrowLeftDropCircle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import "vue-color-kit/dist/vue-color-kit.css";
import "@vuepic/vue-datepicker/dist/main.css";
import RegisterController from "../controllers/RegisterConstroller";
import { useAlertStore } from "@/stores/alerts.js";

const alertStore = useAlertStore();
const countries = RegisterController.getCountries();

const form = reactive({
  rol: "admin",
  firstName: "",
  lastName: "",
  organizationName: "",
  phoneCode: countries[0],
  phone: "",
  email: "",
  code: "",
  promotional: "",
  setPass: false,
  pass: "",
  passVerify: "",
  organization: {
    name: "",
    description: "",
    logo: "",
    color: "#cccccc",
    personName: "",
    personLastname: "",
    personEmail: "",
  },
  sponsor: {
    name: "",
    logo: "",
    personName: "",
    personLastname: "",
    personEmail: "",
    status: 1,
  },
});

const sendCode = async () => {
  await RegisterController.sendCode(`${form.phoneCode.id}${form.phone}`).then(
    (data) => console.log(data)
  );
};

const submit = async () => {
  RegisterController.register(form).then((data) => {
    if (data) {
      alertStore.createAlert({
        title: "Administrator created with success",
        color: "success",
        icon: "$success",
        text: "",
      });
      // router.push("/");
    }
  });
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton
            :icon="mdiArrowLeftDropCircle"
            to="/rewards-messages"
            color="info"
            rounded-full
            small
          />
          <p class="font-extrabold">Create Message</p>
        </div>
      </div>

      <CardBox :class="my - 8" is-form @submit.prevent="submit">
        <FormField v-if="form.rol.id === 2" label="Sponsor Name">
          <FormControl
            v-model="form.sponsor.name"
            :icon="mdiAccount"
            name="name"
            autocomplete="username"
          />
        </FormField>
        <FormField label="First Name">
          <FormControl
            v-model="form.firstName"
            :icon="mdiAccount"
            name="firstName"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Last Name">
          <FormControl
            v-model="form.lastName"
            :icon="mdiAccount"
            name="lastName"
            autocomplete="current-password"
          />
        </FormField>

        <FormField v-if="form.rol.id != 3" label="Company Name">
          <FormControl
            v-model="form.organizationName"
            :icon="mdiCityVariant"
            name="companyName"
            autocomplete="current-password"
          />
        </FormField>

        <FormField label="Email">
          <FormControl
            v-model="form.email"
            :icon="mdiAt"
            name="email"
            autocomplete="current-password"
          />
        </FormField>

        <FormField label="Password">
          <FormControl
            v-model="form.pass"
            :icon="mdiStarCircle"
            name="promoCode"
            type="password"
          />
        </FormField>
        <FormField label="Verify Password">
          <FormControl
            v-model="form.passVerify"
            :icon="mdiStarCircle"
            name="promoCode"
            type="password"
          />
        </FormField>
        <FormField label="Phone">
          <div class="flex sm:flex-row flex-col gap-3">
            <FormControl
              v-model="form.phoneCode"
              :options="countries"
              :icon="mdiPlus"
              class="sm:w-1/3"
            />
            <FormControl
              v-model="form.phone"
              :icon="mdiCellphone"
              name="companyName"
              autocomplete="current-password"
              class="sm:w-2/3"
            />
          </div>
        </FormField>
        <FormField
          label="Registrarion Code"
          help="This code will be send to your phone"
        >
          <div class="flex sm:flex-row flex-col gap-3">
            <BaseButton
              outline
              color="info"
              label="Send Code"
              @click="sendCode"
              class="sm:w-1/3"
              :disabled="form.phone.length < 9"
            />
            <FormControl
              v-model="form.code"
              :icon="mdiCheckDecagram"
              name="regisCode"
              autocomplete="current-password"
              class="sm:w-2/3"
            />
          </div>
        </FormField>

        <FormField label="Pomotional Code">
          <FormControl
            v-model="form.promotional"
            :icon="mdiStarCircle"
            name="promoCode"
          />
        </FormField>

        <template #footer>
          <BaseButtons type="flex-col justify-center items-center">
            <BaseButton
              type="submit"
              color="info"
              class="sm:w-1/2 w-full"
              label="Create Account"
              :disabled="form.pass !== form.passVerify"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
