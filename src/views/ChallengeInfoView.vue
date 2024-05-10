<script setup>
import CardBox from "@/components/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import QRCodeVue3 from "qrcode-vue3";
import axios from "axios";
import {
  ref,
  watchEffect,
  reactive,
  computed,
  watch,
  onBeforeMount,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import ChallengeController from "@/controllers/ChallengeController";
import UserController from "@/controllers/UserController";
import { useSessionStore } from "@/stores/session.js";
import {
  mdiArrowLeftDropCircle,
  mdiGift,
  mdiInformation,
  mdiPencil,
  mdiStar,
  mdiCloudDownload,
  mdiEmail,
  mdiDownload,
  mdiTagEditOutline,
} from "@mdi/js";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import UtilityMehods from "@/utility/utilityMethods";
import RewardController from "@/controllers/RewardController";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import SponsorController from "@/controllers/SponsorController";
import { useAlertStore } from "@/stores/alerts";
import { Chart, registerables } from "chart.js";
import { BarChart, useBarChart } from "vue-chart-3";
import DashboardController from "@/controllers/DashboardController";

Chart.register(...registerables);
import MessagesController from "@/controllers/MessagesController";
import ChallengeDownloadController from "@/controllers/ChallengeDownloadController";
import QuickEditChallenge from "./QuickEditChallenge.vue";
const sessionStore = useSessionStore();
const alertStore = useAlertStore();

const route = useRoute();
const router = useRouter();
const host = import.meta.env.VITE_IMAGE_HOST;

const stepsShare = {
  SHARE_VIEW: "Initial Challenge Views",
  SHARE_UPLOAD: "Challenges Uploaded",
  SHARE_NUMBER: "Phone Number Inputs",
  SHARE_NAME: "Challenges Completed",
  TWILIO_VIEW: "Initial Challenge Views",
  TWILIO_UPLOAD: "challenge finished",
  TWILIO_NAME: "code and name input",
};

const chartTitles = {
  COMMUNITY_MEMBERS: "Community Members",
  TOTAL_SHARES: "Total Shares",
  NETWORK_EFFECT: "Network Effect Users",
  MESSAGES_OUT: "Messaging OPT - OUTS",
};
const rates = {
  engagementRate: "Engagement",
  inbound: "Inbound",
  networkRate: "Network Effect",
  outbound: "Outbound Rate",
  peer: "Peer Sharing",
  throughRate: "Click Through",
};
const RRSS = {
  instagram: "social/instagram.png",
  tiktok: "social/tiktok.png",
  facebook: "social/facebook.png",
  twitter: "social/twitter.png",
  whatsapp: "social/whatsapp.png",
  pinterest: "social/pinterest.png",
  email: "social/email.png",
  direct: "social/link.png",
};

const urlWithMessage =
  localStorage.getItem("shareMessage") +
  " " +
  import.meta.env.VITE_FRONT_HOST +
  "challenges/" +
  route.query.id;

const downloadQr = ref(null);
const urlShred = ref();
const profile = ref({});
const role = ref();
const dataChallenge = ref({});
const dataStats = ref();
const swayScore = ref();
const dataSteps = ref({ SHARE: [], TWILIO: [] });
const allUsers = ref([]);
const messagesOut = ref();
const networkUsers = ref();
const selectedUser = ref({});
const rate = ref({});
const actualTab = ref("");
const rewards = ref([]);
const sponsorData = ref([]);
const snackbar = ref(false);
const isModalActive = ref(false);
const sorting = ref({ field: "firstName", order: 1 });
const userDefault = "default/user_default.png";
const modalShare = ref(false);
const modalReward = ref(false);
const modalMessage = ref(false);
const modalDownloardChallenge = ref(false);
const modalStatus = ref(false);
const modalCharts = ref(false);
const linkCopied = ref(false);
const shareToInstagram = ref(false);
const shareToTikTok = ref(false);
const searchValue = ref("");
const membersSelected = ref([]);
const nameMembersSelected = ref({});
const downloadChallenge = ref();
const modalInsufficientCredits = ref(false);
const insufficientCredit = ref(null);
const downloadLinks = ref([]);
const messages = ref([]);
const colorQr = ref("");
const badgeQr = ref("");
let selectAll = ref(false);
let selectOne = ref(false);
const openModal = ref(false);

const filteredUsers = computed(() => {
  let data = allUsers.value.filter(
    (challenge) =>
      challenge.user.firstName
        .toLowerCase()
        .includes(searchValue.value.toLowerCase()) ||
      challenge.user.phone
        .toLowerCase()
        .includes(searchValue.value.toLowerCase()) ||
      challenge.user.createdAt
        .toLowerCase()
        .includes(searchValue.value.toLowerCase())
  );
  return data;
});
const backendData = ref({});

// Table
const perPage = ref(6);
const currentPage = ref(1);
const checkedRows = ref([]);

const form = reactive({
  reward: rewards[0],
  user: "",
  message: "",
});

const status = computed(() => {
  return !!dataChallenge.value.status;
});

const sortedUsers = computed(() => {
  const { field, order } = sorting.value;
  const start = (currentPage.value - 1) * perPage.value;

  return filteredUsers.value
    .sort((a, b) => {
      if (field === "createdAt") {
        return (
          order * (new Date(a.user.createdAt) - new Date(b.user.createdAt))
        );
      } else if (field === "firstName") {
        // toLowerCase asegura que no ordena las iniciales por mayuscula primero
        return (
          order *
          (a.user[field].toLowerCase() < b.user[field].toLowerCase() ? 1 : -1)
        );
      } else {
        return order * (a.user[field] < b.user[field] ? 1 : -1);
      }
    })
    .slice(start, start + perPage.value);
});
function performSearch() {
  // Reiniciar a la primera página al buscar
  currentPage.value = 1;
}

function handleChecked(checked, client, index) {
  if (checked === true) {
    console.log("si", membersSelected.value);
  } else {
    console.log(membersSelected.value.slice(index, 1));
    console.log("No", membersSelected.value);
  }

  selectOne.value = false;
  allUsers.value.forEach((item) => {
    if (membersSelected.value[`id-${item.user.id}`]) {
      console.log(membersSelected.value);
      selectOne.value = true;
      return;
    }
  });

  membersSelected.value.push(client.user.id);
}

function handleAllChecked(checked) {
  selectAll.value = false;
  allUsers.value.forEach((item) => {
    membersSelected.value[`id-${item.user.id}`] = checked;
    if (membersSelected.value[`id-${item.user.id}`] === true) {
      selectAll.value = true;
      membersSelected.value.push(item.user.id);
      return;
    } else {
      membersSelected.value.pop();
    }
  });
}

async function downloadUserChallengeFile(selectedUser) {
  await ChallengeDownloadController.downloadUserChallenge(
    selectedUser.url
  ).then((response) => {
    const nameFile = selectedUser.url.split("/");
    const blob = b64toBlob(response.data, response.type);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nameFile[1]);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
async function loadComponent() {
  if (role.value == "sponsor") {
    SponsorController.getByUserId(parseInt(sessionStore.getUserId())).then(
      (data) => {
        sponsorData.value = data;
      }
    );
  }
  ChallengeController.getUrlChallengeShared(route.query.id).then((data) => {
    urlShred.value =
      import.meta.env.VITE_FRONT_HOST +
      `challenge/shares/${data.twilio.id}/` +
      route.query.id;
  });
  RewardController.getAllDashboard().then((data) => {
    let list = data.map((item) => {
      return { id: item.id, label: item.Name };
    });
    rewards.value = list;
    form.reward = list[0];
  });
  DashboardController.getChartsData(route.query.id).then((response) => {
    backendData.value = response;
  });

  MessagesController.getAllDashboard().then((data) => {
    let list = data.map((item) => {
      return { id: item.id, label: item.description };
    });
    messages.value = list;
    form.message = list[0];
  });
}
watchEffect(async () => {
  console.log("modal", openModal.value);
  loadComponent();
}, [route.query.id]);

async function toggleShowEditModal() {
  openModal.value = !openModal.value;
  await loadComponent();
}

const chartData = computed(() => {
  if (!chartTitles[actualTab.value] || !backendData.value[actualTab.value]) {
    return {};
  }
  let labels = Object.keys(backendData.value[actualTab.value]);
  let data = Object.values(backendData.value[actualTab.value]);
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "#77CEFF",
          "#0079AF",
          "#123E6B",
          "#97B0C4",
          "#A5C8ED",
        ],
      },
    ],
  };
});
const barChart = useBarChart({
  chartData,
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});
const barChartProps = ref(barChart.barChartProps);
onBeforeMount(async () => {
  profile.value = await UserController.getMyProfile();
  console.log(profile.value.credits);
  role.value = profile.value.rol;
  const data = await ChallengeController.getChallengesStats(
    route.query.id
  ).then(async (data) => {
    dataChallenge.value = data.challenge;
    colorQr.value = dataChallenge.value.color;
    badgeQr.value = dataChallenge.value.qrUrl;
    dataStats.value = data.stats;
    Object.keys(data.steps).forEach((step) => {
      dataSteps.value[step.split("_")[0]].push({
        data: data.steps[step],
        title: stepsShare[step],
      });
    });
    dataSteps.value.SHARE = dataSteps.value.SHARE.reverse();
    dataSteps.value.TWILIO = dataSteps.value.TWILIO.reverse();
    allUsers.value = data.challenge.userChallenges.map((item) => {
      return { user: item.user, url: item.url };
    });
    allUsers.value = allUsers.value.filter(
      (value) => value.user.firstName !== "Unknown"
    );
    networkUsers.value = data.networkUsers;
    messagesOut.value = data.messagesOut;
    rate.value = data.rate;
  });
});

