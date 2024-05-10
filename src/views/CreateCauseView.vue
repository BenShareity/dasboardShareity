<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import {
  mdiAccount,
  mdiAccountBox,
  mdiAccountGroup,
  mdiArrowLeftDropCircle,
  mdiAt,
  mdiHandCoinOutline,
  mdiInformation,
  mdiMail,
} from "@mdi/js";
import { useSessionStore } from "@/stores/session.js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRoute, useRouter } from "vue-router";
import OrganizationController from "@/controllers/OrganizationController";
import UtilityMethods from "@/utility/utilityMethods";
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";
import UserController from "@/controllers/UserController";
import { regexEmail } from "@/utility/regex";
import { register } from "numeral";
import RegisterController from "@/controllers/RegisterConstroller";
import { useAlertStore } from "@/stores/alerts";

let store = useSessionStore();
const alertStore = useAlertStore();
const isLoading = ref(false);
const role = store.getUserRole();
const host = import.meta.env.VITE_IMAGE_HOST;
const logo = ref();
const snackbar = ref(false);
const allCamp = ref(false)
const route = useRouter();


const errorName = ref(null)
const errorEmailMessage = ref(null);
const errorPersonName = ref(null);
const errorLastName = ref(null);
const errorDescription = ref(null);
const errorDonationLink= ref(null);

const correctName = ref(false);
const correctEmail = ref(false);
const correctPersonName = ref(false);
const correctLastName = ref(false);
const correctDescription = ref(null);
const correctDonationLink = ref(null);


const picker = reactive({
  showcolorpicker: false,
  color: "#59c7f9",
  suckerCanvas: null,
  suckerArea: [],
  isSucking: false,
});
const form = reactive({
  name: "",
  personEmail: "",
  personFirstname: "",
  personLastname: "",
  logo: "",
  description: "",
  donationLink: "",
  color: picker.color,
});
const snack = reactive({
  color: "green",
  message: "",
});
const activeButton = ref(false);
const profile = ref({});
const router = useRoute();

const title = router.query.id ? "Edit" : "Add";

const changeColor = (color) => {
  picker.color = color.hex;
};

