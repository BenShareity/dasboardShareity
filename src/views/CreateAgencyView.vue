<script setup>
import { reactive, ref,watch, watchEffect } from "vue";
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
import UtilityMethods from "@/utility/utilityMethods";
import { ColorPicker } from "vue-color-kit";
import { regexEmail } from "@/utility/regex";
import "vue-color-kit/dist/vue-color-kit.css";
import AgencyController from "@/controllers/AgencyController";
import { useAlertStore } from "@/stores/alerts.js";
import UserController from "@/controllers/UserController";
import RegisterController from "@/controllers/RegisterConstroller";

let store = useSessionStore();
const role = store.getUserRole();
const host = import.meta.env.VITE_IMAGE_HOST;
const img = ref();
const imgbg = ref();
const snackbar = ref(false);
const route = useRouter();
const alertStore = useAlertStore();
const profile = ref({});

const activeButton = ref(false);
const errorName = ref(null)
const errorEmailMessage = ref(null);
const errorAddress = ref(null);
const errorWebsite = ref(null);
const errorDescription = ref(null);

const correctName = ref(false);
const correctEmail = ref(false);
const correctAddress = ref(false);
const correctWebsite = ref(false);
const correctDescription = ref(false);

const picker = reactive({
  showcolorpicker: false,
  color: "",
  suckerCanvas: null,
  suckerArea: [],
  isSucking: false,
});
const form = reactive({
  name: "",         
  email: "",
  website: "",
  address: "",
  description: "",
  img: "",
  imgBg: "",
  color: picker.color,
  // imgGif: "",
});
const snack = reactive({
  color: "green",
  message: "",
});

const router = useRoute();

const title = router.query.id ? "Edit" : "Create";

