<script setup>
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormControl from "@/components/FormControl.vue";
import ChallengeController from "@/controllers/ChallengeController";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { reactive } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { watchEffect } from "vue";
import UtilityMethods from "@/utility/utilityMethods";
import { useAlertStore } from "@/stores/alerts";

const id = ref();
const route = useRoute();
const badge = ref();
const url = ref();
const alertStore = useAlertStore();
const host = import.meta.env.VITE_IMAGE_HOST;
const form = reactive({
  name: "",
  description: "",
  amount: "",
  badge: "",
  url: "",
});
const props = defineProps({
  toggle: {
    type: Function,
    required: true,
  },
});
const handleBadge = (newValue) => {
  badge.value = newValue;
};

const handleUrl = (newValue) => {
  url.value = newValue;
};

watchEffect(async () => {
  id.value = route.query.id;
  await ChallengeController.getById(id.value).then((data) => {
    form.name = data.name;
    form.description = data.description;
    form.amount = data.amount;
    badge.value = host + data.badge;
    url.value = host + data.url;
  });
});

async function submit() {
  let badgeMedia = undefined;
  if (badge.value) {
    badgeMedia = await UtilityMethods.verifyMedia(badge.value, "challenges");
  }
  let urlMedia = undefined;
  if (url.value) {
    urlMedia = await UtilityMethods.verifyMedia(url.value, "challenges");
  }
  let challengeData = {
    name: form.name,
    description: form.description,
    amount: form.amount,
    badge: badgeMedia,
    url: urlMedia,
  };
  await ChallengeController.update(id.value, challengeData).then(() => {
    window.location.reload();
    props.toggle();
    alertStore.createAlert({
      title: "Challenge Updated!",
      icon: "$success",
      text: "the challenge has been updated successfully!",
    });
  });
}
</script>

<template>
  <CardBox>
    <div class="grid grid-cols-2 gap-2">
      <FormField label="Challenge Name">
        <FormControl v-model="form.name" help="Challenge Name" />
      </FormField>
      <FormField label="Challenge Description">
        <FormControl v-model="form.description" help="Challenge Description" />
      </FormField>
    </div>
    <div class="grid grid-cols-1">
      <FormField label="Challenge Amount">
        <FormControl v-model="form.amount" help="Challenge amount" />
      </FormField>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <FormField label="Badge Image" help="Max 500kb">
        <FormFilePicker
          :modelValue="badge"
          v-on:update:model-value="handleBadge"
          label="Upload"
        />
      </FormField>
      <FormField label="Challenge Background" help="Max 500kb">
        <FormFilePicker
          label="Upload"
          :modelValue="url"
          v-on:update:model-value="handleUrl"
          mediaClass="w-[254px] h-[254px] object-cover mt-3"
          required
        />
      </FormField>
    </div>
    <div class="flex justify-center">
      <BaseButton label="Update" @click="submit()" color="info" />
    </div>
  </CardBox>
</template>
