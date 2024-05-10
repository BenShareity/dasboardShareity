<script setup>
import { reactive, ref, watch, watchEffect } from "vue";

import {
  mdiAccount,
  mdiAccountBox,
  mdiArrowLeftDropCircle,
  mdiAt,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import "vue-color-kit/dist/vue-color-kit.css";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRoute, useRouter } from "vue-router";
import SponsorController from "@/controllers/SponsorController";
import { regexEmail } from "@/utility/regex";
import UtilityMethods from "@/utility/utilityMethods";
import { useAlertStore } from "@/stores/alerts";
import UserController from "@/controllers/UserController";
import RegisterController from "@/controllers/RegisterConstroller";

const host = import.meta.env.VITE_IMAGE_HOST;
const router = useRoute();
const route = useRouter();
const allCamp = ref(false);
const logo = ref();
const alertStore = useAlertStore();
const loading = ref(false);

const errorName = ref(null)
const errorEmailMessage = ref(null);
const errorPersonName = ref(null);
const errorLastName = ref(null);

const correctName = ref(false);
const correctEmail = ref(false);
const correctPersonName = ref(false);
const correctLastName = ref(false);

const form = reactive({
  name: "",
  personEmail: "",
  personName: "",
  personLastname: "",
  logo: "",
  status: false,
});
const activeButton = ref(false);
const profile = ref({});
const title = router.query.id ? "Edit" : "Add";

const handleLogo = (newValue) => {
  logo.value = newValue;
};

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();
  console.log(profile.value);
  await SponsorController.getById(router.query.id).then((data) => {
    allCamp.value = true;
    form.name = data.name;
    form.personEmail = data.personEmail;
    form.personName = data.personName;
    form.personLastname = data.personLastname;
    logo.value = host + data.logo;
  });
}, [router.query.id]);
watch(() => {
  if (profile.value.rol === "cause") {
    activeButton.value =
      !form.name ||
      !form.personEmail ||
      !form.personLastname ||
      !form.personName;
    return;
  } else {
    activeButton.value =
      !form.name ||
      !form.personEmail ||
      !form.personLastname ||
      !form.personName;
  }
});


watch(
  () => form.name,
  () => {
    if (!form.name) {
      errorName.value = "Required field";
      correctName.value = false
    } else {
      errorName.value = null;
      correctName.value = true
    }
  }
);


watch(
  () => form.personEmail,
  async () => {
    if (!form.personEmail) {
      errorEmailMessage.value = "Required field";
      correctEmail.value = false;
    } else if (!regexEmail.test(form.personEmail.trim())) {
      errorEmailMessage.value = "Invalid email";
      correctEmail.value = false;
    } else {
      let forms = {
        email: form.personEmail,
      };
      try {
        let res = await RegisterController.verifyEmail(forms);
        errorEmailMessage.value = null;
        correctEmail.value = true;
        console.log("res :>> ", res);
      } catch (error) {
        console.log(error);
        errorEmailMessage.value = error.message;
        correctEmail.value = false;
      }
    }
  }
);
watch(
  () => form.personName,
  () => {
    if (!form.personName) {
      errorPersonName.value = "Required field";
      correctPersonName.value = false
    } else {
      errorPersonName.value = null;
      correctPersonName.value = true
    }
  }
);

watch(
  () => form.personLastname,
  () => {
    if (!form.personLastname) {
      errorLastName.value = "Required field";
        correctLastName.value = false
    } else {
      errorLastName.value = null;
      correctLastName.value = true
    }
  }
);


const submit = async () => {
  let logoMedia = "";
  if (logo.value) {
    logoMedia = await UtilityMethods.verifyMedia(logo.value, "sponsors");
  }
  if (router.query.id) {
    form.logo = logoMedia;
    let inp = JSON.parse(JSON.stringify(form));
    SponsorController.update(router.query.id, inp)
      .then(() => {
        loading.value = true;
        try {
          alertStore.createAlert({
            title: "Sponsor has been updated!",
            icon: "$success",
            text: "the sponsor has been updated successfully!",
          });
        } catch (error) {
          alertStore.createAlert({
            title: "Error!",
            icon: "$warning",
            text: "Error updating sponsor!",
            color: "red-accent-4",
          });
        }
      })
      .finally(() => {
        loading.value = false;
        route.push("/sponsors");
      });
  } else {
    form.logo = logoMedia;
    let inp = JSON.parse(JSON.stringify(form));
    SponsorController.create(inp)
      .then(() => {
        loading.value = true;
        if (profile.value.rol === "admin") {
          try {
            alertStore.createAlert({
              title: "Sponsor have been succesfully registered!",
              icon: "$success",
            });
          } catch (error) {
            alertStore.createAlert({
              title: "Error!",
              icon: "$warning",
              text: "Error creating sponsor!",
              color: "red-accent-4",
            });
          }
        } else {
          alertStore.createAlert({
            title: "Sponsor have been succesfully registered!",
            icon: "$success",
            text: "We have successfully invited brand or sponsor, they will get an invitation email to sing up on Shareity!",
          });
        }
      })
      .finally(() => {
        loading.value = false;
        route.push("/sponsors");
      });
  }
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton
            to="/sponsors"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="font-extrabold">{{ title }} Sponsor</p>
        </div>
      </div>

      <CardBox is-form class="col-span-3" @submit.prevent="submit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Organization Name" :err="errorName">
            <FormControl
              v-model="form.name"
              :icon="mdiAccount"
              required
              :class="[correctName ? 'clase1 green ' : '']"
            />
          </FormField>

          <FormField label="Contact Person Email" :err="errorEmailMessage">
            <FormControl
              v-model="form.personEmail"
              :icon="mdiAt"
              type="email"
              name="email"
              required
              autocomplete="email"
              label="data"
              :class="[correctEmail ? 'clase2 green ' : '']"
            />
          </FormField>

          <FormField label="Contact Person First Name" :err="errorPersonName">
            <FormControl
              v-model="form.personName"
              :icon="mdiAccountBox"
              :class="[correctPersonName ? 'clase1 green ' : '']"
            />
          </FormField>

          <FormField label="Contact Person Last Name" :err="errorLastName">
            <FormControl
              v-model="form.personLastname"
              :icon="mdiAccountBox"
              :class="[correctLastName ? 'clase1 green ' : '']"
            />
          </FormField>

          <FormField
            label="Select Sponsor Logo"
            v-if="profile.rol === 'admin' || allCamp === true"
          >
            <FormFilePicker
              :modelValue="logo"
              v-on:update:model-value="handleLogo"
              label="Upload"
              mediaClass="w-52 h-52"
            />
          </FormField>
        </div>
        <template #footer>
          <BaseButtons class="justify-end">
            <BaseButton
              color="info"
              type="submit"
              label="Save"
              :disabled="activeButton || errorEmailMessage"
              :isloading="loading"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style>
.clase1 input[type="text"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  --tw-ring-color: rgb(0, 255, 13);
}

.clase2 input[type="email"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  --tw-ring-color: rgb(0, 255, 13);
}

.green input {
  border-color: rgb(36 233 16 / 100%) !important;
}
</style>