watch(() => {
  
  activeButton.value =
      !form.name ||
      !form.email ||
      !form.website ||
      !form.description;
    return;
  
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
  () => form.email,
  async () => {
    if (!form.email) {
      errorEmailMessage.value = "Required field";
      correctEmail.value = false;
    } else if (!regexEmail.test(form.email.trim())) {
      errorEmailMessage.value = "Invalid email";
      correctEmail.value = false;
    } else {
      let forms = {
        email: form.email,
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
  () => form.address,
  () => {
    if (!form.address) {
      errorAddress.value = "Required field";
        correctAddress.value = false
    } else {
      errorAddress.value = null;
      correctAddress.value = true
    }
  }
);
watch(
  () => form.website,
  () => {
    if (!form.website) {
      errorWebsite.value = "Required field";
        correctWebsite.value = false
    } else {
      errorWebsite.value = null;
      correctWebsite.value = true
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
const changeColor = (color) => {
  picker.color = color.hex;
};

const handleImgUrl = (newValue) => {
  img.value = newValue;
};

const handleImgbgUrl = (newValue) => {
  imgbg.value = newValue;
};

watchEffect(async () => {
  try {
    profile.value = await UserController.getMyProfile();
    const data = await AgencyController.getByUser(router.query.id);
    if (data) {
      form.name = data.name || '';
      form.email = data.email || '';
      form.address = data.address || '';
      form.website = data.website || '';
      form.description = data.description || '';
      img.value = host + (data.img || '');
      imgbg.value = host + (data.imgBg || '');  
      picker.color = data.color;
    }
    console.log('imgbg:', imgbg.value);  
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}, [router.query.id]);


const submit = async () => {
  let imgMedia = await UtilityMethods.verifyMedia(img.value, "agency");
  const imgbgMedia = await UtilityMethods.verifyMedia(imgbg.value, "agency");

  if (router.query.id) {
    form.img = imgMedia;
    form.imgBg = imgbgMedia;
  let agencyData = {
      idUsr: profile.value.id,
      name: form.name,
      email: form.email,
      address: form.address,
      website: form.website,
      img: form.img,
      description: form.description,
      imgBg: form.imgBg,
      color: picker.color,
    
};
console.log('color',agencyData.color);
    console.log('console nombre',agencyData.name);
    AgencyController.update(router.query.id, agencyData).then((data) => {
      try {
        alertStore.createAlert({
          title: "Agency Updated!",
          icon: "$success",
          text: "the Agency has been Updated successfully!",
        });
        route.push("/agencies");
      } catch (error) {
        alertStore.createAlert({
          title: "Error on Updated!",
          icon: "$warning", 
          text: `${error}`,
        });
        console.log("Error en Updated agencie", error);
      }
    });
  } else {
    form.img = imgMedia;
    form.imgBg = imgbgMedia;

    let inp = JSON.parse(JSON.stringify(form));
     
    inp.idUsr = profile.value.id
    AgencyController.create(inp)
      .then((data) => {
        try {
          alertStore.createAlert({
            title: "Agency Created!",
            icon: "$success",
            text: "the Agency has been created successfully!",
          });
          route.push("/agencies");
        } catch (error) {
          alertStore.createAlert({
            title: "Error on create Agency",
            icon: "$warning",
            color: "red",
            text: `${error}`,
          });
          console.log("Error en create agencie", error);
        }
      })
      .catch((err) => {
        console.log("estoy aqui", err);
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
            to="/agencies"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="lg:text-xl text-lg">{{ title }} Agency</p>
        </div>
      </div>

      <CardBox is-form class="col-span-3" @submit.prevent="submit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- <FormField label="Agency Name">
            <FormControl v-model="form.name" :icon="mdiAccount"   name="name" required />
          </FormField> -->
          <FormField label="Agency Name" :err="errorName">
            <FormControl v-model="form.name" :icon="mdiAccount" required   :class="[correctName ? 'clase1 green ' : '']" />
          </FormField>

          
          <FormField label="Agency contact Email" :err="errorEmailMessage">
            <FormControl
              v-model="form.email"
              :icon="mdiAt"
              type="email"
              name="email"
              required
              autocomplete="email"
              label="data"
              :class="[correctEmail ? 'clase2 green ' : '']"
            />
          </FormField>

          <FormField label="Agency address" :err="errorAddress">
            <FormControl v-model="form.address" :icon="mdiAccountBox"  :class="[correctAddress ? 'clase1 green ' : '']" />
          </FormField>  

          <FormField label="Agency website" :err="errorWebsite">
            <FormControl v-model="form.website" :icon="mdiAccountBox" :class="[correctWebsite ? 'clase1 green ' : '']" />
          </FormField>
          <FormField label="Agency Description" :err="errorDescription">
            <FormControl v-model="form.description" :icon="mdiAccountBox" :class="[correctDescription ? 'clase1 green ' : '']"  />
          </FormField>

          <FormField label="Agency Color">
            <div class="flex flex-row">
              <BaseButton
                @click="
                  picker.showcolorpicker = picker.showcolorpicker ? false : true
                "
                class="text-black w-full"
                label="Select Color"
              />
              <div
                class="ml-2 h-12 w-24 rounded-md"
                :style="{ background: picker.color }"
              ></div>
            </div>
            <div style="position: relative">
              <div v-show="picker.showcolorpicker" style="position: absolute">
                <ColorPicker
                  theme="light"
                  :color="picker.color"
                  :sucker-hide="false"
                  :sucker-canvas="picker.suckerCanvas"
                  :sucker-area="picker.suckerArea"
                  @changeColor="changeColor"
                  @openSucker="picker.openSucker"
                />
              </div>
            </div>
          </FormField>
          <FormField label="Select Agency Image">
            <FormFilePicker
              :modelValue="img"
              v-on:update:model-value="handleImgUrl"
              label="Upload"
              mediaClass="h-52 w-52"
            />
          </FormField>
          <div class="w-24 h-24">
            <img v-if="img != null" :src="host + img" alt="" />
          </div>

          <FormField label="Select Agency Image Background">
            <FormFilePicker
              :modelValue="imgbg"
              v-on:update:model-value="handleImgbgUrl"
              label="Upload"
              mediaClass="h-52 w-52"
            />
          </FormField>
          <div class="w-24 h-24">
            <img v-if="imgbg != null" :src="host + imgbg" alt="" />
          </div>
        </div>
        <template #footer>
          <BaseButtons class="justify-end">
            <BaseButton color="info" type="submit" label="Save" :disabled="activeButton || errorEmailMessage" />
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
