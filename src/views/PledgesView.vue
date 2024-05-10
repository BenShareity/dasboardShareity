<script setup>
import { mdiArrowLeftDropCircle, mdiClose, mdiCheck } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserController from "@/controllers/UserController";
import { computed, ref, watchEffect, watch } from "vue";
import { reactive } from "vue";
import { useSessionStore } from "@/stores/session.js";
import PledgesController from "@/controllers/PledgesController";
import { onMounted } from "vue";


const sessionStore = useSessionStore();
const usersPledges = ref([]);
const profile = ref({});
const host = import.meta.env.VITE_IMAGE_HOST;
const snackbar = ref(false);
const selectedId = ref(0);
const checkable = false;
const checkedRows = ref([]);
const sorting = ref({ field: "firstName", order: 1 });
const userDefault = "../../assets/user.png";
const modalAccept = ref(false);
const modalRejectActivePledge = ref(false);
const modalRejectDesactivePledge = ref(false);
const dataPages = ref([]);
const perPage = ref(10);
const currentPage = ref(1);
const totalPages = ref(0);
const user = ref({});
const counter = ref(1);
const sizeArray = ref(0);
const idPledge = ref({});
const statusPledge = ref(null);
const loading = ref(Boolean);


const itemsPaginated = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return usersPledges.value
    .sort((a, b) => {
      if (sorting?.value?.field === "status") {
        console.log(a);
        console.log("Holaa");
        return (a?.isActDonat > b?.isActDonat ? 1 : -1) * sorting.value.order;
      } else if (sorting.value.field === "description") {
        return (
          (a?.description && a?.isActDonat > b?.isActDonat ? 1 : -1) *
          sorting.value.order
        );
      } else if (sorting.value.field === "amount") {
        return (a?.amount < b?.amount ? 1 : -1) * sorting.value.order;
      }
    })
    .slice(start, start + perPage.value);
});

// const statusShow = reactive((status) => {
//   switch (status) {
//     case 0:
//       return "Inactive";
//     case 1:
//       return "Active";
//     case 2:
//       return "Deleted";
//     default:
//       return "Unknown";
//   }
// });

const urlBucket = import.meta.env.VITE_IMAGE_HOST;

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();
    loading.value = true;

  PledgesController.getAll(sessionStore.getUserId()).then((data) => {
    usersPledges.value = data;
    loading.value = false;
    console.log(usersPledges.value);
    totalPages.value = Math.ceil(data.length / perPage.value);
  });
  // statusPledge.value;
});


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
const handleClickStatus = (pledge) => {
  console.log(pledge);
  if (pledge.isActDonat === 1) {
    modalRejectDesactivePledge.value = true;
    return (idPledge.value = pledge);
  }
  if (pledge.isActDonat === 0 || pledge.isActDonat === null) {
    modalRejectActivePledge.value = true;
    return (idPledge.value = pledge);
  }
  return;
};
const pledgesStatusActive = async () => {
  console.log(idPledge);
  const response = await PledgesController.approvePledges({
    idPledge: idPledge.value.id,
    status: !idPledge.value.isActDonat,
  });
  let index = usersPledges.value.indexOf(idPledge.value);
  usersPledges.value[index].isActDonat = response.isActDonat;
  modalRejectActivePledge.value = false;
  // return;
};
const pledgesStatusDesactive = async () => {
  const response = await PledgesController.approvePledges({
    idPledge: idPledge.value.id,
    status: !idPledge.value.isActDonat,
  });
  let index = usersPledges.value.indexOf(idPledge.value);
  usersPledges.value[index].isActDonat = response.isActDonat;
  modalRejectDesactivePledge.value = false;
};

