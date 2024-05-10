<script setup>
import { mdiVolumeHigh } from "@mdi/js";
import { mdiVolumeMute } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import LayoutSpecial from "@/layouts/LayoutSpecial.vue";
import SectionMain from "@/components/SectionMain.vue";
import { computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import ChallengeController from "@/controllers/ChallengeController";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";

// import Swiper and modules styles
import "swiper/css";
import BaseButton from "@/components/BaseButton.vue";

// const socket = io("localhost:3000/my-event2", { transports: ["pooling"] });
// console.log("io", socket);
// const msgList = ref([]);
// const newMessage = () => {
//   socket.emit("message", { data: "Mensaje" });
// };

// socket.on("message", ({ data }) => {
//   handleNewMessage(data);
// });

// const handleNewMessage = (message) => {
//   msgList.value.push(message);
// };

// socket.onopen = function (e) {
//   console.log("[open] Connection established");
//   console.loog("Sending to server");
//   socket.send("My name is John");
// };

const imageHost = import.meta.env.VITE_IMAGE_HOST;
const frontHost = import.meta.env.VITE_FRONT_HOST;
const imgUserDefault = "default/user_default.png";
const imgPlay = "default/play_button.png";
const imgPause = "default/pause_button.png";
const route = useRoute();
const dataChallenge = ref({});
const allChallenges = ref([]);
const challengesFeedMain = ref();
const challengesFeed = ref([]);
const snackbar = ref(false);
const iconPlay = ref(true);
const isVideo = ref(false);
const UrlShared = ref();
const videoRef = ref(null);
var swiperRef = ref(null);
const videoDuration = ref([]);
const currentIndex = ref(null);
const videoMuteStates = ref([]);
const isMuted = ref(true);

const setSwiperRef = (swiper) => {
  swiperRef = swiper;
};

const shareUrl = computed(() => {
  let color = dataChallenge.value.color.replace("#", "");
  return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${color}&data=${frontHost}challenges/${route.query.id}`;
});

onMounted(() => {
  ChallengeController.getChallenges(route.query.id).then((data) => {
    dataChallenge.value = data;
    allChallenges.value = data.userChallenges;
    challengesFeed.value = data.userChallenges.filter(
      (value) => value.user.firstName !== "Unknown"
    );
    // console.log(`challengesFeed.value`, challengesFeed.value);
    // challengesFeedMain.value = challengesFeed.value.shift();
    challengesFeedMain.value = challengesFeed.value[0];
    // console.log(`challengesFeedMain`, challengesFeedMain.value);
    isVideo.value = checkFile(challengesFeedMain.value.url);
    getUrlShared();
  });
});

watch(videoRef, (video) => {
  if (!!isVideo.value) {
    videoPausePlay(0);
  }
});

function swiperNext() {
  swiperRef.slideNext();
  videoPausePlay(swiperRef.activeIndex);
}

async function onSlideChange(e) {
  challengesFeedMain.value = challengesFeed.value[e.activeIndex];
  getUrlShared();

  if (!!isVideo.value) {
    let video = videoRef.value;
    video[e.previousIndex]?.pause();
  }
}

function getUrlShared() {
  // actualizar info y qr del video
  ChallengeController.getUrlUserChallengeShared(
    challengesFeedMain.value.id
  ).then((data) => {
    let color = dataChallenge.value.color.replace("#", "");

    UrlShared.value = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${color}&data=${frontHost}userChallenge/shares/${data.twilio.id}/${challengesFeedMain.value.id}`;

    console.log(
      "UrlShared",
      `${frontHost}/userChallenge/shares/${data.twilio.id}/${challengesFeedMain.value.id}`
    );
  });
}

function videoPausePlay(index) {
  let video = videoRef.value[index];

  if (video.paused) {
    video?.play();
    iconPlay.value = false;
    video.muted = isMuted.value;
    videoMuteStates[index] = isMuted.value;
  } else {
    video?.pause();
    iconPlay.value = true;
    video.muted = !videoMuteStates[index];
    isMuted.value = video.muted;
  }
}
// watch(isMuted.value, async (newQuestion, oldQuestion) => {
//   const videoElement = videoRef.value[currenIndex.value];
//   if (videoElement) {
//     if (newQuestion) {
//       videoElement.muted = true;
//       }else {
//         videoElement.muted = false;
//         }

