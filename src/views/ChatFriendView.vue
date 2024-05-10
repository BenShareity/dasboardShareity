<script setup>
import {
  reactive,
  ref,
  watch,
  watchEffect,
  onMounted,
  onBeforeMount,
} from "vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { io } from "socket.io-client";
import UserController from "@/controllers/UserController";
import { useSocketStore } from "@/stores/socket";
import {
  mdiSendCircle,
  mdiMagnify,
  mdiAbTesting,
  mdiPaperclip,
  mdiDotsHorizontal,
  mdiArrowLeftDropCircle,
} from "@mdi/js";
import BaseIcon from "@/components/BaseIcon.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from "vue-router";
const socketConnect = useSocketStore();
const profile = ref({});
const dataChatMessages = ref([]);
const route = useRoute();
const host = import.meta.env.VITE_IMAGE_HOST;
const loading = ref(false);
const message = ref("");
const dataFriend = ref({});
const readVar = ref(false);
const getStogareUser = ref(localStorage.getItem("userName"));
watchEffect(async () => {
  loading.value = true;
  dataFriend.value = await UserController.getUserName(getStogareUser.value);
  readMessageFriend();
});
onMounted(async () => {
  await socketConnect.socketGet();
  profile.value = await UserController.getMyProfile();
  getMessagesFriends();
  newMessageResived();
});
const sendMessageFriends = (e) => {
  e.preventDefault();
  let dataSend = {
    idFrom: profile.value.id,
    idTo: parseInt(route.params.id),
    message: encodeURIComponent(message.value),
  };

  socketConnect.socket.emit("createMessage", dataSend, (msg) => {
    console.log(msg);
    if (msg) {
      message.value = "";
    }
    getMessagesFriends();
  });
};
const getMessagesFriends = () => {
  let dbGet = {
    userId: profile.value.id,
    friendId: parseInt(route.params.id),
  };
  socketConnect.socket.emit("findAllMessages", dbGet, (get) => {
    get.map((msg) => {
      msg.message = decodeURIComponent(msg.message);
    });
    loading.value = false;
    dataChatMessages.value = get.reverse();
    console.log(get);

    refreshScroll();
  });
};

const refreshScroll = () => {
  if (dataChatMessages.value.length > 3) {
    setTimeout(() => {
      const scrollIng = document.querySelector(".scrolling");
      scrollIng.scrollTop = scrollIng.scrollHeight;
    }, 5);
  }
};
const readMessageFriend = () => {
  let dataRead = {
    userFrom: route.params.id,
    userTo: profile.value.id,
  };
  socketConnect.socket.emit("setMessagesRead", dataRead, (get) => {
    readVar.value = true;
    console.log("get", get);
  });
};

const newMessageResived = () => {
  socketConnect.socket.on("newMessageResived", (data) => {
    refreshScroll();

    getMessagesFriends();
  });
};
</script>

<template>
  <LayoutAuthenticated>
    <div class="h-[90vh]">
      <SectionMain class="h-full">
        <div class="flex gap-2 items-center mb-[10px]">
          <BaseButton
            to="/friends"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="font-semibold text-[23px]">Back</p>
        </div>
        <div
          v-if="loading"
          class="w-full h-full justify-center items-center flex"
        >
          <LoadingSpinner />
        </div>
        <div class="flex h-full w-full shadow-xl" v-else>
          <div class="w-full h-full">
            <div class="w-full h-full flex flex-col">
              <div
                class="h-[94px] p-[10px] shadow-[1px_1px_10px_1px_#80808012] w-full"
              >
                <div class="h-full">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-[70px] h-[70px]">
                        <img
                          class="w-full h-full object-contain rounded-full shadow-lg"
                          :src="
                            dataFriend?.imagen
                              ? host + dataFriend?.imagen
                              : '../../assets/social/sinfoto.jpg'
                          "
                        />
                      </div>
                      <div>
                        <span class="text-[21px]">{{
                          `${dataFriend.firstName}
                                                    ${dataFriend.lastName}`
                        }}</span>
                        <p class="text-[14px]">
                          Hi!, I'am {{ dataFriend.firstName }}
                        </p>
                      </div>
                    </div>
                    <div class="flex">
                      <BaseIcon
                        :path="mdiMagnify"
                        w="w-10"
                        h="h-10"
                        class="sizeIconClip text-[#8080806e]"
                      />
                      <BaseIcon
                        :path="mdiDotsHorizontal"
                        w="w-10"
                        h="h-10"
                        class="sizeIconClip text-[#8080806e]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="dataChatMessages.length === 0"
                class="w-full h-full justify-center items-center flex flex-col text-[#8080808a] font-normal text-[25px]"
              >
                <p>Welcome {{ profile.firstName }}</p>
                <p>send your first message to {{ dataFriend.firstName }}</p>
              </div>
              <div class="w-full h-full overflow-hidden" v-else>
                <div class="h-full p-4 overflow-auto scrolling">
                  <div
                    class="w-full mt-2"
                    v-for="chatMessageUser in dataChatMessages"
                    :class="
                      profile.id === chatMessageUser.userFrom.id
                        ? '   flex justify-end'
                        : '  flex justify-start'
                    "
                  >
                    <div
                      class="w-[410px] flex"
                      :class="
                        profile.id === chatMessageUser.userFrom.id
                          ? ' justify-end'
                          : 'justify-start'
                      "
                    >
                      <div
                        class="rounded-[20px] p-[15px] pr-[25px] w-fit"
                        :class="
                          profile.id === chatMessageUser.userFrom.id
                            ? '   bg-blue-400/80 rounded-br'
                            : '  bg-gray-200/50 rounded-bl'
                        "
                      >
                        <p class="text-[#2a2a2bde]">
                          {{ chatMessageUser.message }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form @submit="sendMessageFriends">
                <div class="w-full p-5 rounded-bl-3xl rounded-br-3xl">
                  <div class="relative">
                    <div class="flex justify-center items-center">
                      <BaseIcon
                        :path="mdiPaperclip"
                        w="w-10"
                        h="h-10"
                        class="absolute left-[6px] sizeIconClip text-[#8080806e] cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder="Send Message..."
                        class="w-full p-[15px] pl-[43px] pr-[56px] rounded-[20px] shadow-lg text-base"
                        v-model="message"
                      />
                      <BaseIcon
                        :path="mdiSendCircle"
                        w="w-10"
                        h="h-10"
                        class="absolute right-[12px] sizeIcon text-[#2563eb] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </SectionMain>
    </div>
  </LayoutAuthenticated>
</template>

<style scope>
.sizeIcon > svg {
  height: 50px;
  width: 42px;
}

.sizeIconSearch > svg {
  height: 34px;
  width: 31px;
}

.sizeIconClip > svg {
  width: 30px;
  height: 35px;
}
.scrolling {
  height: 100% !important;
}
</style>
