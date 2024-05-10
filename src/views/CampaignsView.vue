<script setup>
import {
  onBeforeMount,
  computed,
  ref,
  watchEffect,
  onMounted,
  watch,
} from "vue";
import { mdiBallotOutline, mdiArrowLeftDropCircle, mdiPlus } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import ChallengeController from "../controllers/ChallengeController";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useSessionStore } from "@/stores/session.js";
import SponsorController from "@/controllers/SponsorController";
import UserController from "@/controllers/UserController";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import { useAlertStore } from "@/stores/alerts";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

const sessionStore = useSessionStore();
const host = import.meta.env.VITE_IMAGE_HOST;
const challenges = ref([]);
const alertStore = useAlertStore();
const sponsorData = ref([]);
const loading = ref(Boolean);
const user = ref({});
const searchName = ref("");
const filterData = computed(() => searchData());
const profile = ref({});
const errorAdminApprove = ref(null);
const disableButton = ref(false);
let itemsScroll = ref(18);
const searchItem = ref("");
const pages = ref(0);
const showLoad = ref(true);

const errorAdminAlert = ref(false);
function searchData() {
  return challenges.value.filter((challenge) =>
    challenge.name.includes(searchName.value)
  );
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
  challenges.value = [];
  let data = {
    search: searchItem.value,
    items: itemsScroll.value,
  };
  const res = await ChallengeController.getData(data);
  console.log("cris", res);
  challenges.value = res.page;
  showLoad.value = false;
};

onBeforeMount(async () => {
  profile.value = await UserController.getMyProfile();

  loading.value = true;
});

const router = useRouter();
// function navigateChallenge() {
//   log
// }
function goView(id, message, view) {
  localStorage.setItem("shareMessage", message);
  router.push({
    name: view,
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
const load = async () => {
  if (challenges.value.length >= 18) {
    pages.value++;
    let dataI = {
      page: pages.value,
      items: itemsScroll.value,
    };
    console.log("pages.value :>> ", pages.value);
    console.log("itemsScroll.value :>> ", itemsScroll.value);
    try {
      await ChallengeController.getChallengeDashboard(dataI).then((data) => {
        console.log("data :>> ", data);
        challenges.value = [...challenges.value, ...data.page];
        console.log("causes.value :>> ", challenges.value);
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
    await ChallengeController.getChallengeDashboard(dataI).then((data) => {
      challenges.value = data.page;
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
      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton
            to="/dashboard"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="lg:text-xl text-lg">Campaigns</p>
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
            v-if="errorAdminAlert"
            @click="adminApproveAlert"
            class="mr-5"
            label="Add Challenge"
            color="info"
            :icon="mdiPlus"
          />
          <BaseButton
            v-else
            class="mr-5"
            label="Add Challenge"
            color="info"
            :icon="mdiPlus"
            to="/campaigns/form/0"
          />
        </div>
      </div>
      <div
        v-if="!loading && challenges.length < 0"
        class="grid min-w-[50%] gap-6 mb-6"
      >
        <CardBoxWidget
          :icon="mdiCartOutline"
          label="It seems that there are no campaigns related to you yet :("
          content='You can create a challenge by clicking on the "+ Add Challenge" button!'
        />
      </div>
      <div
        v-if="!loading && challenges.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        <CardBox v-for="challenge in filterData" :key="challenge.id">
          <CardBoxComponentTitle title="With title & icon">
            <div class="flex justify-between mb-2">
              <p class="font-extrabold text-lg">{{ challenge.name }}</p>
              <!-- <FormCheckRadio type="switch" /> -->
            </div>
          </CardBoxComponentTitle>
          <div class="flex grid-cols-3">
            <img
              class="col-span-1 mr-3"
              :src="host + challenge.badge"
              style="height: 64px; width: 64px"
            />
            <p class="text-sm font-light col-span-2">
              {{ challenge.description }}
            </p>
          </div>

          <template #footer>
            <div class="flex flex-col">
              <div class="flex flex-row justify-around">
                <!-- <div class="flex flex-col">
                  <h2 class="font-extrabold">CAUSE</h2>
                  <p class="text-sm font-light">Data de la causa</p>
                </div>
                <div class="flex flex-col ml-2">
                  <h2 class="font-extrabold">SPONSOR</h2>
                  <p class="text-sm font-light">Data del sponsor</p>
                </div> -->
              </div>
              <div class="flex justify-end gap-3">
                <BaseButton
                  class="mt-3 text-lg font-bold"
                  small
                  label="Show Info"
                  color="success"
                  @click="
                    goView(
                      challenge.id,
                      challenge.shareMessageShort,
                      'campaigns/info'
                    )
                  "
                />
                <BaseButton
                  class="mt-3 text-lg font-bold italic"
                  small
                  label="Go Live"
                  color="info"
                  @click="
                    goView(
                      challenge.id,
                      challenge.shareMessageShort,
                      'presentation'
                    )
                  "
                />
              </div>
            </div>
          </template>
        </CardBox>
      </div>
      <div v-if="!loading && showLoad" class="flex justify-center h-10">
        <InfiniteLoading @infinite="load()" />
      </div>
      <div v-if="loading" class="flex align-center justify-center h-screen">
        <LoadingSpinner></LoadingSpinner>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style scoped>
.edit-search > .mb-6 {
  margin-bottom: 0px !important;
}
</style>
