<script setup>
import { onMounted, computed, ref, watchEffect } from "vue";
import { mdiArrowLeftDropCircle, mdiFormatListBulleted } from "@mdi/js";
import UtilityMehods from "@/utility/utilityMethods";
import { useSessionStore } from "@/stores/session.js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import UserController from "@/controllers/UserController";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";

const amount = ref(0);
const history = ref([]);
const stripePublic = import.meta.env.VITE_STRIPE_PUBLIC;
const profile = ref({});
const loading = ref(Boolean);

const itemsPaginated = computed(() => {
  return history.value.page;
});

watchEffect(async () => {
    profile.value = await UserController.getMyProfile();
  loading.value = true;
  let userId = profile.value.id;
    
  amount.value = await UserController.getCredit(userId);
  UserController.getCreditHistory(userId, 5).then((data) => {
    history.value = data;
      loading.value = false;
  });
});



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

          <p class="lg:text-xl text-lg">Credit</p>
        </div>

        <div>
          <BaseButton
            class="mr-5"
            label="Credit History"
            color="info"
            :icon="mdiFormatListBulleted"
            to="/credits-history"
          />
        </div>
      </div>

      <div v-if="loading" class="flex align-center justify-center h-screen">
      <LoadingSpinner></LoadingSpinner>
    </div>

      <div v-if="!loading" class="flex flex-col md:flex-row w-full items-start gap-6">
        <CardBox has-table class="mb-6 pb-5 w-1/2">
          <p class="font-bold uppercase p-5">Last Transactions</p>
          <table 
            class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Credits obtained</th>
                <th>Card type</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="client in itemsPaginated" :key="client.id">
                <td data-label="Date">
                  {{ UtilityMehods.formatDate(client.createAt) }}
                </td>
                <td data-label="Amount">
                    {{ `$ ${ client.type == 'credit' ? (client.rate * client.credit) : 0}` }}
                </td>
                <td data-label="Credits obtained">
                  {{ client.credit }}
                </td>
                <td data-label="Card type">
                  {{ client.type }}
                </td>
              </tr>
            </tbody>
          </table>
        </CardBox>

        <NotificationBar color="info" class="w-1/2">
          AVAILABLE BALANCE:
          <span class="font-bold text-l">{{ amount?.credits }}</span>
        </NotificationBar>
      </div>

      <div class="grid grid-col-1 grid-cols-3">
        <stripe-buy-button
          buy-button-id="buy_btn_1NxsteGEa3BXvsmARzNwOSDF"
          :publishable-key="stripePublic"
        >
        </stripe-buy-button>

        <stripe-buy-button
          buy-button-id="buy_btn_1NxtITGEa3BXvsmAsKtmtery"
          :publishable-key="stripePublic"
        >
        </stripe-buy-button>

        <stripe-buy-button
          buy-button-id="buy_btn_1O1tcFGEa3BXvsmAIQaivid2"
          :publishable-key="stripePublic"
        >
        </stripe-buy-button>

        <stripe-buy-button
          buy-button-id="buy_btn_1O1td2GEa3BXvsmACCEWCe4X"
          :publishable-key="stripePublic"
        >
        </stripe-buy-button>

        <stripe-buy-button
          buy-button-id="buy_btn_1O1tdeGEa3BXvsmAdUoolTXh"
          :publishable-key="stripePublic"
        >
        </stripe-buy-button>

        <stripe-buy-button
          buy-button-id="buy_btn_1O1taoGEa3BXvsmABkOpe1iV"
          :publishable-key="stripePublic"
        >
        </stripe-buy-button>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
