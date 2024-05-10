<script setup>
import { reactive, ref, watchEffect } from "vue";
import { mdiArrowLeftDropCircle, mdiPlus } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import RewardController from "@/controllers/RewardController";
import { useRouter } from "vue-router";
import MessagesController from "@/controllers/MessagesController";

const form = reactive({
  checkbox: ["lorem"],
  radio: "one",
  switch: ["one"],
  file: null,
  rewOrMess: 0,
});

const host = import.meta.env.VITE_IMAGE_HOST;
const rewards = ref([]);
const messages = ref([]);
watchEffect(async () => {
  await RewardController.getAllDashboard().then((data) => {
    rewards.value = data;
  });
  await MessagesController.getAllDashboard().then((data) => {
    messages.value = data;
  });
});
const router = useRouter();

function goEdit(data) {
  if (form.rewOrMess === 1) {
    router.push({
      name: "create-message",
      query: {
        id: data.id,
        title: data.title,
        description: data.description,
      },
    });
  } else {
    router.push({
      name: "create-reward",
      query: {
        id: data.id,
        name: data.Name,
        point: data.point,
        description: data.Description,
      },
    });
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton
            to="/dashboard"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="lg:text-xl text-lg">Rewards & Messages</p>
        </div>
        <div>
          <BaseButton
            v-if="form.rewOrMess === 0"
            class="mr-5"
            label="Add Reward"
            color="info"
            :icon="mdiPlus"
            to="/create-reward"
          />
          <BaseButton
            v-else
            class="mr-5"
            label="Add Message"
            color="info"
            :icon="mdiPlus"
            to="/create-message"
          />
        </div>
      </div>
      <!-- <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        title="Rewards & Messages"
        main
      >
        <div>
          <BaseButton
            v-if="form.rewOrMess === 0"
            class="mr-5"
            label="Add Reward"
            color="info"
            :icon="mdiPlus"
            to="/create-reward"
          />
          <BaseButton
            v-else
            class="mr-5"
            label="Add Message"
            color="info"
            :icon="mdiPlus"
            to="/create-message"
          />
          <BaseButton
            to="/dashboard"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
        </div>
      </SectionTitleLineWithButton> -->

      <div class="flex gap-5 text-2xl mb-5">
        <BaseButton
          label="Rewards"
          color="info"
          :outline="form.rewOrMess === 1"
          @click="form.rewOrMess = 0"
        />
        <BaseButton
          label="Messages"
          color="info"
          :outline="form.rewOrMess === 0"
          @click="form.rewOrMess = 1"
        />
      </div>

      <div
        v-if="form.rewOrMess === 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        <!-- <CardBox class="flex items-center justify-center h-auto">
          <BaseButton
            label="Add Reward"
            color="info"
            :icon="mdiPlus"
            to="/create-reward"
          />
        </CardBox> -->

        <CardBox v-for="reward in rewards" :key="reward.id">
          <div>
            <p>
              <span class="font-bold">Name:</span>
              {{ reward.Name }}
            </p>
            <p><span class="font-bold">Points:</span> {{ reward.point }}</p>
            <p>
              <span class="font-bold">Description:</span>
              {{ reward.Description }}
            </p>
            <!-- <p class="font-bold">Type:</p> -->
            <!-- <p class="font-bold">Qty Available:</p>
            <p class="font-bold">Qty Sent:</p>
            <p class="font-bold">Qty Redeemed:</p> -->
          </div>

          <template #footer>
            <div class="flex justify-end">
              <BaseButton label="Edit" color="info" @click="goEdit(reward)" />
            </div>
          </template>
        </CardBox>
      </div>

      <div
        v-if="form.rewOrMess === 1"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        <!-- <CardBox class="flex items-center justify-center h-auto">
          <BaseButton
            label="Add Message"
            color="info"
            :icon="mdiPlus"
            to="/create-message"
          />
        </CardBox> -->

        <CardBox v-for="message in messages" v-if="form.rewOrMess === 1">
          <div class="space-y-1">
            <p class="text-3xl font-semibold">{{ message.title }}</p>
            <p>{{ message.description }}</p>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <BaseButton label="Edit" color="info" @click="goEdit(message)" />
            </div>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