// } } )
function muteClick(index) {
  currentIndex.value = index;
  isMuted.value = !isMuted.value;
  videoMuteStates[index] = isMuted.value;
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
</script>

<template>
  <LayoutSpecial>
    <SectionMain v-if="dataChallenge.badge" class="w-full">
      <CardBox>
        <div class="flex flex-col md:flex-row items-center">
          <div class="relative flex justify-center items-center gap-6">
            <!-- Si quieres un qr + badge unificado descomenta esto -->
            <!-- <img
              class="absolute md:relative w-10 md:w-28 rounded-md shadow-md mb-3 md:m-0"
              :src="imageHost + dataChallenge.badge"
            /> -->
            <img
              class="w-24 rounded-md shadow-md mb-3 md:m-0"
              :src="imageHost + dataChallenge.badge"
            />
            <img
              class="md:hidden w-20 rounded-md shadow-md mb-3 md:m-0"
              :src="shareUrl"
            />
          </div>

          <div class="flex flex-col mx-5 gap-3 flex-1">
            <p class="text-4xl font-extrabold">
              {{ dataChallenge.name }}
            </p>
            <p class="text-lg font-light">
              {{ dataChallenge.description }}
            </p>
          </div>
          <img
            class="hidden md:block w-24 rounded-md shadow-md mb-3 md:m-0"
            :src="shareUrl"
          />
        </div>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <CardBox>
        <p class="text-center text-gray-600 mb-6 text-4xl font-extrabold">
          LIVE FEED
        </p>

        <div
          class="overflow-y-auto grid grid-cols-1 md:grid-cols-2 items-center gap-6"
        >
          <div v-if="challengesFeedMain">
            <div class="grid grid-cols-2 w-40 mx-auto mb-6">
              <img
                class="w-16 h-16 object-cover rounded-full"
                :src="
                  challengesFeedMain.user.imagen
                    ? imageHost + challengesFeedMain.user.imagen
                    : imageHost + imgUserDefault
                "
              />
              <div class="flex w-full flex-col">
                <p class="text-lg font-bold">
                  {{ `${challengesFeedMain.user.firstName}` }}
                </p>
                <div class="flex w-full justify-between">
                  <div class="flex flex-col text-left">
                    <p class="text-xs">
                      <b>Points:</b>
                      <span class="text-blue-500">
                        {{ ` ${challengesFeedMain.user.pointCount}` }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <img
              class="block mx-auto w-40 rounded-md shadow-md"
              :src="UrlShared"
            />
          </div>

          <div class="rounded-md shadow-inner">
            <swiper
              v-if="isVideo"
              direction="vertical"
              :pagination="{
                clickable: true,
              }"
              @slideChange="onSlideChange"
              @swiper="setSwiperRef"
            >
              <swiper-slide
                v-for="(challenge, index) in challengesFeed"
                class="rounded-md shadow-xl relative"
                :key="challenge.id"
              >
                <img
                  class="icon-video absolute z-10 pointer-events-none"
                  v-if="iconPlay"
                  :src="imageHost + imgPlay"
                />
                <img
                  class="icon-video absolute dipel-effect z-10 pointer-events-none"
                  v-else
                  :src="imageHost + imgPause"
                />
                <div class="relative w-[300px] h-full flex justify-center">
                  <div class="absolute top-4 z-[100] right-[10%]">
                    <BaseButton
                      class="mr-5 bg-transparent border-none"
                      :icon="isMuted ? mdiVolumeMute : mdiVolumeHigh"
                      small
                      @click="muteClick(index)"
                    />
                  </div>
                  <video
                    ref="videoRef"
                    class="h-full"
                    :muted="isMuted"
                    @click="videoPausePlay(index)"
                    :poster="imageHost + challenge.photoUrl"
                    :src="imageHost + challenge.url"
                    @ended="swiperNext"
                  ></video>
                </div>
              </swiper-slide>
            </swiper>

            <swiper
              v-else
              direction="vertical"
              :pagination="{
                clickable: true,
              }"
              @slideChange="onSlideChange"
              :modules="[Autoplay]"
              :autoplay="{
                delay: 3000,
                disableOnInteraction: true,
              }"
            >
              <swiper-slide
                v-for="(challenge, index) in challengesFeed"
                class="rounded-md shadow-xl relative"
                :key="challenge.id"
              >
                <img
                  ref="videoRef"
                  class="h-full"
                  :poster="imageHost + challenge.photoUrl"
                  :src="imageHost + challenge.url"
                />
              </swiper-slide>
            </swiper>
          </div>
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
  </LayoutSpecial>
</template>

<style scoped>
.swiper {
  width: 100%;
  height: 60vh;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dipel-effect {
  animation: moveAndOpacity 1.2s forwards;
}
@keyframes moveAndOpacity {
  0% {
    transform: translateX(0);
    opacity: 1;
  }

  /* 
  50%  { transform: translateX(10rem); opacity: 0.; }  */
  100% {
    transform: translateX(0);
    opacity: 0;
  }
}
.icon-video {
  max-height: 70px !important;
  max-width: 70px !important;
}

.position_a {
  position: relative;
}

.position_r {
  position: absolute;
  top: 10px;
  right: 138px;
}

.bg_btn {
  background-color: transparent;
}
</style>
