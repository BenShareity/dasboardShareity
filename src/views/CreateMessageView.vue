<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import {
  mdiAccount,
  mdiArrowLeftDropCircle,
  mdiHandCoinOutline,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import "vue-color-kit/dist/vue-color-kit.css";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAlertStore } from "@/stores/alerts.js";
import UserController from "@/controllers/UserController";
import { onBeforeMount } from "vue";
import MessagesController from "@/controllers/MessagesController";
import { useRoute, useRouter } from "vue-router";

const alertStore = useAlertStore();

const typeMessage = [
  { id: 1, label: "Manual" },
  { id: 2, label: "Date" },
  { id: 3, label: "Achievement" },
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
const profile = ref({});
const role = ref();
const activeButton = ref(false);
const router = useRouter();
const route = useRoute();
const title = route.query.id ? "Edit" : "Create";
const isLoading = ref(false);
const form = reactive({
  title: "",
  description: "",
});

onBeforeMount(async () => {
  profile.value = await UserController.getMyProfile();
  role.value = profile.value.rol;
});
watchEffect(() => {
  form.title = route.query.title;
  form.description = route.query.description;
}, [route.query.id]);

watch(() => {
  activeButton.value = !form.title || !form.description;
  console.log(activeButton.value);
});
const submitProfile = async () => {
  isLoading.value = true;
  let userId = profile.value.id;
  let userRole = role.value;
  let amount = 1;

  if (userRole != "admin") amount = await UserController.getCredit(userId);
  console.log(amount);
  if (amount > 0) {
    console.log("aJA", amount);
    // validate if you have sufficient credits
    try {
      if (!route.query.id) {
        MessagesController.create(form)
          .then(() => {
            alertStore.createAlert({
              title: "Message created sussefully",
              color: "success",
              icon: "$success",
              text: "The message has ben created",
            });
            router.push("/rewards-messages");
          })
          .finally(() => {
            isLoading.value = false;
          });
      } else {
        let messageData = {
          title: form.title,
          description: form.description,
        };
        console.log(messageData);
        MessagesController.update(route.query.id, messageData)
          .then(() => {
            alertStore.createAlert({
              title: "Message uodated sussefully",
              color: "success",
              icon: "$success",
              text: "The message has ben updated",
            });
            router.push("/rewards-messages");
          })
          .finally(() => {
            isLoading.value = false;
          });
      }
    } catch (error) {
      alertStore.createAlert({
        title: "Error",
        color: "error",
        icon: "$warning",
        text: `${error}, please check your form`,
      });
      console.log(error, "Please check our data");
    }
  } else {
    // insufficient credits
    console.log("No tienes credito");
    alertStore.createAlert({
      title: "Insufficient credits",
      color: "error",
      icon: "$warning",
      text: "Acquire more credits to create a message",
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
            :icon="mdiArrowLeftDropCircle"
            to="/rewards-messages"
            color="info"
            rounded-full
            small
          />
          <p class="font-extrabold">{{ title }} Message</p>
        </div>
      </div>

      <CardBox is-form class="col-span-3" @submit.prevent="submitProfile">
        <div class="gap-3">
          <FormField label="Title">
            <FormControl v-model="form.title" :icon="mdiAccount" />
          </FormField>

          <!-- FormField label="Send Message">
            <FormControl v-model="form.sendMessage" :options="typeMessage" />
          </FormField>

          <FormField v-if="form.sendMessage.id == 2" label="Select Date">
            <Datepicker v-model="dateMessage" />
          </FormField>

          <FormField label="Afeter Certain Time">
            <FormControl
              v-model="form.certainTime"
              :options="certainTimeOptions"
            />
          </FormField> -->

          <!-- <div v-if="form.certainTime.id == 5" class="grid grid-cols-5 gap-5">
            <div class="col-span-3">
              <FormField label="After Certain Time Custom">
                <FormControl v-model="form.certainTimeCustom" type="number" />
              </FormField>
            </div>

            <div class="col-span-2">
              <FormField label="Time">
                <FormControl v-model="form.time" :options="timeOptions" />
              </FormField>
            </div>
          </div> -->
          <!-- 
          <FormField label="Subject">
            <FormControl v-model="form.subject" :icon="mdiHandCoinOutline" />
          </FormField> -->

          <FormField label="Message">
            <FormControl
              v-model="form.description"
              :icon="mdiHandCoinOutline"
            />
          </FormField>
        </div>
        <template #footer>
          <BaseButtons class="justify-end">
            <BaseButton
              :color="activeButton ? 'infoOpacity' : 'info'"
              type="submit"
              label="Save"
              :disabled="activeButton"
              :isLoading="isLoading"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
