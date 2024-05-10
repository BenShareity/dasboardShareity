<script setup>
import { ref, watchEffect, onMounted, watch } from "vue";
import { mdiArrowLeftDropCircle, mdiPlus, mdiCartOutline } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SponsorController from "@/controllers/SponsorController";
import DashboardController from "@/controllers/DashboardController";
import { useRouter } from "vue-router";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import { computed } from "vue";
import UserController from "@/controllers/UserController";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import { useAlertStore } from "@/stores/alerts";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

const host = import.meta.env.VITE_IMAGE_HOST;
const sponsors = ref([]);
const router = useRouter();
const role = ref();
const selecteFilter = ref(null);
const itemsScroll = ref(18);
const pages = ref(0);
const showLoad = ref(true);
const searchItem = ref("");

const loading = ref(Boolean);
const modalActive = ref(false);
const modalApprove = ref(false);
const statusFilter = ref({
  label: [],
});
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
const statusEnum = ref({
  0: "Inactive",
  1: "Active",
  5: "Unregisterd",
  3: "Not validated",
  undefined: "Invalid",
});
const sponsorId = ref({});
const filterData = computed(() => searchData());
const searchName = ref("");
const defaultLogo = "sponsor/default.png";
const profile = ref({});

const errorAdminAlert = ref(null);
const alertStore = useAlertStore();

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();

  role.value = profile.value.rol;
  console.log(profile.value);

  if (role.value === "cause") {
    await UserController.adminApprove()
      .then((res) => {})
      .catch((err) => {
        errorAdminAlert.value = err.response.data.message;
        return;
      });
    return;
  }
});

function searchData() {
  return sponsors.value.filter(
    (sponsor) =>
      sponsor.name.includes(searchName.value) &&
      (statusFilter?.value.label.length === 0
        ? true
        : statusFilter?.value.label.includes(calcualteStatusSponsor(sponsor)))
  );
}

function calcualteStatusSponsor(sponsor) {
  if (sponsor.status == 5)
    console.log(
      "SI hay pajo pero teienen admin approve = " + sponsor.adminApprove
    );
  if (!sponsor.adminApprove) return "Unapproved";
  return statusEnum.value[sponsor.status] || sponsor.status;
}
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
function goEdit(id) {
  router.push({
    name: "create-sponsor",
    query: {
      id: id,
    },
  });
}
function adminApproveAlert() {
  alertStore.createAlert({
    title: "It has not yet been approved",
    color: "error",
    icon: "$warning",
    text: errorAdminAlert.value,
  });
}
async function activateSponsor() {
  const id = sponsorId.value.id;
  const response = await SponsorController.update(id, {
    status: !sponsorId.value.status,
  });
  console.log(response);
  const index = sponsors.value.indexOf(sponsorId.value);
  sponsors.value[index].status = response.status;
  modalActive.value = false;
}

async function approveSponsor() {
  console.log(sponsorId.value.id);
  const response = await DashboardController.updateSponsor({
    id: sponsorId.value.id,
    adminApprove: 1,
  });
  const index = sponsors.value.indexOf(sponsorId.value);
  sponsors.value[index].adminApprove = response.adminApprove;
  modalApprove.value = false;
}

// watch(searchItem, async (newQuestion, oldQuestion) => {
//   if (!newQuestion) {
//     index();
//   } else {
//     getDataSearch();
//   }
// });

// const getDataSearch = async () => {
//   if (!searchItem) {
//     console.log("se acabo la busqueda :>> ");
//   }
//   showLoad.value = [];
//   let data = {
//     search: searchItem.value,
//     items: itemsScroll.value,
//   };
//   const res = await SponsorController.getData(data);

//   sponsors.value = res.page;
//   showLoad.value = false;
// };

