<script setup>
import {
  mdiArrowLeftDropCircle,
  mdiTrashCan,
  mdiPencil,
  mdiPlus,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import FaqController from "@/controllers/FaqController";
import { ref, watchEffect, onBeforeMount } from "vue";
import ChallengeController from "@/controllers/ChallengeController";
import { useAlertStore } from "@/stores/alerts";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const faqs = ref([]);

const checkable = false;

const isModalActive = ref(false);

const checkedRows = ref([]);

const modalInfo = ref(false);

const alertStore = useAlertStore();

// const itemsPaginated = computed(() => {
//   const start = currentPage.value * perPage.value;
//   return sortedUsers.value.reverse().slice(start, start + perPage.value);
// });

// const filteredUsers = computed(() => {
//   return faq.value.filter((item) => {
//     return item.firstName.includes(searchName.value);
//   });
// });

// const sortedUsers = computed(() => {
//   const { field, order } = sorting.value;
//   const start = (currentPage.value - 1) * perPage.value;

//   return filteredUsers.value
//     .sort((a, b) => {
//       if (field === "createdAt") {
//         return order * (new Date(a[field]) - new Date(b[field]));
//       } else {
//         return order * (a[field] < b[field] ? 1 : -1);
//       }
//     })
//     .slice(start, start + perPage.value);
// });

// const numPages = computed(() =>
//   Math.ceil(filteredUsers.value.length / perPage.value)
// );

// const pagesList = computed(() => {
//   const pagesList = [];

//   for (let i = 0; i < numPages.value; i++) {
//     pagesList.push(i);
//   }

//   return pagesList;
// });

watchEffect(async () => {
  await FaqController.getAll().then((data) => {
    faqs.value = data;
  });
});

onBeforeMount(async () => {}),
  function openInfoModal(selected_User) {
    ChallengeController.getUserChallenge(selected_User.id).then((res) => {
      selectedUser.value = res.data.page;
      console.log(selectedUser);
    });
    modalInfo.value = true;
  };

async function deleteFaq(selectedId) {
  await FaqController.delete(selectedId).then(() => {
    alertStore.createAlert({
      title: "FAQ deletd!",
      icon: "$warning",
      color: "red",
      text: "the FAQ has been Deleted successfully!",
    });
    FaqController.getAll().then((data) => {
      faqs.value = data;
      isModalActive.value = false;
    });
  });
}

function goEdit(data) {
  router.push({
    name: "createfaq",
    query: {
      id: data.id,
      question: data.question,
      answer: data.answer,
    },
  });
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
          <p class="font-extrabold">FAQ</p>
        </div>
        <div class="flex gap-2 items-center">
          <BaseButton
            class="mr-5"
            label="Add FAQ"
            color="info"
            :icon="mdiPlus"
            to="/createfaq"
          />
        </div>
      </div>
      <CardBox class="mb-6 m" has-table>
        <div>
          <!-- modal delete -->
          <v-dialog v-model="isModalActive" width="auto">
            <v-card>
              <v-card-title class="text-h5"> Delete </v-card-title>
              <v-card-text
                >Are you sure you want to <b>Delete</b> this FAQ?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red"
                  variant="text"
                  @click="isModalActive = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="green-darken-1"
                  variant="text"
                  @click="deleteFaq(selectedId)"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <div
            v-if="checkedRows.length"
            class="p-3 bg-gray-100/50 dark:bg-slate-800"
          >
            <span
              v-for="checkedRow in checkedRows"
              :key="checkedRow.id"
              class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
            >
              {{ checkedRow.name }}
            </span>
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
              class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="w-25 px-6 py-3">
                    <div class="flex items-center">Question</div>
                  </th>
                  <th scope="col" class="w-30 px-6 py-3">
                    <div class="flex items-center">Answer</div>
                  </th>

                  <th scope="col" class="col-auto px-6 py-3">
                    <span class="text-center">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="faq in faqs"
                  :key="faq.id"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCheckboxCell
                    v-if="checkable"
                    @checked="checked($event, faq)"
                  />

                  <td class="px-6 py-4">
                    {{ `${faq.question}` }}
                  </td>
                  <td class="px-6 py-4">
                    {{ faq.answer }}
                  </td>

                  <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                      <BaseButton
                        color="danger"
                        :icon="mdiTrashCan"
                        small
                        @click="
                          {
                            isModalActive = true;
                            selectedId = faq.id;
                          }
                        "
                      />
                      <BaseButton
                        class="ml-5"
                        color="info"
                        :icon="mdiPencil"
                        small
                        @click="goEdit(faq)"
                      />
                    </BaseButtons>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"
          >
            <!-- <BaseLevel>
              <v-pagination
                :length="pagesList.length"
                color="black"
                :total-visible="10"
                v-model="currentPage"
              ></v-pagination>
            </BaseLevel> -->
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
