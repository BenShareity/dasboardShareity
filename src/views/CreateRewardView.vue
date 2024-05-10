<script setup>
import { ref, watch } from "vue";
import {
  mdiAccount,
  mdiArrowLeftDropCircle,
  mdiBullseye,
  mdiTextBox,
  mdiAccountMultiplePlus,
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
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import UtilityMethods from "@/utility/utilityMethods";
import RewardController from "@/controllers/RewardController";
import { useAlertStore } from "@/stores/alerts.js";
import UserController from "@/controllers/UserController";
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { watchEffect } from "vue";

const router = useRouter();
const route = useRoute();
const alertStore = useAlertStore();
const backgroundUrl = ref();
const badgeUrl = ref();
const profile = ref({});
const errorStockMessage = ref(null);
const title = route.query.id ? "Edit" : "Create";

const sendRewardOptions = [
  { id: 1, label: "Manual" },
  { id: 2, label: "By Points" },
  { id: 3, label: "By Influenced" },
];

const certainTimeOptions = [
  { id: 1, label: "One Day" },
  { id: 2, label: "Two Days" },
  { id: 3, label: "A Week" },
  { id: 4, label: "A Month" },
  { id: 5, label: "Custom" },
];

const timeOptions = [
  { id: 1, label: "Minutes" },
  { id: 2, label: "Hours" },
  { id: 3, label: "Days" },
  { id: 4, label: "Weeks" },
  { id: 5, label: "Months" },
];

const typeRewardOptions = [
  { id: 1, label: " QR Code" },
  { id: 2, label: "Graphics" },
  { id: 3, label: "UPC Code" },
  { id: 4, label: "LightBeat" },
];

const activeBotton = ref(false);
const dateReward = ref();

const form = ref({
  title: "",
  description: "",
  stock: "",
  influenced: "",
  type: typeRewardOptions[0],
  point: "",
  sendReward: route.query.point ? sendRewardOptions[1] : sendRewardOptions[0],
  certainTime: certainTimeOptions[0],
  certainTimeCustom: 0,
});
onBeforeMount(async () => {
  profile.value = await UserController.getMyProfile();
  console.log("estoy aqui", profile.value);
});

watchEffect(() => {
  form.value.title = route.query.name;
  form.value.point = route.query.point;
  form.value.description = route.query.description;
}, [route.query.id]);

console.log("ruta", route);

watch(() => {
  console.log(activeBotton.value);
  activeBotton.value =
    !form.value.title ||
    !form.value.description ||
    !form.value.type ||
    // !form.value.point ||
    !form.value.stock ||
    !backgroundUrl.value ||
    !badgeUrl.value;
});

const handleBackgroundUrl = (newValue) => {
  backgroundUrl.value = newValue;
};
const handleBadgeUrl = (newValue) => {
  badgeUrl.value = newValue;
};
const inputStock = () => {
  form.value.stock = form.value.stock.replace(/[^0-9]/g, "");
};

const submitProfile = async () => {
  let userId = profile.value.id;
  let userRole = profile.value.rol;
  let amount = 1;
  console.log(userId);

  if (userRole != "admin" && "cause")
    amount = await UserController.getCredit(userId);

  // validate if you have sufficient credits
  let backgroundMedia = "";
  if (backgroundUrl) {
    backgroundMedia = await UtilityMethods.verifyMedia(
      backgroundUrl.value,
      "rewards"
    );
  }

  let badgeMedia = "";
  if (badgeUrl) {
    badgeMedia = await UtilityMethods.verifyMedia(badgeUrl.value, "rewards");
  }

  let rewardData = {
    title: form.value.title,
    description: form.value.description,
    type: form.value.type.label,
    point: form.value.point,
    influenced: form.value.influenced,
    imgBgReward: backgroundMedia,
    imgBadReward: badgeMedia,
    userId: profile.value.id,
    stock: +form.value.stock,
  };
  console.log("quejesta vaina", form.value.stock);
  const regeNumber = /^([1-9][0-9]?|100)$/gm;
  if (!regeNumber.test(form.value.stock)) {
    console.log("De 1 a 100 Stock");
    errorStockMessage.value = "Reward Stock is 1-100";
  } else {
    await RewardController.create(rewardData, "Reward").then(
      alertStore.createAlert({
        title: "Reward successfully created!",
        icon: "$success",
        text: "the reward has been createds successfully!",
      }),

      router.push("/rewards-messages")
    );
  }
  // store.setUser(form);
  // insufficient credits
  // alertStore.createAlert({
  //   title: "Insufficient credits",
  //   color: "error",
  //   icon: "$warning",
  //   text: "Acquire more credits to create a reward",
  // });
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
          <p class="font-extrabold">{{ title }} Reward</p>
        </div>
      </div>

      <CardBox is-form class="col-span-3" @submit.prevent="submitProfile">
        <div class="gap-3">
          <FormField label="Reward Name">
            <FormControl v-model="form.title" :icon="mdiAccount" required />
          </FormField>

          <FormField label="Reward Description">
            <FormControl
              v-model="form.description"
              :icon="mdiTextBox"
              required
            />
          </FormField>

          <FormField label="Quantity of stock you want to ship from 1 - 100">
            <FormControl
              v-model="form.stock"
              :icon="mdiBullseye"
              @input="inputStock"
              placeholder="Example 10 stock"
            />
          </FormField>
          <FormField v-if="form.sendReward.id == 3" label="Influenced">
            <FormControl
              v-model="form.influenced"
              :icon="mdiAccountMultiplePlus"
              @input="inputStock"
              placeholder="Influenced"
            />
          </FormField>
          <FormField
            v-if="form.sendReward.id == 2 || route.query.point"
            label="Reward Points"
          >
            <FormControl v-model="form.point" :icon="mdiBullseye" />
          </FormField>
          <!-- <span class="to-red-600 text-sm m-0 !import">{{ errorStockMessage }}</span> -->

          <FormField label="Send Reward">
            <FormControl
              v-model="form.sendReward"
              :options="sendRewardOptions"
            />
          </FormField>

          <FormField v-if="form.sendReward.id == 2" label="Select Date">
            <Datepicker v-model="dateMessage" />
          </FormField>

          <FormField
            v-if="form.sendReward.id == 2 || form.sendReward.id == 3"
            label="After Certain Time"
          >
            <FormControl
              v-model="form.certainTime"
              :options="certainTimeOptions"
            />
          </FormField>

          <div v-if="form.certainTime.id == 5" class="grid grid-cols-5 gap-5">
            <div class="col-span-3">
              <FormField label="After Certain Time Custom">
                <FormControl v-model="form.certainTimeCustom" type="number" />
              </FormField>
            </div>

            <div class="col-span-2">
              <FormField label="Time">
                <FormControl
                  v-model="form.certainTime"
                  :options="certainTimeOptions"
                />
              </FormField>
            </div>
          </div>

          <FormField label="Reward Type">
            <FormControl v-model="form.type" :options="typeRewardOptions" />
          </FormField>

          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-5 justify-items-center"
          >
            <FormField label="Background Image">
              <FormFilePicker
                label="Upload"
                :modelValue="backgroundUrl"
                v-on:update:model-value="handleBackgroundUrl"
              />
            </FormField>

            <FormField label="Reward Icon">
              <FormFilePicker
                label="Upload"
                :modelValue="badgeUrl"
                v-on:update:model-value="handleBadgeUrl"
              />
            </FormField>
          </div>
        </div>
        <template #footer>
          <BaseButtons class="justify-end">
            <BaseButton
              :color="activeBotton ? 'infoOpacity' : 'info'"
              type="submit"
              label="Save"
              :disabled="activeBotton"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