async function blockUser() {}
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
          <p class="font-extrabold">Pledges</p>
        </div>
      </div>
      <CardBox class="mb-6 m" has-table>
        <div>
          <!-- modal accept donation -->
          <v-dialog v-model="modalAccept" width="auto">
            <v-card>
              <v-card-title class="text-h5">
                Accept {{ user.firstName }} donation
              </v-card-title>
              <v-card-text
                >Surely do you want to accept this donation?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green-darken-1"
                  variant="text"
                  @click="modalAccept = false"
                >
                  Disagree
                </v-btn>
                <v-btn color="red" variant="text" @click="blockUser()">
                  Agree
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- modal reject Active donation -->
          <v-dialog v-model="modalRejectActivePledge" width="auto">
            <v-card>
              <v-card-title class="text-h5">
                Active {{ user.firstName }} donation
              </v-card-title>
              <v-card-text
                >Surely do you want to reject this donation?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red"
                  variant="text"
                  @click="modalRejectActivePledge = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="green-darken-1"
                  s
                  variant="text"
                  @click="pledgesStatusActive()"
                >
                  APPROVE
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- modal reject Desactive donation -->
          <v-dialog v-model="modalRejectDesactivePledge" width="auto">
            <v-card>
              <v-card-title class="text-h5">
                Desactive
                {{ user.firstName }} donation
              </v-card-title>
              <v-card-text
                >Surely do you want to reject this donation?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green-darken-1"
                  variant="text"
                  @click="modalRejectDesactivePledge = false"
                >
                  Approve
                </v-btn>
                <v-btn
                  color="red"
                  variant="text"
                  @click="pledgesStatusDesactive()"
                >
                  Deny
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

            <div v-if="loading" class="flex align-center justify-center h-screen">
      <LoadingSpinner></LoadingSpinner>
    </div>
            <table v-if="!loading"
              class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="w-12 px-6 py-3">Profile Picture</th>
                  <th scope="col" class="px-6 py-3">
                    <div class="flex items-center">
                      Name
                      <a @click="sort('firstName')">
                        <svg
                          class="w-3 h-3 ml-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3">
                    <div class="flex items-center">
                      DESCRIPTION
                      <a @click="sort('description')"
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
                      </a>
                    </div>
                  </th>
                  <th scope="col" class="w-20 px-6 py-3">
                    <div class="flex items-center">
                      Amont
                      <a @click="sort('amount')"
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
                      </a>
                    </div>
                  </th>
                  <th scope="col" class="col-auto px-6 py-3">
                    <div class="flex items-center">
                      Status
                      <a @click="sort('status')"
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
                      </a>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pledge, index) in itemsPaginated"
                  :key="index"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCheckboxCell
                    v-if="checkable"
                    @checked="checked($event, pledge)"
                  />

                  <th
                    v-if="pledge?.image && pledge?.imagen.match(/.*\..{2,5}/)"
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      class="rounded-full"
                      :src="host + pledge?.imagen"
                      alt=""
                    />
                  </th>
                  <th
                    v-else
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      :src="`${
                        pledge?.imagen != null
                          ? urlBucket + pledge?.imagen
                          : userDefault
                      }`"
                      class="rounded-full w-12 h-12"
                    />
                  </th>
                  <td class="px-6 py-4">
                    {{ `${pledge?.user?.firstName} ${pledge?.lastName || ""}` }}
                  </td>
                  <td class="px-6 py-4">{{ pledge?.description }}</td>
                  <td class="px-6 py-4">{{ pledge?.amount }}</td>

                  <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                      <BaseButton
                        v-if="profile.rol != 'admin'"
                        v-show="
                          pledge.isActDonat === 0 || pledge.isActDonat === null
                        "
                        color="success"
                        label="Acepted"
                        small
                        @click="handleClickStatus(pledge)"
                      />
                      <BaseButton
                        v-if="profile.rol != 'admin'"
                        v-show="pledge.isActDonat === 1"
                        color="danger"
                        label="Unapcepted"
                        small
                        @click="handleClickStatus(pledge)"
                      />
                      <div v-else>
                        <p
                          v-if="
                            pledge?.isActDonat === 0 ||
                            pledge?.isActDonat === null
                          "
                          class="text-red-600"
                        >
                          Unapcepted
                        </p>
                        <p v-else class="text-green-600">Acepted</p>
                      </div>
                    </BaseButtons>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 
          <nav class="w-full p-5">
            <ul class="flex items-center justify-center gap-4">
              <li
                class="p-0 w-11 h-11 flex justify-center align-center rounded-circle text-base text-center text-gray-600 cursor-pointer shadow-lg hover:bg-neutral-200"
                v-if="currentPage != 1"
                @click="currentPage--"
              >
                <svg
                  class="block w-4 h-4 fill-current"
                  viewBox="0 0 256 512"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path
                    d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"
                  ></path>
                </svg>
              </li>
              <li
                class="p-3 w-16 rounded-lg text-lg text-center text-gray-700 cursor-pointer shadow-lg hover:bg-neutral-200"
                v-for="pages in pagesHola.slice(
                  pagesHola.length - 10,
                  pagesHola.length
                )"
                :class="isActivePagesColor(pages)"
                @click="currentPage = pages"
              >
                {{ pages }}
              </li>
              <template v-if="pagesHola.length <= sizeArray - 10">
                <div class="flex h-[52px] justify-end items-end">
                  <div class="text-md tracking-[3px]">...</div>
                </div>
                <span
                  class="p-3 w-16 rounded-lg text-lg text-center text-gray-700 cursor-pointer shadow-lg hover:bg-neutral-200"
                  @click="currentPage = pages"
                  >{{ dataPages.length }}</span
                >
                <li
                  class="p-0 w-11 h-11 flex justify-center align-center rounded-circle text-base text-center text-gray-600 cursor-pointer shadow-lg hover:bg-neutral-200"
                  @click="holaFunc"
                >
                  <svg
                    class="block w-4 h-4 fill-current"
                    viewBox="0 0 256 512"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <path
                      d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"
                    ></path>
                  </svg>
                </li>
              </template>
            </ul>
          </nav> -->
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
    <v-snackbar v-model="snackbar" :timeout="3000" color="red">
      <p class="text-lg italic font-bold">User has been <b>Deleted</b></p>

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </LayoutAuthenticated>
</template>
<style>
.button {
  display: flex;
  align-items: center !important;
}
</style>