function abrirmodal() {
  modalShare.value = true;
  dataChallenge.value.color = shadeColor(dataChallenge?.value?.color, -40);
}
async function downloadQrFn() {
  try {
    await ChallengeDownloadController.downloadUserChallenge(badgeQr.value).then(
      (response) => {
        const nameFile = `qr_${badgeQr.value}`;
        const blob = b64toBlob(response.data, response.type);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nameFile);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    );
  } catch (error) {
    console.error("Error al descargar la imagen:", error);
  }
}

function shadeColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

function copyUrlLink() {
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.value = urlShred.value;
  dummy.select();
  dummy.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
function copyS() {
  document.getElementById("urlSocial").focus();
  document.execCommand("copy");
}

function formatNumber(property) {
  return dataStats.value.total[property].toFixed(0) != 0
    ? "$" +
        (
          (allUsers.value.length * dataChallenge.value.amount) /
          dataStats.value.total[property]
        ).toFixed(2)
    : "No Data";
}

function goEdit() {
  router.push(`form/${route.query.id}`);
}

function openDownloandEmailModal() {
  downloadLinks.value = [];
  modalDownloardChallenge.value = true;
  console.log("descargando");
}

function openMessageModal(params) {
  modalMessage.value = true;
}
function onClickSelectedUser(selected_User) {
  isModalActive.value = true;
  selectedUser.value = selected_User;
  UserController.getSwayScore(selected_User.user.id).then((data) => {
    swayScore.value = data.value;
    return data;
  });
}

function openRewardModal(selected_User) {
  modalReward.value = true;
  membersSelected.value.push(selected_User.user.id);
  console.log(selected_User.user.id);
  selectedUser.value = selected_User;
}

function checkFile(url) {
  const imgExt = [".GIF", ".MP4", ".MOV"];
  const ext = "." + url.split(".").pop();
  if (imgExt.indexOf(ext.toUpperCase()) < 0) {
    return false;
  } else {
    return true;
  }
}

function statusShow(status) {
  switch (status) {
    case 0:
      return "Inactive";
    case 1:
      return "Active";
    case 2:
      return "Deleted";
    default:
      return "Unknown";
  }
}

function sort(field) {
  if (sorting.value.field === field) {
    sorting.value.order *= -1;
  } else {
    sorting.value.field = field;
    sorting.value.order = 1;
  }
  console.log("campo", field, sorting.value);
}

function goView(id, message, view) {
  localStorage.setItem("shareMessage", message);
  router.push({
    name: view,
    query: {
      id: id,
    },
  });
}

async function changeStatusChallenge(force = false) {
  try {
    let response;
    const id = route.query.id;
    const newStatus = !dataChallenge.value.status;
    if (force) {
      //call back
      response = await ChallengeController.changeStatus(id, newStatus);
      if (response.status === 200) {
        dataChallenge.value.status = newStatus; // Actualiza el estado local
      }
    }
    modalStatus.value = !force;

    return response?.data; // Retorna los datos de la respuesta del servidor
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
    // Manejo de errores aquí
    throw error;
  }
}

async function sendReward() {
  let rewardData = {
    idReward: form.reward.id,
    idUsr: membersSelected.value,
    idChallenge: dataChallenge.value.id,
  };
  if (profile.value.rol != "admin") {
    await RewardController.rewardCredits(membersSelected.value.length)
      .then((res) => {
        console.log("resss", res);
      })
      .catch((err) => {
        insufficientCredit.value = err.response.data.message;
      });
  }

  if (insufficientCredit.value) {
    modalReward.value = false;
    alertStore.createAlert({
      title: "It seems you don't have enough credit!",
      color: "#dc2626",
      text: insufficientCredit.value,
    });
  } else {
    await RewardController.giveReward(rewardData)
      .then((response) => {
        console.log("respuesta de reward", response);
        alertStore.createAlert({
          title: "Reward sussefully sent!",
          icon: "$success",
          text: "You have succesfully sent the reward!",
        });
        modalReward.value = false;

        nameMembersSelected.value = [];
      })
      .catch((error) => {
        console.log(error);
        alertStore.createAlert({
          title: "This reward passed the sent limit!",
          color: "#dc2626",
          text: "Try another reward or create a new one!",
        });
      });
  }

  console.log(rewardData);
}
async function sendMessage() {
  let messageData = {
    idMessage: form.message.id,
    idUsers: membersSelected.value,
  };
  if (profile.value.rol != "admin") {
    await MessagesController.messageCredits(membersSelected.value.length)
      .then((res) => {})
      .catch((err) => {
        insufficientCredit.value = err.response.data.message;
      });
  }

  if (insufficientCredit.value) {
    modalMessage.value = false;
    alertStore.createAlert({
      title: "It seems you don't have enough credit!",
      color: "#dc2626",
      text: insufficientCredit.value,
    });
  } else {
    console.log("cantidad de mensajess", membersSelected.value.length);
    await MessagesController.sendMasive(messageData).then((data) => {
      alertStore.createAlert({
        title: "Message sent successfully!",
        color: "success",
        text: "Your message has been sent successfully",
      });
    });
  }
  modalMessage.value = false;
}
async function downloadChallengeEmail(client) {
  let id = dataChallenge.value.id;
  let users = {
    users: membersSelected.value,
  };
  ChallengeDownloadController.downloandChallenge(id, users).then((data) => {
    alertStore.createAlert({
      title: "Successful download",
      icon: "$success",
      text: "Successful download, an email has been sent to the user corresponding to the challenge",
    });
    downloadLinks.value = data.files;
  });
}

const itemsPaginated = computed(() =>
  allUsers.value.slice(
    perPage.value * (currentPage.value - 1),
    perPage.value * currentPage.value - 1
  )
);

const numPages = computed(() =>
  Math.ceil(allUsers.value.length / perPage.value)
);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});
</script>