const index = async () => {
  // loading.value = true;
  // showLoad.value = true;
  // let dataI = {
  //   page: 1,
  //   items: itemsScroll.value,
  // };
  try {
    await SponsorController.getAllDashboard().then((data) => {
      sponsors.value = data;
      loading.value = false;
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

// const load = async () => {
//   showLoad.value = true;
//   if (sponsors.value.length >= 18) {
//     pages.value++;
//     let dataI = {
//       page: pages.value,
//       items: itemsScroll.value,
//     };
//     console.log("pages.value :>> ", pages.value);
//     console.log("itemsScroll.value :>> ", itemsScroll.value);
//     try {
//       await SponsorController.getAllDashboard(dataI).then((data) => {
//         console.log("data :>> ", data);
//         sponsors.value = [...sponsors.value, ...data.page];
//         console.log("causes.value :>> ", sponsors.value);
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
      <!-- Activate/deactivate sponsor -->
      <v-dialog v-model="modalActive" width="auto">
        <v-card>
          <v-card-title class="text-h5" v-if="sponsorId.status">
            Activate Sponsor?
          </v-card-title>
          <v-card-title class="text-h5" v-else>
            Deactivate Sponsor?
          </v-card-title>
          <v-card-text v-if="sponsorId.status"
            >Are you sure you want to <b>Activate</b> this sponsor?</v-card-text
          >
          <v-card-text v-else
            >Are you sure you want to <b>Deactivate</b> this
            sponsor?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="text" @click="modalActive = false">
              Disagree
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="activateSponsor()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Approve sponsors -->
      <v-dialog v-model="modalApprove" width="auto">
        <v-card>
          <v-card-title class="text-h5"> Approve Sponsor? </v-card-title>
          <v-card-text
            >Are you sure you want to <b>Approve</b> this sponsor?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="text" @click="modalApprove = false">
              Disagree
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="approveSponsor()"
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
          <p class="lg:text-xl text-lg">Sponsors</p>

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
            v-show="role === 'cause' || role === 'admin'"
            class="mr-5"
            label="Add Sponsor"
            color="info"
            @click="adminApproveAlert"
            :icon="mdiPlus"
          />
          <BaseButton
            v-else
            v-show="role === 'cause' || role === 'admin'"
            class="mr-5"
            label="Add Sponsor"
            color="info"
            :icon="mdiPlus"
            to="/create-sponsor"
          />
        </div>
      </div>
      <!-- <CardBox class="flex items-center justify-center h-auto">
          <BaseButton
            label="Add Sponsor"
            color="info"
            :icon="mdiPlus"
            to="/create-sponsor"
          />
        </CardBox> -->
      <div
        v-if="!loading && sponsors.length == 0"
        class="grid min-w-[50%] gap-6 mb-6"
      >
        <CardBoxWidget
          label="It seems that there are no sponsor related to you yet :("
          content='You can create a sponsor by clicking on the "+ Add sponsor" button!'
        />
      </div>
      <div
        v-if="!loading && sponsors.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        <CardBox v-for="sponsor in filterData" :key="sponsor.id">
          <CardBoxComponentTitle title="With title & icon">
            <div class="flex justify-between mb-2">
              <p class="font-extrabold text-lg">{{ sponsor.name }}</p>
              <div class="flex items-center flex-col">
                <h2 class="text-xs text-gray-700">Status</h2>
                <p
                  class="text-xs text-gray-500"
                  v-text="calcualteStatusSponsor(sponsor)"
                />
                <p
                  class="text-[11px] text-gray-500"
                  v-if="!sponsor.personEmail"
                >
                  Email not registered
                </p>
              </div>
            </div>
          </CardBoxComponentTitle>
          <div v-if="sponsor.logo" class="flex grid-cols-3">
            <img
              class="col-span-1 mr-3 object-cover rounded-md"
              :src="host + sponsor.logo"
              style="height: 64px; width: 64px"
            />
          </div>
          <div v-else class="flex grid-cols-3">
            <img
              class="col-span-1 mr-3"
              :src="host + defaultLogo"
              style="height: 64px; width: 64px"
            />
          </div>
          <template v-if="role === 'admin'">
            <BaseButton
              v-if="sponsor.adminApprove == 1"
              class="mt-3 text-lg font-bold italic mr-2"
              small
              :label="sponsor.status ? 'Deactivate' : 'Activate'"
              :color="sponsor.status ? 'danger' : 'success'"
              @click="
                {
                  modalActive = true;
                  sponsorId = sponsor;
                }
              "
            />
            <BaseButton
              v-else
              :disabled="!sponsor.personEmail"
              v-show="role === 'admin'"
              class="mt-3 text-lg font-bold italic mr-2"
              small
              label="Approve"
              color="info"
              @click="
                {
                  modalApprove = true;
                  sponsorId = sponsor;
                }
              "
            />
          </template>
          <!-- <BaseButton v-if="errorAdminAlert" v-show="role === 'sponsor' || role === 'admin'"
            class="mt-3 text-lg font-bold italic" small label="Edit" color="info" @click="adminApproveAlert" /> -->
          <BaseButton
            v-if="role === 'admin'"
            class="mt-3 text-lg font-bold italic"
            small
            label="Edit"
            color="info"
            @click="goEdit(sponsor.id)"
          />
          <BaseButton
            v-if="role === 'sponsor' && sponsor.status != 1"
            class="mt-3 text-lg font-bold italic"
            small
            label="Edit"
            color="info"
            @click="goEdit(sponsor.id)"
          />
        </CardBox>
      </div>
    </SectionMain>

    <!-- <div v-if="!loading" class="flex justify-center h-10">
      <InfiniteLoading @infinite="load()" />
    </div> -->
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
