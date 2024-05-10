<script setup>
import {
  onBeforeMount,
  computed,
  ref,
  watchEffect,
  watch,
  onMounted,
} from "vue";
import { mdiArrowLeftDropCircle, mdiPlus } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import OrganizationController from "@/controllers/OrganizationController";
import DashboardController from "@/controllers/DashboardController";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import UserController from "@/controllers/UserController";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import SponsorController from "@/controllers/SponsorController";
import { useAlertStore } from "@/stores/alerts";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

const host = import.meta.env.VITE_IMAGE_HOST;
const store = useSessionStore();

const causes = ref([]);
const causeId = ref({});
const selecteFilter = ref(null);
const modalActive = ref(false);
const modalApprove = ref(false);
const loading = ref(false);
const loadingData = ref(false);
const role = ref();
const itemsScroll = ref(18);
const pages = ref(0);
const showLoad = ref(true);

const filterData = computed(() => searchData());
const dataSearch = ref([]);
const searchItem = ref("");
const searchName = ref("");
const data = ref("");
let searcData = ref("");
const alertStore = useAlertStore();
const profile = ref({});
const status = ref([
  {
    label: "Active",
  },
  {
    label: "Inactive",
  },
  {
    label: "Unregisterd",
  },
  {
    label: "Unapproved",
  },
]);
const defaultLogo = "organization/default.png";
const titleDefault = "Missing Organization";
const adminApproveModal = ref(false);

const errorAdminAlert = ref(null);
const statusFilter = ref({
  label: [],
});
const statusEnum = ref({
  0: "Inactive",
  1: "Active",
  5: "Unregisterd",
  3: "Not validated",
  undefined: "Invalid",
});

// watch(searchItem, async (newQuestion, oldQuestion) => {
//   if (!newQuestion) {
//     index();
//   } else {
//     getDataSearch();
//   }
// });
function searchData() {
  return causes.value.filter((cause) =>
    statusFilter?.value.label.length === 0
      ? true
      : statusFilter?.value.label.includes(calculateStatusCause(cause))
  );
}
function calculateStatusCause(cause) {
  if (cause.status == 5) if (!cause.adminApprove) return "Unapproved";
  return statusEnum.value[cause.status] || cause.status;
}
// const getDataSearch = async () => {
//   if (!searchItem) {
//     console.log("se acabo la busqueda :>> ");
//   }
//   causes.value = [];
//   let data = {
//     search: searchItem.value,
//     items: itemsScroll.value,
//   };
//   const res = await OrganizationController.getData(data);

//   causes.value = res.page;
//   showLoad.value = false;
// };

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();

  console.log(profile.value);
  role.value = profile.value.rol;

  if (profile.value.rol === "sponsor") {
    console.log("este", role.value);
    await UserController.adminApprove()
      .then((res) => {})
      .catch((err) => {
        errorAdminAlert.value = err.response.data.message;
      });
    return;
  }
});
function multiSelectStatus(param) {
  if (param == "Deselect All") {
    statusFilter.value.label = [];
    selecteFilter.value = null;
  } else if (statusFilter.value.label.includes(param)) {
    const index = statusFilter.value.label.indexOf(param);
    statusFilter.value.label.splice(index, 1);
    selecteFilter.value = statusFilter.value.label.slice(0, 1).toString();
    console.log(selecteFilter.value);
    if (!statusFilter.value.label.length) {
      selecteFilter.value = null;
      console.log("hoa");
    }
  } else {
    statusFilter.value.label.push(param);
  }
}
function adminApproveAlert() {
  alertStore.createAlert({
    title: "It has not yet been approved",
    color: "error",
    icon: "$warning",
    text: errorAdminAlert.value,
  });
}
onBeforeMount(async () => {
  role.value = store.getUserRole();
});

const router = useRouter();

function goEdit(id) {
  router.push({
    name: "create-cause",
    query: {
      id: id,
    },
  });
}