<template>
  <LayoutAuthenticated>
    <div v-if="dataStats">
      <input
        id="urlSocial"
        style="opacity: 0; position: absolute"
        readonly
        v-on:focus="$event.target.select()"
        :value="urlWithMessage"
      />
      <!-- Modal Quick Edit -->
      <v-dialog class="w-[600px]" v-model="openModal">
        <v-card>
          <QuickEditChallenge
            :toggle="toggleShowEditModal"
          ></QuickEditChallenge>
        </v-card>
      </v-dialog>
      <!-- Modal Copy Links -->
      <v-dialog v-model="linkCopied" width="auto" class="justify-center">
        <v-card
          v-bind:style="[
            !shareToInstagram && !shareToTikTok
              ? { height: '400px' }
              : { height: '420px' },
          ]"
        >
          <v-card-title class="text-4xl font-bold pt-5 text-center">
            Your link was copied!
          </v-card-title>
          <div class="flex items-center justify-center flex-wrap gap-3 p-5">
            <v-sheet class="text-center container-modal" height="260px">
              <div class="flex justify-center">
                <img
                  class="flex"
                  style="max-width: 30%"
                  src="/assets/img/png/steve_buy_usd.png"
                  alt=""
                />
              </div>
              <div
                class="my-2 text-center"
                v-if="!shareToInstagram && !shareToTikTok"
              >
                Now paste your challenge link everywhere!
              </div>
              <div class="my-2 text-center" v-else>
                Now post the challenge link on your story and direct fans to
                click and accept your challenge!
              </div>
              <div class="pb-5 flex justify-center">
                <BaseButton
                  v-if="!shareToInstagram && !shareToTikTok"
                  label="Got it!"
                  color="info"
                  rounded-full
                  @click="linkCopied = false"
                />
                <a
                  v-if="shareToInstagram"
                  href="https://www.instagram.com/"
                  target="_blank"
                >
                  <div class="flex items-center">
                    <img class="w-8 h-8" src="/assets/social/instagram.png" />
                    <p
                      class="bg-pink-700 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
                    >
                      Go to Instagram!
                    </p>
                  </div>
                </a>
                <a
                  v-if="shareToTikTok"
                  href="https://www.tiktok.com/"
                  target="_blank"
                >
                  <div class="flex items-center">
                    <img class="w-8 h-8" src="/assets/social/tiktok.png" />
                    <p
                      class="bg-black text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
                    >
                      Go to TikTok!
                    </p>
                  </div>
                </a>
              </div>
            </v-sheet>
          </div>
        </v-card>
      </v-dialog>
      <!-- Modal confirmation status -->
      <v-dialog v-model="modalStatus" width="auto">
        <v-card>
          <v-card-title class="text-h5 ml-2 red-darken-1">
            Are you sure you want to change the status of the challenge?
          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-2"
              color="red-darken-1"
              variant="text"
              @click="changeStatusChallenge(true)"
            >
              Yes
            </v-btn>
            <v-btn
              class="mr-2"
              color="green-darken-1"
              variant="text"
              @click="modalStatus = false"
            >
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Modal Charts -->
      <v-dialog v-model="modalCharts" width="auto">
        <v-card>
          <v-card-title class="text-h5 ml-2 red-darken-1">
            {{ chartTitles[actualTab] }}
          </v-card-title>
          <BarChart v-bind="barChartProps" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-2"
              color="red-darken-1"
              variant="text"
              @click="modalCharts = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Modal Share -->
      <v-dialog v-model="modalShare" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Share to promote your challenge
          </v-card-title>

          <div class="flex items-center justify-center flex-wrap gap-3 p-5">
            <div class="social-item">
              <div
                @click="
                  copyS(),
                    (shareToInstagram = true),
                    (shareToTikTok = false),
                    (modalShare = false),
                    (linkCopied = true)
                "
                class="flex items-center cursor-pointer"
              >
                <img
                  class="w-8 h-8 cursor-pointer"
                  src="/assets/social/instagram.png"
                />
                <p
                  class="bg-pink-700 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2 cursor-pointer"
                >
                  Instagram
                </p>
              </div>
            </div>
            <div class="social-item">
              <div
                @click="
                  copyS(),
                    (shareToInstagram = false),
                    (shareToTikTok = true),
                    (modalShare = false),
                    (linkCopied = true)
                "
                class="flex items-center cursor-pointer"
              >
                <img
                  class="w-8 h-8 cursor-pointer"
                  src="/assets/social/tiktok.png"
                />
                <p
                  class="bg-black text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2 cursor-pointer"
                >
                  TikTok
                </p>
              </div>
            </div>
            <ShareNetwork
              network="facebook"
              :url="urlShred"
              title="I CHALLENGE YOU TO DO THIS CHALLENGE"
              hashtags="Shareity"
              class="flex items-center"
            >
              <img class="w-8 h-8" src="/assets/social/facebook.png" />
              <p
                class="bg-sky-700 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
              >
                Facebook
              </p>
            </ShareNetwork>
            <ShareNetwork
              network="twitter"
              :url="urlShred"
              title="I CHALLENGE YOU TO DO THIS CHALLENGE"
              hashtags="Shareity"
              class="flex items-center"
            >
              <img class="w-8 h-8" src="/assets/social/twitter.png" />
              <p
                class="bg-blue-400 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
              >
                Twitter
              </p>
            </ShareNetwork>
            <ShareNetwork
              network="whatsApp"
              :url="urlShred"
              title="I CHALLENGE YOU TO DO THIS CHALLENGE"
              hashtags="Shareity"
              class="flex items-center"
            >
              <img class="w-8 h-8" src="/assets/social/whatsapp.png" />
              <p
                class="bg-green-400 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
              >
                Whatsapp
              </p>
            </ShareNetwork>
            <ShareNetwork
              network="pinterest"
              :url="urlShred"
              title="I CHALLENGE YOU TO DO THIS CHALLENGE"
              class="flex items-center"
            >
              <img class="w-8 h-8" src="/assets/social/pinterest.png" />
              <p
                class="bg-red-800 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
              >
                Pinterest
              </p>
            </ShareNetwork>
            <ShareNetwork
              network="linkedin"
              :url="urlShred"
              class="flex items-center"
            >
              <img class="w-8 h-8" src="/assets/social/linkedin.png" />
              <p
                class="bg-cyan-800 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
              >
                LinkedIn
              </p>
            </ShareNetwork>
            <div class="social-item">
              <a
                :href="`mailto:?&body=${
                  'I INVITE YOU TO JOIN MY CHALLENGE' + urlShred
                }`"
                target="_blank"
                class="flex items-center"
              >
                <img class="w-8 h-8" src="/assets/social/email.png" />
                <p
                  class="bg-blue-400 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2"
                >
                  Email
                </p>
              </a>
            </div>
            <div
              @click="
                copyUrlLink(),
                  (modalShare = false),
                  (shareToInstagram = false),
                  (shareToTikTok = false),
                  (linkCopied = true)
              "
              class="flex items-center"
            >
              <img
                class="w-8 h-8 cursor-pointer"
                src="/assets/social/link.png"
              />
              <p
                class="bg-blue-400 text-white italic font-bold rounded-r-md py-0.5 -ml-1 -z-1 px-2 cursor-pointer"
              >
                Copy Link
              </p>
              <input
                class="cursor-pointer"
                ref="url"
                style="opacity: 0; position: absolute"
                readonly
                v-on:focus="$event.target.select()"
                :value="urlShred"
              />
            </div>
            <div data-app>
              <Loading :active="loading" />
            </div>
          </div>
          <div
            id="downloadQr"
            ref="downloadQr"
            class="flex justify-center items-center mt-10 relative"
          >
            <!-- <QRCodeVue3
              :width="400"
              :height="400"
              :value="base"
              :qrOptions="{
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H',
              }"
              :imageOptions="{
                hideBackgroundDots: true,
                imageSize: 0.4,
                margin: 0,
              }"
              :backgroundOptions="{ color: '#ffff' }"
              :cornersSquareOptions="{ type: 'square', color: colorQr }"
              :cornersDotOptions="{ type: 'square', color: colorQr }"
              :dotsOptions="{
                type: 'square',
                color: colorQr,
              }"
              fileExt="png"
              :ButtonName="mdiDownload"
              :download="true"
              myclass="my-qur"
              imgclass="img-qr"
              downloadButton="my-button"
              :downloadOptions="{
                name: dataChallenge.name,
                extension: 'png',
              }"
            /> -->
            <img id="image" class="w-80 h-80" :src="host + badgeQr" />
            <!-- <img
              class="w-14 h-14 rounded-md absolute"
              :src="host + dataChallenge.badge"
            /> -->
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" variant="text" @click="downloadQrFn()">
              Download Qr
            </v-btn>
            <v-btn color="red" variant="text" @click="modalShare = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- MODAL REWARDS -->
      <v-dialog v-model="modalReward" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Select a Reward To User
          </v-card-title>
          <div
            class="flex flex-column items-center justify-center flex-wrap gap-3 p-5"
          >
            <div class="flex items-center justify-beetwen gap-2">
              <ul>
                <li v-for="(name, index) in nameMembersSelected" :key="index">
                  {{ name }}
                </li>
              </ul>
              <FormField label="Send Reward ">
                <FormControl
                  v-model="form.reward"
                  :options="rewards"
                  :icon="mdiStar"
                />
              </FormField>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2"
                color="red-darken-1"
                variant="text"
                @click="modalReward = false"
              >
                Cancel
              </v-btn>
              <v-btn
                class="mr-2"
                color="green-darken-1"
                variant="text"
                @click="sendReward()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!-- Modal Insuficent Credits -->

      <!-- Modal Message -->
      <v-dialog v-model="modalMessage" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Send Message to User
          </v-card-title>
          <div
            class="flex flex-column items-center justify-center flex-wrap gap-3 p-5"
          >
            <div class="flex items-center justify-beetwen gap-2">
              <ul>
                <li v-for="(name, index) in nameMembersSelected" :key="index">
                  {{ name }}
                </li>
              </ul>
              <FormField label="Send Message">
                <FormControl
                  v-model="form.message"
                  :options="messages"
                  :icon="mdiStar"
                />
              </FormField>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2"
                color="red-darken-1"
                variant="text"
                @click="modalMessage = false"
              >
                Cancel
              </v-btn>
              <v-btn
                class="mr-2"
                color="green-darken-1"
                variant="text"
                @click="sendMessage()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!-- Modal Download Challenge -->
      <v-dialog v-model="modalDownloardChallenge" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            We will send you an email with the selected challenge
          </v-card-title>
          <div
            class="flex flex-column items-center justify-center flex-wrap gap-3 p-5"
          >
            <div class="flex items-center justify-beetwen gap-2">
              <ul>
                <li v-for="(name, index) in nameMembersSelected" :key="index">
                  {{ name }}
                </li>
              </ul>
            </div>
            <div v-for="(item, index) in downloadLinks" :key="index">
              <a
                class="underline font-bold text-2xl"
                :href="item"
                target="_blank"
                rel="noopener noreferrer"
                >File {{ index + 1 }}</a
              >
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2"
                color="red-darken-1"
                variant="text"
                @click="modalDownloardChallenge = false"
              >
                Close
              </v-btn>
              <v-btn
                class="mr-2"
                color="green-darken-1"
                variant="text"
                v-if="downloadLinks.length == 0"
                @click="downloadChallengeEmail()"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!-- MAIN -->
      <SectionMain class="col-span-1">
        <div class="justify-between pb-5">
          <div class="flex gap-2 items-center">
            <BaseButton
              to="/campaigns"
              :icon="mdiArrowLeftDropCircle"
              color="info"
              rounded-full
              small
            />
            <p class="font-extrabold">
              {{ dataChallenge.name }}
            </p>
          </div>
        </div>
        <!-- HEADER -->
        <CardBox class="mb-6">
          <div class="flex flex-col lg:flex-row items-center justify-between">
            <div class="rounded-lg shadow-md m-5">
              <img class="w-28" :src="host + dataChallenge.badge" alt="" />
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="flex flex-col col-span-1 gap-2">
                <div>
                  <p class="font-bold">START DATE:</p>
                  <p class="font-light">
                    {{ UtilityMehods.formatDate(dataChallenge.startDate) }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">END DATE:</p>
                  <p class="font-light">
                    {{ UtilityMehods.formatDate(dataChallenge.endDate) }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col col-span-1 gap-2">
                <div>
                  <p class="font-bold">CAUSE:</p>
                  <p class="font-light">
                    {{
                      dataChallenge.organization.name
                        ? dataChallenge.organization.name
                        : "Organization"
                    }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">BRAND:</p>
                  <p class="font-light">
                    {{
                      dataChallenge.sponsors[0]
                        ? dataChallenge.sponsors[0]?.sponsor?.name
                        : "Unsponsored"
                    }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col col-span-1 align-center text-center">
                <p class="font-bold">DONATION:</p>

                <img
                  v-if="dataChallenge.typeDonation === 'object'"
                  class="w-28"
                  :src="host + dataChallenge.typeDonationIcon"
                  alt=""
                />
                <p v-else class="font-extrabold text-4xl text-green-600">
                  ${{ dataChallenge.amount }}
                </p>
              </div>
              <div class="flex flex-col col-span-1 justify-center gap-3">
                <div>
                  <p class="font-bold">
                    STATUS:
                    <span :class="status ? 'text-success' : 'text-red'">
                      {{ status ? "ACTIVE" : "INACTIVE" }}
                    </span>
                  </p>
                  <BaseButton
                    :label="(status ? 'Disable' : 'Enable') + ' Challenge'"
                    :color="status ? 'danger' : 'success'"
                    @click="changeStatusChallenge()"
                    small
                    class="w-100"
                    v-if="profile.rol == 'admin'"
                  />
                </div>
                <BaseButton
                  label="Promote your challenge"
                  color="info"
                  @click="abrirmodal"
                  small
                />
                <BaseButton
                  label="Go live"
                  color="info"
                  @click="
                    goView(
                      dataChallenge.id,
                      dataChallenge.shareMessageShort,
                      'presentation'
                    )
                  "
                  small
                />
              </div>
            </div>
            <div class="flex m-5 gap-3">
              <BaseButton
                v-if="role != 'sponsor'"
                :icon="mdiPencil"
                color="info"
                rounded-full
                @click="goEdit"
              />
              <BaseButton
                v-if="role != 'sponsor'"
                :icon="mdiTagEditOutline"
                color="success"
                rounded-full
                @click="openModal = true"
              />
            </div>
          </div>
        </CardBox>

        <!-- TOTALS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <NotificationBar
            color="info"
            @click="
              actualTab = 'COMMUNITY_MEMBERS';
              modalCharts = true;
            "
          >
            COMMUNITY MEMBERS:
            <span class="font-bold text-l">{{ allUsers.length }}</span>
          </NotificationBar>
          <NotificationBar
            color="success"
            @click="
              actualTab = 'TOTAL_SHARES';
              modalCharts = true;
            "
          >
            TOTAL SHARES:
            <span class="font-bold text-l">{{
              dataStats.total.shares.toFixed(0)
            }}</span>
          </NotificationBar>
          <NotificationBar
            color="warning"
            @click="
              actualTab = 'NETWORK_EFFECT';
              modalCharts = true;
            "
          >
            NETWORK EFFECT USERS:
            <span class="font-bold text-l">{{ networkUsers.toFixed(0) }}</span>
          </NotificationBar>
          <NotificationBar
            color="danger"
            @click="
              actualTab = 'MESSAGES_OUT';
              modalCharts = true;
            "
          >
            MESSAGING OPT - OUTS:
            <span class="font-bold text-l">{{ messagesOut.toFixed(0) }}</span>
          </NotificationBar>
        </div>

        <!-- STEPS COUNT -->
        <CardBox class="mb-6">
          <p class="font-bold text-xl uppercase mb-5">Promotional Link Stats</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="item in dataSteps.SHARE"
              :key="item"
              class="col-span-1 flex flex-col items-center"
            >
              <p class="font-bold text-lg italic capitalize">
                {{ item.title }}
              </p>
              <p class="text-green-600 text-2xl font-bold">
                {{ item.data }}
              </p>
            </div>
          </div>
        </CardBox>
        <!-- <CardBox class="mb-6">
          <p class="font-bold text-xl uppercase mb-5">User Textl Link Stats</p>
          <div class="grid grid-cols-1 md:grid-cols-3">
            <div
              v-for="item in dataSteps.TWILIO"
              :key="item"
              class="col-span-1 flex flex-col items-center"
            >
              <p class="font-bold text-lg italic capitalize">
                {{ item.title }}
              </p>
              <p class="text-green-600 text-2xl font-bold">
                {{ item.data }}
              </p>
            </div>
          </div>
        </CardBox> -->

        <!-- STATS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CardBox class="col-span-1 lg:col-span-2 mb-6">
            <p class="font-bold text-xl uppercase mb-5">
              COMPLETED CHALLENGE STATS
            </p>
            <div class="grid grid-cols-3 grid-rows-2 gap-5">
              <div
                v-for="(value, key) in rate"
                :key="key"
                class="flex flex-col justify-center items-center"
              >
                <p class="text-xl italic font-bold pb-3">{{ rates[key] }}</p>
                <v-progress-circular
                  :rotate="360"
                  :size="100"
                  :width="15"
                  :model-value="value"
                  color="blue"
                >
                  {{ value.toFixed(2) }} %
                </v-progress-circular>
              </div>
            </div>
          </CardBox>
          <CardBox class="col-span-1 mb-6">
            <p class="font-bold text-xl mb-5 uppercase">COST IF YOU PAID PER</p>
            <div class="grid grid-cols-2 gap-8">
              <div>
                <p class="italic font-bold">Impression</p>
                <p class="font-light text-green-500">
                  {{ formatNumber("impresion") }}
                </p>
              </div>
              <div>
                <p class="italic font-bold">Impressions</p>
                <p class="font-light text-blue-500">
                  {{ dataStats.total.impresion.toFixed(0) }}
                </p>
              </div>
              <div>
                <p class="italic font-bold">View</p>
                <p class="font-light text-green-500">
                  {{ formatNumber("views") }}
                </p>
              </div>
              <div>
                <p class="italic font-bold">Views</p>
                <p class="font-light text-blue-500">
                  {{ dataStats.total.views.toFixed(0) }}
                </p>
              </div>
              <div>
                <p class="italic font-bold">Share</p>
                <p class="font-light text-green-500">
                  {{ formatNumber("shares") }}
                </p>
              </div>
              <div>
                <p class="italic font-bold">Shares</p>
                <p class="font-light text-blue-500">
                  {{ dataStats.total.shares.toFixed(0) }}
                </p>
              </div>
            </div>
          </CardBox>
        </div>

        <!-- SOCIAL NETWORK TABLE -->
        <CardBox class="mb-6">
          <table>
            <thead>
              <tr>
                <th></th>
                <th v-for="(value, key) in Object.keys(RRSS)" :key="key">
                  <img class="w-8 h-8" :src="host + RRSS[value]" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <p class="text-center font-bold italic uppercase py-3">
                  Impressions
                </p>
                <td v-for="(value, key) in Object.keys(RRSS)" :key="key">
                  {{
                    dataStats[value]?.impresion ? dataStats[value].impresion : 0
                  }}
                </td>
              </tr>
              <tr>
                <p class="text-center font-bold italic uppercase py-3">Views</p>
                <td v-for="(value, key) in Object.keys(RRSS)" :key="key">
                  {{ dataStats[value]?.views ? dataStats[value].views : 0 }}
                </td>
              </tr>
              <tr>
                <p class="text-center font-bold italic uppercase py-3">
                  Shares
                </p>
                <td v-for="(value, key) in Object.keys(RRSS)" :key="key">
                  {{ dataStats[value]?.shares ? dataStats[value].shares : 0 }}
                </td>
              </tr>
            </tbody>
          </table>
        </CardBox>
        <!-- MEMBERS DATA  -->
        <CardBox class="mb-6">
          <div class="flex justify-between">
            <div class="rigth">
              <p class="font-bold text-xl uppercase mb-5">Members Data</p>
              <BaseButton
                :color="
                  selectAll ? 'info' : 'tygrey' && selectOne ? 'info' : 'tygrey'
                "
                :icon="mdiGift"
                small
                @click="selectAll || selectOne ? openRewardModal(client) : ''"
                class="ml-2"
                :disable="membersSelected"
              />
              <BaseButton
                :color="
                  selectAll ? 'info' : 'tygrey' && selectOne ? 'info' : 'tygrey'
                "
                @click="selectAll || selectOne ? openMessageModal(client) : ''"
                :icon="mdiEmail"
                small
                class="ml-2"
                :disable="membersSelected"
              />
              <BaseButton
                :color="
                  selectAll || selectOne
                    ? 'info'
                    : 'tygrey' && selectOne
                    ? 'info'
                    : 'tygrey'
                "
                :icon="mdiCloudDownload"
                small
                @click="selectAll || selectOne ? openDownloandEmailModal() : ''"
                class="ml-2"
                :disable="membersSelected"
              />
            </div>
            <div class="flex items-center gap-6 actions">
              <FormField>
                <FormControl
                  @input="performSearch()"
                  class="!mb-0"
                  v-model="searchValue"
                  :icon="mdiAccountBox"
                  value="Search"
                  placeholder="Search..."
                />
              </FormField>
            </div>
          </div>

          <v-dialog v-model="isModalActive" width="auto">
            <v-card>
              <v-card-title class="text-h5 ml-2"> Detail </v-card-title>
              <v-card-text>
                <div className="w-80 relative my-0 m-auto ">
                  <img
                    v-if="!checkFile(selectedUser.url)"
                    :src="host + selectedUser.url"
                    class="miniPlayer"
                  />
                  <video
                    v-else
                    :src="host + selectedUser.url"
                    class="w-full h-full object-cover rounded-lg shadow-2xl object-center"
                    style="max-width: 300px"
                    autoplay
                    loop
                    controls
                  ></video>
                  <div
                    className="flex gap-3 items-start absolute bottom-12 p-4 "
                  >
                    <img
                      className="w-[50px] h-[50px] rounded-full"
                      :src="
                        selectedUser.user.imagen
                          ? host + selectedUser.user.imagen
                          : userDefault
                      "
                      alt=""
                    />
                    <div>
                      <p className="text-white font-semibold text-[15px]">
                        {{ selectedUser.user.firstName }}
                      </p>
                      <p className="text-white font-semibold text-[15px]">
                        Sway Score: {{ swayScore }}
                      </p>
                    </div>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-2"
                  color="red-darken-1"
                  variant="text"
                  @click="isModalActive = false"
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

          <table>
            <thead>
              <tr>
                <th>
                  <TableCheckboxCell @checked="handleAllChecked($event)" />
                </th>
                <th>
                  <div class="flex items-center">
                    Name
                    <a @click="sort('firstName')">
                      <svg
                        class="w-5 h-5 ml-1.5"
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
                <th>
                  <div class="flex items-center">
                    Status
                    <a @click="sort('status')">
                      <svg
                        class="w-5 h-5 ml-1.5"
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
                <th v-if="role == 'admin'">Phone Number</th>
                <th>
                  <div class="flex items-center">
                    Created
                    <a @click="sort('createdAt')">
                      <svg
                        class="w-5 h-5 ml-1.5"
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
                <th>Challenge</th>
                <th>Detail</th>
                <!-- <th>More Info</th> -->
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(client, index) in sortedUsers"
                :key="client.id"
                v-bind:index="index"
              >
                <td class="flex flex-column items-center justify-center">
                  <label class="checkbox">
                    <input
                      name="checkbox"
                      v-model="membersSelected[`id-${client.user.id}`]"
                      :value="client.user.id"
                      type="checkbox"
                      @change="
                        handleChecked(
                          membersSelected[`id-${client.user.id}`],
                          client,
                          index
                        )
                      "
                    />
                    <span class="check" />
                  </label>
                </td>

                <td data-label="Name">
                  {{ `${client.user.firstName}` }}
                </td>
                <td data-label="Status">
                  {{ statusShow(client.user.status) }}
                </td>
                <td v-if="role == 'admin'">
                  {{ client.user.phone }}
                </td>

                <td data-label="Created">
                  {{ UtilityMehods.formatDate(client.user.createdAt) }}
                </td>
                <td>
                  <img
                    v-if="!checkFile(client.url)"
                    :src="host + client.url"
                    class="miniPlayer rounded-md"
                    style="max-width: 80px"
                  />
                  <video
                    v-else
                    :src="host + client.url"
                    class="miniPlayer rounded-md"
                    style="max-width: 80px"
                    controls
                  ></video>
                </td>
                <td data-label="Sway Score" class="lg:w-32">
                  <div
                    class="flex flex-column justify-space-between gap-1"
                    style="height: 100px; align-items: flex-start"
                  >
                    <BaseButtons type="justify-center lg:justify-end" no-wrap>
                      <BaseButton
                        :color="'info'"
                        :icon="mdiInformation"
                        small
                        @click="onClickSelectedUser(client)"
                      />
                    </BaseButtons>
                    <BaseButtons type="justify-center lg:justify-end" no-wrap>
                      <BaseButton
                        :color="'info'"
                        :icon="mdiGift"
                        small
                        @click="openRewardModal(client)"
                      />
                    </BaseButtons>
                    <BaseButtons type="justify-center lg:justify-end" no-wrap>
                      <BaseButton
                        :color="'info'"
                        :icon="mdiCloudDownload"
                        small
                        @click="downloadUserChallengeFile(client)"
                      />
                    </BaseButtons>
                  </div>

                  <!-- <p class="italic font-bold">{{ client.user.pointsCount }}</p>
                <progress
                  class="flex w-2/5 self-center lg:w-full"
                  max="100"
                  :value="client.user.pointsCount"
                > -->
                  <!-- {{ client.userChallenges }} -->
                  <!-- </progress> -->
                </td>
              </tr>
            </tbody>
          </table>
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
        </CardBox>
      </SectionMain>
      <v-snackbar v-model="snackbar" :timeout="3000" color="blue">
        <p class="text-xl italic font-bold">New Challenge has been added</p>

        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <div v-else class="flex align-center justify-center h-screen">
      <LoadingSpinner></LoadingSpinner>
    </div>
  </LayoutAuthenticated>
</template>

<style>
.actions div {
  margin-bottom: 0 !important;
}

.my-button {
  margin: 5px;
  font-weight: 600;
  color: "#1B2C34";
  font-size: 20px;
}
</style>
