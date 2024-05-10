<script setup>
import {
  mdiArrowLeftDropCircle,
  mdiTrashCan,
  mdiInformation,
  mdiAccountLock,
  mdiAccountLockOpen,
  mdiScaleBalance,
  mdiCheck,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserController from "@/controllers/UserController";
import { computed, ref, watchEffect, onBeforeMount } from "vue";
import ChallengeController from "@/controllers/ChallengeController";
import { reactive } from "vue";
import UtilityMethods from "@/utility/utilityMethods";
import { useSessionStore } from "@/stores/session.js";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const loading = ref(Boolean);

const users = ref([]);
const host = import.meta.env.VITE_IMAGE_HOST;

const selectedUser = ref({});

const searchName = ref("");

const swayScore = ref({});

const snackbar = ref(false);

const selectedId = ref(0);

const checkable = false;

const isModalActive = ref(false);

const perPage = ref(10);

const currentPage = ref(1);

const checkedRows = ref([]);

const sorting = ref({ field: "firstName", order: 1 });

const userDefault = "default/user_default.png";

const modalInfo = ref(false);

const modalSwayInfo = ref(false);

const modalBlockUser = ref(false);

const user = ref({});

const profile = ref({});

const store = useSessionStore();

const itemsPaginated = computed(() => {
  const start = currentPage.value * perPage.value;
  return sortedUsers.value.reverse().slice(start, start + perPage.value);
});

const statusShow = reactive((status) => {
  switch (status) {
    case 0:
      return "Inactive";
    case 1:
      return "Active";
    case 2:
      return "Deleted";
    default:
      return status;
  }
});

const filteredUsers = computed(() => {
  return users.value.filter((item) => {
    return item.firstName.includes(searchName.value);
  });
});

const sortedUsers = computed(() => {
  const { field, order } = sorting.value;
  const start = (currentPage.value - 1) * perPage.value;

  return filteredUsers.value
    .sort((a, b) => {
      if (field === "createdAt") {
        return order * (new Date(a[field]) - new Date(b[field]));
      } else {
        return order * (a[field] < b[field] ? 1 : -1);
      }
    })
    .slice(start, start + perPage.value);
});

const numPages = computed(() =>
  Math.ceil(filteredUsers.value.length / perPage.value)
);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

onBeforeMount(async () => {
  profile.value = await UserController.getMyProfile();
    loading.value = true;
}),
  watchEffect(() => {
    let userId = profile.value.id;
    UserController.getAll(userId).then((data) => {
      users.value = data;
          loading.value = false;
    });
  });

function sort(field) {
  if (sorting.value.field === field) {
    console.log("campo", field);
    sorting.value.order *= -1;
  } else {
    sorting.value.field = field;
    sorting.value.order = 1;
  }
}

function openInfoModal(selected_User) {
  ChallengeController.getUserChallenge(selected_User.id).then((res) => {
    selectedUser.value = res.data.page;
    console.log(selectedUser);
  });
  modalInfo.value = true;
}



function openSwayScoreModal(selected_User) {
  UserController.getSwayScore(selected_User.id).then((res) => {
    swayScore.value = res.value;
    console.log(swayScore);
  });
  modalSwayInfo.value = true;
  console.log(swayScore);
}

function performSearch() {
  // Reiniciar a la primera página al buscar
  currentPage.value = 1;
}

function deleteUser() {
  console.log("deleted", selectedId.value);
  isModalActive.value = false;
  snackbar.value = true;
  // UserController.delete(selectedId.value).then((data) => {
  // isModalActive.value = false;
  // snackbar.value = true;
  //   console.log("delete", data);
  // });
}

async function blockUser() {
  const id = user.value.id;
  const newStatus = !user.value.status == 1;
  const response = await UserController.blockUser(id, newStatus);
  const index = users.value.indexOf(user.value);
  users.value[index].status = response.status;
  modalBlockUser.value = false;
}

async function blockUserChallenge() {
  for (let index = 0; index < selectedUser.value.length; index++) {
    const element = selectedUser.value[index];
    const id = element.id;
    const newStatus = !element.status == 1;
    const response = await UserController.blockUserChallenge(id, newStatus);
    const i = selectedUser.value.indexOf(element);
    element[i].status = response.status;
  }

  modalInfo.value = false;
}

async function checkFile(url) {
  const imgExt = [".GIF", ".MP4", ".MOV"];
  const ext = "." + url.split(".").pop();
  if (imgExt.indexOf(ext.toUpperCase()) < 0) {
    return false;
  } else {
    return true;
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
          <p class="font-extrabold">All Users</p>
          <FormField>
            <FormControl
              @input="performSearch()"
              v-model="searchName"
              :icon="mdiAccountBox"
              value="Search"
            />
          </FormField>
        </div> 
      </div>

        <!-- <div
        v-if="!loading && user.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >  -->
<div v-if="loading" class="flex align-center justify-center h-screen">
      <LoadingSpinner></LoadingSpinner>
    </div>
      
      <CardBox class="mb-6 m" has-table>
        <div>
          <!-- modal delete -->
          <v-dialog v-model="isModalActive" width="auto">
            <v-card>
              <v-card-title class="text-h5"> Delete </v-card-title>
              <v-card-text
                >Are you sure you want to <b>Delete</b> this user?</v-card-text
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
                  @click="deleteUser()"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- modal block user -->
          <v-dialog v-model="modalBlockUser" width="auto">
            <v-card>
              <v-card-title class="text-h5" v-if="user.status">
                Block User
              </v-card-title>
              <v-card-title class="text-h5" v-else> Unblock User </v-card-title>
              <v-card-text v-if="user.status"
                >Are you sure you want to <b>Block</b> this user?</v-card-text
              >
              <v-card-text v-else
                >Are you sure you want to <b>Unblock</b> this user?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red"
                  variant="text"
                  @click="modalBlockUser = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="green-darken-1"
                  variant="text"
                  @click="blockUser()"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- modal info user challenges-->
          <v-dialog v-model="modalInfo" class="w-[600px] h-[900px]">
            <v-card>
              <v-card-title class="text-h5 ml-2"> Detail </v-card-title>
              <v-card-text>
                <div className="w-100 relative my-0 m-auto">
                  <table
                    v-if="selectedUser.length > 0"
                    class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
                  >
                    <thead
                      class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                    >
                      <tr>
                        <th scope="col" class="px-3 py-3">Badge</th>
                        <th scope="col" class="px-6 py-3">Challenge Name</th>
                        <th scope="col" class="px-6 py-3">User Challenge</th>
                        <th scope="col" class="px-6 py-3">
                          Block User Challenge
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="user in selectedUser"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <TableCheckboxCell
                          v-if="checkable"
                          @checked="checked($event, client)"
                        />

                        <td class="px-3 py-4 w-[80px] h-[80px]">
                          <img
                            class="w-full object-cover"
                            :src="host + user.challenge.badge"
                            alt="Badge of challenge"
                          />
                        </td>
                        <td class="px-3 py-4 w-[200px] h-[200px]">
                          {{ user.challenge.name }}
                        </td>
                        <td class="px-3 py-4 w-[80px] h-[80px]">
                          <img
                            v-if="!checkFile(user.url)"
                            class="w-full object-cover"
                            :src="host + user.challenge.badge"
                            alt="Badge of challenge"
                          />
                          <video
                            v-else
                            class="w-full object-coverrounded-lg shadow-2xl object-center"
                            :src="host + user.url"
                            style="max-width: 300px"
                            autoplay
                            loop
                            controls
                          />
                        </td>
                        <td class="px-3 py-4 w-[80px] h-[80px]">
                          <BaseButton
                            class="ml-5"
                            :color="
                              user.status == 1 ? 'success' : 'bg-gray-300'
                            "
                            :icon="user.status == 1 ? mdiCheck : mdiClose"
                            small
                            @click="blockUserChallenge()"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else>
                    <p>No user challenges to show</p>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-2"
                  color="red-darken-1"
                  variant="text"
                  @click="modalInfo = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


      
          <!-- modal info Swayscore-->
          <v-dialog v-model="modalSwayInfo" width="auto">
            <v-card>
              <v-card-title class="text-h5 ml-2"> Sway Score</v-card-title>
              <v-card-text>
                <div className="w-80 relative my-0 m-auto">
                  <p>Sway Score: {{ swayScore }}</p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-2"
                  color="red-darken-1"
                  variant="text"
                  @click="modalSwayInfo = false"
                >
                  Close
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
                  <th scope="col" class="w-20 px-6 py-3">
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
                  <th scope="col" class="w-20 px-6 py-3">
                    <div class="flex items-center">
                      Sway score
                      <a @click="sort('sway')"
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
                      Registered
                      <a @click="sort('createdAt')"
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
                  <th scope="col" class="w-12 px-6 py-3">
                    <div class="flex items-center">Challenges Completed</div>
                  </th>
                  <th scope="col" class="w-20 px-6 py-3">
                    <span class="text-center">Sway Score</span>
                  </th>
                  <th scope="col" class="col-auto px-6 py-3">
                    <span class="text-center">Actions</span>
                  </th>
                </tr>
                
              </thead>
              <tbody>
                <tr
                  v-for="client in sortedUsers"
                  :key="client.id"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCheckboxCell
                    v-if="checkable"
                    @checked="checked($event, client)"
                  />

                  <th
                    v-if="client.image && client.imagen.match(/.*\..{2,5}/)"
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <!-- <UserAvatar
                      :username="`${host}${client.imagen}`"
                      class="w-24 h-24 mx-auto lg:w-6 lg:h-6"
                    /> -->
                    <img
                      class="rounded-full"
                      :src="host + client.imagen"
                      alt=""
                    />
                  </th>
                  <th
                    v-else
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img :src="host + userDefault" alt="" />
                  </th>
                  <td class="px-6 py-4">
                    {{ `${client.firstName} ${client.lastName || ""}` }}
                  </td>
                  <td class="px-6 py-4">
                    {{ statusShow(client.status) }}
                  </td>
                  <td class="px-6 py-4">
                    {{ client.sway }}
                  </td>
                  <td class="px-6 py-4">
                    {{ UtilityMethods.formatDate(client.createdAt) }}
                  </td>
                  <td class="px-6 py-4">
                    <BaseButton
                      color="info"
                      :icon="mdiInformation"
                      small
                      @click="openInfoModal(client)"
                      class="m-2"
                    />
                  </td>
                  <td class="px-6 py-4 text-right flex row">
                    <BaseButton
                      color="info"
                      :icon="mdiScaleBalance"
                      small
                      @click="openSwayScoreModal(client)"
                      class="m-2 via-violet-500"
                    />
                  </td>
                  <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                      <BaseButton
                        v-if="profile.rol === 'admin'"
                        color="danger"
                        :icon="mdiTrashCan"
                        small
                        @click="
                          {
                            isModalActive = true;
                            selectedId = client.id;
                          }
                        "
                      />
                      <BaseButton
                        class="ml-5"
                        :color="client.status == 1 ? 'success' : 'bg-gray-300'"
                        :icon="
                          client.status == 1
                            ? mdiAccountLockOpen
                            : mdiAccountLock
                        "
                        small
                        @click="
                          {
                            modalBlockUser = true;
                            user = client;
                          }
                        "
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
            <BaseLevel>
              <v-pagination
                :length="pagesList.length"
                color="black"
                :total-visible="10"
                v-model="currentPage"
              ></v-pagination>
            </BaseLevel>
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
