<script setup>
import { reactive, ref, watchEffect } from "vue";
import { mdiAccountQuestion, mdiArrowLeftDropCircle, mdiForum } from "@mdi/js";
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
import { useRoute, useRouter } from "vue-router";
import FaqController from "@/controllers/FaqController";

const alertStore = useAlertStore();

const router = useRouter();
const route = useRoute();
const title = route.query.id ? "Edit" : "Create";
const isLoading = ref(false);
const form = reactive({
  question: "",
  answer: "",
});

watchEffect(() => {
  form.question = route.query.question;
  form.answer = route.query.answer;
}, [route.query.id]);
const submitProfile = async () => {
  isLoading.value = true;
  try {
    if (!route.query.id) {
      FaqController.create(form)
        .then(() => {
          alertStore.createAlert({
            title: "FaQ created sussefully",
            color: "success",
            icon: "$success",
            text: "The FaQ has ben created",
          });
          router.push("/faq");
        })
        .finally(() => {
          isLoading.value = false;
        });
    } else {
      let FaqData = {
        question: form.question,
        answer: form.answer,
      };
      FaqController.update(route.query.id, FaqData)
        .then(() => {
          alertStore.createAlert({
            title: "FaQ updated sussefully",
            color: "success",
            icon: "$success",
            text: "The FaQ has ben updated",
          });
          router.push("/faq");
        })
        .finally(() => {
          isLoading.value = false;
        });
    }
  } catch (error) {
    alertStore.createAlert({
      title: "Error",
      color: "red",
      icon: "$warning",
      text: `${error}, please check your form`,
    });
    console.log(error, "Please check our data");
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
            to="/faq"
            color="info"
            rounded-full
            small
          />
          <p class="font-extrabold">{{ title }} FaQ</p>
        </div>
      </div>

      <CardBox is-form class="col-span-3" @submit.prevent="submitProfile">
        <div class="gap-3">
          <FormField label="Question">
            <FormControl
              v-model="form.question"
              :icon="mdiAccountQuestion"
              required
            />
          </FormField>

          <FormField label="Answer">
            <FormControl v-model="form.answer" :icon="mdiForum" />
          </FormField>
        </div>
        <template #footer>
          <BaseButtons class="justify-end">
            <BaseButton
              color="info"
              type="submit"
              label="Save"
              :isLoading="isLoading"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
