<script setup>
import { mdiArrowLeftDropCircle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserController from "@/controllers/UserController";
import { computed, ref, watchEffect, onBeforeMount } from "vue";
import UtilityMehods from "@/utility/utilityMethods";

const history = ref([]);
const snackbar = ref(false);
const checkedRows = ref([]);
// const sorting = ref({ field: "", order: 1 });
const loading = ref(Boolean);
const profile = ref({});
const role = ref();
const sorting = ref({ field: "firstName", order: 1 });
const perPage = ref(10);
const currentPage = ref(1);
const totalPages = ref();
const datePaginated = ref([]);

const itemsPaginated = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  let res = history.value.page?.slice(start, start + perPage.value);
  return res;
});

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();
  loading.value = true;
  role.value = profile.value.rol;
  let userId = profile.value.id;

  try {
    const data = await UserController.getCreditHistory(userId, 1000);
    history.value = data;

    totalPages.value = Math.ceil(history.value.page.length / perPage.value);
    console.log(history.value);
    loading.value = false;
    // console.log('datos', history.value);
    console.log("nmro pág", totalPages.value);
  } catch (error) {
    console.error("Error al obtener el historial de crédito:", error);
  }
});

// onBeforeMount(async () => {
//       profile.value = await UserController.getMyProfile();
//       role.value = profile.value.rol;
//       let userId = profile.value.id;

//       try {
//         const data = await UserController.getCreditHistory(userId, 1000);
//         history.value = data;

//           totalPages.value = Math.ceil( history.value.page.length/ perPage.value);
//           console.log(history.value);
//           // console.log('datos', history.value);
//         console.log(  'nmro pág', totalPages.value);
//       } catch (error) {
//         console.error('Error al obtener el historial de crédito:', error);
//       }
//     });
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton
            to="/credits"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="lg:text-xl text-lg">Credit History</p>
        </div>
      </div>
      <CardBox class="mb-6 m" has-table>
        <div>
          <div class="p-3 bg-gray-100/50 dark:bg-slate-800">
            <span
              v-for="checkedRow in checkedRows"
              :key="checkedRow.id"
              class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
            >
              {{ checkedRow.name }}
            </span>
          </div>

          <div v-if="loading" class="flex align-center justify-center h-screen">
            <LoadingSpinner></LoadingSpinner>
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
              v-if="!loading"
              class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">Date</th>
                  <th scope="col" class="px-6 py-3">Amount</th>
                  <th scope="col" class="px-6 py-3">Credits</th>
                  <th scope="col" class="px-6 py-3">Transaction</th>
                  <th scope="col" class="px-6 py-3">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="client in itemsPaginated"
                  :key="client.id"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td class="px-6 py-4">
                    {{ UtilityMehods.formatDate(client.createAt) }}
                  </td>
                  <td class="px-6 py-4">
                    {{
                      `$ ${
                        client.type == "credit"
                          ? client.rate * client.credit
                          : 0
                      }`
                    }}
                  </td>
                  <td class="px-6 py-4">
                    {{ client.credit }}
                  </td>
                  <td class="px-6 py-4">
                    {{ client.type }}
                  </td>
                  <td class="px-6 py-4">
                    {{ client.paymentMethod }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="text-center">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="perPage"
            ></v-pagination>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style>
.button {
  display: flex;
  align-items: center !important;
}
</style>