async function activateCause() {
  const id = causeId.value.id;
  const response = await OrganizationController.update(id, {
    status: !causeId.value.status,
  });
  const index = causes.value.indexOf(causeId.value);
  causes.value[index].status = response.status;
  modalActive.value = false;
}

async function approveCause() {
  const response = await DashboardController.updateOrganization({
    id: causeId.value.id,
    adminApprove: 1,
  });
  console.log(response);
  const index = causes.value.indexOf(causeId.value);
  causes.value[index].adminApprove = response.adminApprove;
  modalApprove.value = false;
}
const index = async () => {
  // loading.value = true;
  // showLoad.value = true;
  // let dataI = {
  //   page: 1,
  //   items: itemsScroll.value,
  // };
  try {
    await OrganizationController.getDashboard().then((data) => {
      causes.value = data;
      loading.value = false;
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};
// const load = async () => {
//   showLoad.value = true;
//   if (causes.value.length >= 18) {
//     pages.value++;
//     let dataI = {
//       page: pages.value,
//       items: itemsScroll.value,
//     };
//     console.log("pages.value :>> ", pages.value);
//     console.log("itemsScroll.value :>> ", itemsScroll.value);
//     try {
//       await OrganizationController.getDashboard(dataI).then((data) => {
//         console.log("data :>> ", data);
//         causes.value = [...causes.value, ...data.page];
//         console.log("causes.value :>> ", causes.value);
//       });
//     } catch (error) {
//       console.log("error :>> ", error);
//     }
//   }
// };

onMounted(() => {
  index();
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Activate/deactivate cause -->

      <v-dialog v-model="modalActive" width="auto">
        <v-card>
          <v-card-title class="text-h5" v-if="causeId.status">
            Activate Cause?
          </v-card-title>
          <v-card-title class="text-h5" v-else>
            Deactivate Cause?
          </v-card-title>
          <v-card-text v-if="causeId.status"
            >Are you sure you want to <b>Activate</b> this cause?</v-card-text
          >
          <v-card-text v-else
            >Are you sure you want to <b>Deactivate</b> this cause?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="text" @click="modalActive = false">
              Disagree
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="activateCause()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Approve cause -->
      <v-dialog v-model="modalApprove" width="auto">
        <v-card>
          <v-card-title class="text-h5">Approve Cause? </v-card-title>

          <v-card-text
            >Are you sure you want to <b>Approve</b> this cause?</v-card-text
          >

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="text" @click="modalApprove = false">
              Disagree
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="approveCause()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton
            to="/dashboard"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="lg:text-xl text-lg">Causes</p>
          <div
            v-if="profile.rol === 'admin'"
            class="flex items-center justify-center gap-2"
          >
            <select
              id=""
              class="shadow-lg rounded-lg"
              v-model="selecteFilter"
              @change="multiSelectStatus(selecteFilter)"
            >
              <option
                :value="null ? selecteFilter : null"
                v-if="!selecteFilter"
              >
                Select Status
              </option>
              <option
                v-for="selectMultiStatus in status"
                :class="
                  statusFilter?.label.includes(selectMultiStatus.label)
                    ? 'bg-gray-200/90'
                    : ''
                "
              >
                {{ selectMultiStatus.label }}
              </option>
            </select>
            <div
              v-if="statusFilter.label.length > 0"
              class="flex gap-[6px] items-center justify-center"
            >
              <input
                class="hidden shadow-lg p-2 rounded cursor-pointer hover: border border-sky-700"
                type="checkbox"
                name="check"
                id="check"
                @change="multiSelectStatus('Deselect All')"
              />
              <label
                for="check"
                class="bg-red-400/90 text-center text-white shadow-lg font-medium rounded-lg w-6 hover:bg-red-500 cursor-pointer"
                >X</label
              >
              <span>{{
                statusFilter.label.slice(0, 2).join(" ").toString()
              }}</span>
              <span
                v-if="statusFilter.label.length > 2"
                class="text-gray-400 text-sm"
              >
                (+{{ statusFilter.label.length - 2 }} others)
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center edit-search">
          <FormField>
            <FormControl
              v-model="searchName"
              :icon="mdiAccountBox"
              value="Search"
            />
          </FormField>
          <BaseButton
            v-if="errorAdminAlert"
            v-show="role === 'sponsor' || role === 'admin'"
            @click="adminApproveAlert"
            class="mr-5"
            label="Add Cause"
            color="info"
            :icon="mdiPlus"
          />
          <BaseButton
            v-else
            v-show="role === 'sponsor' || role === 'admin'"
            class="mr-5"
            label="Add Cause"
            color="info"
            :icon="mdiPlus"
            to="/create-cause"
          />
        </div>
      </div>
      <!-- <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Causes" main>
        <div></div>
      </SectionTitleLineWithButton> -->
      <div
        v-if="!loading && causes.length == 0"
        class="grid min-w-[50%] gap-6 mb-6"
      >
        <CardBoxWidget
          :icon="mdiCartOutline"
          label="It seems that there are no Causes related to you yet :("
          content='You can connect a Cause by clicking on the "+ Add cause" button'
        />
      </div>
      <div
        v-if="!loading && causes.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        <!-- <CardBox class="flex items-center justify-center h-auto">
          <BaseButton
            label="Add Cause"
            color="info"
            :icon="mdiPlus"
            to="/create-cause"
          />
        </CardBox> -->

        <CardBox class="max-h-52" v-for="cause in filterData" :key="cause.id">
          <CardBoxComponentTitle title="With title & icon">
            <div v-if="cause.name" class="flex justify-between mb-2">
              <p class="font-extrabold text-lg">{{ cause.name }}</p>
              <div class="flex items-center flex-col">
                <h2 class="text-xs text-gray-700">Status</h2>
                <p
                  class="text-xs text-gray-500"
                  v-text="calculateStatusCause(cause)"
                />
              </div>
            </div>
          </CardBoxComponentTitle>
          <div class="grid grid-cols-3">
            <img
              v-if="!cause.logo"
              class="col-span-1 mr-3"
              :src="host + defaultLogo"
              style="height: 64px; width: 64px"
            />
            <img
              v-else
              class="col-span-1 mr-3"
              :src="host + cause.logo"
              style="height: 64px; width: 64px"
            />
            <p class="text-sm font-light col-span-2 line-clamp-4">
              {{ cause.description }}
            </p>
          </div>
          <template v-if="role === 'admin'">
            <BaseButton
              v-if="cause.adminApprove == true"
              v-show="role === 'admin'"
              class="mt-3 text-lg font-bold italic mr-2"
              small
              :label="cause.status ? 'Deactivate' : 'Activate'"
              :color="cause.status ? 'danger' : 'success'"
              @click="
                {
                  modalActive = true;
                  causeId = cause;
                }
              "
            />
            <BaseButton
              v-else
              class="mt-3 text-lg font-bold italic mr-2"
              small
              label="Approve"
              color="info"
              @click="
                {
                  modalApprove = true;
                  causeId = cause;
                }
              "
            />
          </template>
          <BaseButton
            v-if="role === 'admin'"
            class="mt-3 text-lg font-bold italic"
            small
            label="Edit"
            color="info"
            @click="goEdit(cause.id)"
          />
          <BaseButton
            v-if="role === 'cause' && cause?.status != 1"
            class="mt-3 text-lg font-bold italic"
            small
            label="Edit"
            color="info"
            @click="goEdit(cause.id)"
          />
        </CardBox>
      </div>
      <!-- <div v-if="!loading && showLoad" class="flex justify-center h-10">
        <InfiniteLoading @infinite="load()" />
      </div> -->
    </SectionMain>
    <div v-if="loading" class="flex align-center justify-center h-screen">
      <LoadingSpinner></LoadingSpinner>
    </div>
  </LayoutAuthenticated>
</template>
<style scoped>
.edit-search > .mb-6 {
  margin-bottom: 0px !important;
}
</style>
