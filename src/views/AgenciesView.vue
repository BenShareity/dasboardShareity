<script setup>
import {
  onBeforeMount,
  computed,
  ref,
  watchEffect,
  onMounted,
  watch,
} from "vue";
import { mdiArrowLeftDropCircle, mdiPlus } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import DashboardController from "@/controllers/DashboardController";
import { useRouter } from "vue-router";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import UserController from "@/controllers/UserController";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import AgencyController from "@/controllers/AgencyController";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

const host = import.meta.env.VITE_IMAGE_HOST;

const agencies = ref([]); // agency
let c = ref({});
const agencyId = ref({}); //agencyId
const modalActive = ref(false);
const modalApprove = ref(false);
const loading = ref(Boolean);
const role = ref();
const filterData = computed(() => searchData());
const searchName = ref("");
const profile = ref({});
const router = useRouter();
const itemsScroll = ref(18);
const pages = ref(0);
const searchItem = ref("");
const showLoad = ref(true);

function searchData() {
  return agencies.value.filter((agency) => {
    agency.name?.includes(searchName.value), console.log(agency.name);
  });
}

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();
  role.value = profile.value.rol;

  loading.value = false;
});

function goEdit(id) {
  router.push({
    name: "create-agency",
    query: {
      id: id,
    },
  });
}

async function activateAgency() {
  const id = agencyId.value.id;

  const response = await AgencyController.update(id, {
    status: !agencyId.value.status,
  });
  console.log(agencies);
  const index = agencies.value.indexOf(agencyId.value);
  agencies.value[index].status = response.status;
  modalActive.value = false;
}

async function approveAgency() {
  const response = await DashboardController.updateAgency({
    id: agencyId.value.id,
    adminApprove: 1,
  });
  const index = agencies.value.indexOf(agencyId.value);
  agencies.value[index].adminApprove = response.adminApprove;
  modalApprove.value = false;
}
watch(searchItem, async (newQuestion, oldQuestion) => {
  if (!newQuestion) {
    index();
  } else {
    getDataSearch();
  }
});
const getDataSearch = async () => {
  if (!searchItem) {
    console.log("se acabo la busqueda :>> ");
  }
  agencies.value = [];
  let data = {
    search: searchItem.value,
    items: itemsScroll.value,
  };
  const res = await AgencyController.getData(data);

  agencies.value = res.page;
  showLoad.value = false;
};
const load = async () => {
  showLoad.value = true;
  if (agencies.value.length >= 18) {
    pages.value++;
    let dataI = {
      page: pages.value,
      items: itemsScroll.value,
    };
    console.log("pages.value :>> ", pages.value);
    console.log("itemsScroll.value :>> ", itemsScroll.value);
    try {
      await AgencyController.getAll(dataI).then((data) => {
        console.log("data :>> ", data);
        agencies.value = [...agencies.value, ...data.page];
        console.log("causes.value :>> ", agencies.value);
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  }
};
const index = async () => {
  loading.value = true;
  showLoad.value = true;
  let dataI = {
    page: 1,
    items: itemsScroll.value,
  };
  try {
    await AgencyController.getAll(dataI).then((data) => {
      agencies.value = data.page;
      console.log("estoy aqui", data);
      loading.value = false;
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

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
          <v-card-title class="text-h5" v-if="agencyId.status">
            Activate Agency?
          </v-card-title>
          <v-card-title class="text-h5" v-else>
            Deactivate Agency?
          </v-card-title>
          <v-card-text v-if="agencyId.status"
            >Are you sure you want to <b>Activate</b> this Agency?</v-card-text
          >
          <v-card-text v-else
            >Are you sure you want to <b>Deactivate</b> this
            Agency?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="text" @click="modalActive = false">
              Cancel
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="activateAgency()"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Approve sponsors -->
      <v-dialog v-model="modalApprove" width="auto">
        <v-card>
          <v-card-title class="text-h5"> Approve Agency? </v-card-title>
          <v-card-text
            >Are you sure you want to <b>Approve</b> this Agency?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" red variant="text" @click="modalApprove = false">
              Cancel
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="approveAgency()"
            >
              Ok
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

          <p class="lg:text-xl text-lg">Agencies</p>
        </div>
        <div class="flex gap-2 items-center edit-search">
          <FormField>
            <FormControl
              v-model="searchItem"
              :icon="mdiAccountBox"
              value="Search"
            />
          </FormField>
          <BaseButton
            class="mr-5"
            label="Add Agencies"
            color="info"
            :icon="mdiPlus"
            to="/create-agency"
          />
        </div>
      </div>
      <!-- <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Causes" main>
        <div></div>
      </SectionTitleLineWithButton> -->
      <div
        v-if="!loading && agencies.length == 0"
        class="grid min-w-[50%] gap-6 mb-6"
      >
        <CardBoxWidget
          :icon="mdiCartOutline"
          label="It seems that there are no agency related to you yet :("
          content='You can create a agency by clicking on the "+ Add Agencies" button!!'
        />
      </div>
      <div
        v-if="!loading && agencies.length > 0"
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

        <CardBox class="max-h-52" v-for="agency in agencies" :key="agency.id">
          <CardBoxComponentTitle title="With title & icon">
            <div class="flex justify-between mb-2">
              <p class="font-extrabold text-lg">{{ agency.name }}</p>
              <!-- <p class="font-extrabold text-lg">{{ agency.email }}</p> -->
            </div>
          </CardBoxComponentTitle>
          <div class="grid grid-cols-3">
            <img
              class="col-span-1 mr-3"
              :src="host + agency.img"
              style="height: 64px; width: 64px"
            />
            <p class="text-sm font-light col-span-2 line-clamp-4">
              {{ agency.description }}
            </p>
          </div>

          <template v-if="role === 'admin'">
            <BaseButton
              v-if="agency.adminApprove == true"
              class="mt-3 text-lg font-bold italic mr-2"
              small
              :label="agency.status ? 'Activate' : 'deactivate'"
              Activar
              :color="agency.status ? 'success' : 'danger'"
              @click="
                {
                  modalActive = true;
                  agencyId = agency;
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
                  agencyId = agency;
                }
              "
            />
            <BaseButton
              class="mt-3 text-lg font-bold italic"
              small
              label="Edit"
              color="info"
              @click="goEdit(agency.id)"
            />
          </template>
        </CardBox>
      </div>
    </SectionMain>
    <div v-if="!loading" class="flex justify-center h-10">
      <InfiniteLoading @infinite="load()" />
    </div>
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