const handleLogoUrl = (newValue) => {
  logo.value = newValue;
};

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();
  console.log(profile.value);
  OrganizationController.getById(router.query.id).then((data) => {
    console.log("edit", data);
    if (data) {
      allCamp.value = true
      console.log(allCamp.value);
    }
    form.name = data.name;
    form.personEmail = data.personEmail;
    form.personLastname = data.personLastname;
    logo.value = host + data.logo;
  });
}, [router.query.id]);
watch(() => {
  console.log(profile.value.rol);
  if (profile.value.rol === 'sponsor') {

    activeButton.value =
      !form.name ||
      !form.personEmail ||
      !form.personFirstname ||
      !form.personLastname ;
      

  } else {
    activeButton.value =
      !form.name ||
      !form.personEmail ||
      !form.personFirstname ||
      !form.personLastname ||
      !form.donationLink ||
      !form.description ;
      
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
  () => form.personFirstname,
  () => {
    if (!form.personFirstname) {
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

watch(
  () => form.description,
  () => {
    if (!form.description) {
      errorDescription.value = "Required field";
        correctDescription.value = false
    } else {
      errorDescription.value = null;
      correctDescription.value = true
    }
  }
);
watch(
  () => form.donationLink,
  () => {
    if (!form.donationLink) {
      errorDonationLink.value = "Required field";
        correctDonationLink.value = false
    } else {
      errorDonationLink.value = null;
      correctDonationLink.value = true
    }
  }
);

const submit = async () => {
  let logoMedia = "";
  if (logo.value) {
    logoMedia = await UtilityMethods.verifyMedia(logo.value, "organization");
  }

  if (router.query.id) {
    form.logo = logoMedia;
    let organizationData = {
      name: form.name,
      personEmail: form.personEmail,
      personFirstname: form.personFirstname,
      personLastname: form.personLastname,
      logo: form.logo,
      description: form.description,
      donationLink: form.donationLink,
      color: form.color,
    };
    OrganizationController.update(router.query.id, organizationData).then(
      (data) => {
        console.log(data);
        snackbar.value = true;
        snack.message = "Cause Updated";
        if (role == "cause") {
          route?.push("/dashboard");
        } else {
          route?.push("/causes");
        }
      }
    );
  } else {
    form.logo = logoMedia;
    let inp = JSON.parse(JSON.stringify(form));
    OrganizationController.create(inp)
      .then((data) => {
        console.log(data);
        // snackbar.value = true;
        // snack.message = "Cause Created";

        if (data) {
          if (profile.value.rol === "admin") {
            alertStore.createAlert({
              title: "Cause have been successfully registered",
              color: "success",
            });
          } else {
            alertStore.createAlert({
              title: "Cause have been successfully registered",
              color: "success",
              text: "We have successfully invited brand or cause, they will get an invitation email to sign up on Shareity",
            });
          }
          route.push("/causes");
        }
      })
      .catch((error) => {
        console.error("Error de la consola", error.message);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton to="/causes" :icon="mdiArrowLeftDropCircle" color="info" rounded-full small />
          <p class="lg:text-xl text-lg">{{ title }} Cause</p>
        </div>
      </div>

      <CardBox is-form class="col-span-3" @submit.prevent="submit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Organization Name"  :err="errorName">
            <FormControl v-model="form.name" :icon="mdiAccount" required :class="[correctName ? 'clase1 green ' : '']"/>
          </FormField>

          <FormField label="Contact Person Email" :err="errorEmailMessage">
            <FormControl v-model="form.personEmail" :icon="mdiAt" type="email" name="email"
             required autocomplete="email" label="data" :class="[correctEmail ? 'clase2 green ' : '']"/>
          </FormField>

          <FormField label="Contact Person First Name"  :err="errorPersonName">
            <FormControl v-model="form.personFirstname" :icon="mdiAccountBox"    :class="[correctPersonName ? 'clase1 green ' : '']"/>
          </FormField>

          <FormField label="Contact Person Last Name" :err="errorLastName">
            <FormControl v-model="form.personLastname" :icon="mdiAccountBox" :class="[correctLastName ? 'clase1 green ' : '']"/>
          </FormField>
          <h2 class="text-gray-400 leading[19px]" v-if="profile.rol === 'sponsor'">
            *Shareity will send an email to the contact person confirm your
            request
          </h2>
          <template v-else-if="profile.rol === 'admin' || allCamp === true">
            <FormField label="Organization Description" :err="errorDescription" >
              <FormControl v-model="form.description" :icon="mdiAccountBox" :class="[correctDescription ? 'clase1 green ' : '']" />
            </FormField>
            <FormField label="Donation link" :err="errorDonationLink">
              <FormControl v-model="form.donationLink" :icon="mdiAccountBox" :class="[correctDonationLink ? 'clase1 green ' : '']" />
            </FormField>
            <FormField label="Organization Color">
              <div class="flex flex-row">
                <BaseButton @click="
            picker.showcolorpicker = picker.showcolorpicker
              ? false
              : true
            " class="text-black w-full" label="Select Color" />
                <div class="ml-2 h-12 w-24 rounded-md" :style="{ background: picker.color }"></div>
              </div>
              <div style="position: relative">
                <div v-show="picker.showcolorpicker" style="position: absolute">
                  <ColorPicker theme="light" :color="picker.color" :sucker-hide="false"
                    :sucker-canvas="picker.suckerCanvas" :sucker-area="picker.suckerArea" @changeColor="changeColor"
                    @openSucker="picker.openSucker" />
                </div>
              </div>
            </FormField>
            <FormField label="Select Cause Logo">
              <FormFilePicker :modelValue="logo" v-on:update:model-value="handleLogoUrl" label="Upload"
                mediaClass="h-52 w-52" />
            </FormField>
          </template>
          <div class="w-24 h-24">
            <img v-if="logo != null" :src="host + logo" alt="" />
          </div>
        </div>
        <template #footer>
          <BaseButtons class="justify-end">
            <BaseButton color="info" type="submit" label="Save" :disabled="activeButton || errorEmailMessage"
              :isloading="loading" />
          </BaseButtons>
        </template>
      </CardBox>
      <v-snackbar v-model="snackbar" :timeout="3000" :color="snack.color">
        <p class="text-lg italic font-bold">{{ snack.message }}</p>
        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
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
