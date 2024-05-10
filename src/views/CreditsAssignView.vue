<script setup>
import AssignCreditsController from "@/controllers/AssignCreditsControllers";
import { computed, ref } from "vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import { mdiArrowLeftDropCircle, mdiClipboardTextClock } from "@mdi/js";

const information = ref([]);
const userRol = ref("");
const loading = ref(false);
const userData = ref();
const modalCredits = ref(false);
const creditsAmount = ref(null);
const errorAmount = ref("");
const messageError = ref(false);
const mesaageSuccess = ref(false);
const perPage = ref(10);
const totalPages = ref(0);
const currentPage = ref(1);
const sorting = ref({ field: "name", order: 1 });

const itemsPaginated = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return information.value.slice(start, start + perPage.value);
});

const onFindRole = async (e) => {
  e.target.value;
  if (e.target.value) {
    loading.value = true;
    try {
      information.value =
        await AssignCreditsController.getSponsorAgencyOrganizationInformation(
          e.target.value
        );
      totalPages.value = Math.ceil(information.value.length / perPage.value);
    } catch (error) {
      loading.value = false;
    } finally {
      loading.value = false;
    }
  }
};
const index = async (rol) => {
  console.log("ROL", rol);
  loading.value = true;
  creditsAmount.value = null;
  try {
    information.value =
      await AssignCreditsController.getSponsorAgencyOrganizationInformation(
        rol
      );
  } catch (error) {
    loading.value = false;
  } finally {
    loading.value = false;
  }
};
const openModal = (info) => {
  userData.value = info;
  modalCredits.value = true;
  if (!info.user) {
    messageError.value = true;
  }
};
const closeModal = () => {
  modalCredits.value = false;
  setTimeout(() => {
    messageError.value = false;
    userData.value = null;
    creditsAmount.value = null;
  }, 500);
};
const assingCreditsToUser = async () => {
  console.log("res user", userData.value);

  if (!creditsAmount.value) {
    errorAmount.value = "REQUIRED";
    return;
  }
  loading.value = true;
  try {
    const response = await AssignCreditsController.assignCredits({
      id: userData.value.user.id,
      credits: creditsAmount.value,
    });
    if (response) {
      modalCredits.value = false;
      mesaageSuccess = true;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  } finally {
    loading.value = false;
    index(userRol.value);
  }
};
function sort(field) {
  console.log(field);
  if (sorting.value.field === field) {
    console.log("campo", field);
    sorting.value.order *= -1;
  } else {
    sorting.value.field = field;
    sorting.value.order = 1;
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
          <p class="font-extrabold">Assign Credits</p>
        </div>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="flex flex-col float-start gap-3 p-5">
          <label class="font-medium">Select an User Rol</label>
          <select
            sleclass="border border-[#aaaaaa] shadow-md rounded-lg"
            @change="onFindRole"
            v-model="userRol"
          >
            <option value="" selected disabled hidden>Select Rol</option>
            <option value="agency">Agency</option>
            <option value="organization">Organization</option>
            <option value="sponsor">Sponsor</option>
          </select>
        </div>
      </div>
      <div class="relative shadow-md sm:rounded-lg">
        <table
          class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="w-60 px-6 py-3">
                <div>
                  Organization Name
                  <!--  <a @click="sort('name')"
                        ><svg
                          class="w-3 h-3 ml-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                          />
                        </svg>
                      </a> -->
                </div>
              </th>
              <th scope="col" class="w-80 px-6 py-3">Credits</th>
              <th scope="col" class="w-20 px-6 py-3">
                <span class="text-center"> Actions </span>
              </th>
            </tr>
          </thead>
          <div
            v-if="loading"
            class="w-full flex top-[400px] flex-col gap-3 absolute h-full justify-center text-xl font-medium items-center"
          >
            <div class="h-24 w-24 loading-edit">
              <LoadingSpinner class="!w-auto !h-auto" />
            </div>

            <p class="text-[#6b6b6b] font-semibold">Loading...</p>
          </div>
          <template v-else>
            <div
              class="w-full h-full top-[400px] flex absolute justify-center text-xl font-medium items-center"
              v-if="information?.length == 0"
            >
              <div>No data to show</div>
            </div>
            <tbody v-else>
              <tr
                v-for="info in itemsPaginated"
                :key="info.id"
                class="border-b border-[#858585] dark:border-gray-700"
              >
                <td
                  v-if="info.name"
                  class="px-6 py-4 text-[#2b2b2b] font-semibold"
                >
                  {{ info.name }}
                </td>
                <td v-else class="px-6 py-4 text-[#2b2b2b] font-semibold">
                  Not Name
                </td>
                <td
                  v-if="info?.user?.credits"
                  class="px-6 py-4 text-[#2b2b2b] font-semibold"
                >
                  {{ info?.user?.credits }}
                </td>
                <td v-else class="px-6 py-4 text-[#6b6b6b] font-semibold">0</td>
                <td>
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton
                      @click="openModal(info)"
                      color="info"
                      label="Add Credits"
                      class="mb-2"
                    >
                    </BaseButton>
                    <BaseButton
                      @click="openModal(info)"
                      color="info"
                      label="History"
                    >
                    </BaseButton>
                    <!-- <div
                      @click="openModal(info)"
                      class="w-fit flex justify-center cursor-pointer items-center text-white px-3 py-1 shadow-lg rounded-md text-md bg-[#0069e4]"
                    ></div> -->
                  </BaseButtons>
                </td>
              </tr>
            </tbody>
          </template>
        </table>
        <div class="text-center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="perPage"
          ></v-pagination>
        </div>
      </div>
      <v-dialog v-model="modalCredits" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Assign Credits to User
          </v-card-title>
          <div
            class="flex flex-column items-center justify-center flex-wrap gap-3 p-5"
          >
            <template v-if="messageError">
              <div>there is no user related to this organization</div>
            </template>
            <template v-else>
              <div v-if="!messageError" class="flex flex-col items-start">
                <div class="flex items-center justify-beetwen gap-2">
                  <label>Amount</label>
                  <input
                    class="!border-[2px] border-[#111111] rounded-lg shadow-md text-sm"
                    v-model="creditsAmount"
                    type="text"
                  />
                </div>
                <p
                  v-if="errorAmount"
                  class="text-[#f00] mt-3 w-full text-end font-semibold text-xs"
                >
                  {{ errorAmount }}
                </p>
              </div>
              <div v-else>
                <p
                  class="text-[#81d125a9] mt-3 w-full text-end font-semibold text-xs"
                >
                  Credits Assigned
                </p>
              </div>
            </template>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2"
                color="red-darken-1"
                variant="text"
                @click="closeModal"
              >
                Close
              </v-btn>
              <v-btn
                v-if="!messageError || mesaageSuccess"
                @click="assingCreditsToUser"
                class="mr-2"
                color="green-darken-1"
                variant="text"
              >
                Accept
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style>
.loading-edit > div > svg {
  width: auto !important;
  height: auto !important;
}
</style>
