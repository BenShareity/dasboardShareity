<script setup>
import {
  ref,
  watchEffect,
  onMounted,
} from "vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import UserController from "@/controllers/UserController";
import {
  mdiSendCircle,
  mdiMagnify,
  mdiAbTesting,
  mdiPaperclip,
  mdiDotsHorizontal,
  mdiArrowLeftDropCircle
} from "@mdi/js";
import BaseIcon from "@/components/BaseIcon.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useSocketStore } from "@/stores/socket";
import BaseButton from "@/components/BaseButton.vue";
const profile = ref({});
const idSteve = ref(1);
const host = import.meta.env.VITE_IMAGE_HOST;
const dataObjectChat = ref(null);
const userChats = ref({});
const loadingChat = ref(false);
const loading = ref(false);
const message = ref("");
const socketConnect = useSocketStore()
watchEffect(async () => {
  profile.value = await UserController.getMyProfile();
  
});

onMounted( async () => {
  loading.value = true
  await socketConnect.socketGet()
  getMessages();  
  socketConnect.socket.on('connect', () => {
    console.log('Sokect chat');
                    })
                    socketConnect.socket.on("newMessageResived", (data) => {
    refreshScroll()
    userChats.value[data.userFrom.id].chatMessages.push(data);
  });
});
const sendMessageUser = (e) => {
  e.preventDefault();
  const encodedMessages = encodeURIComponent(message.value)
  let dataSend = {
    idFrom: idSteve.value,
    idTo: dataObjectChat.value.id,
    message: message.value,
  };

  socketConnect.socket.emit("createMessage", dataSend, (set) => {
    message.value = "";
    let scrollIng = document.querySelector(".scrolling");
    userChats.value[set.userTo.id].chatMessages.push(set);
    setTimeout(() => {
      scrollIng.scrollTop = scrollIng.scrollHeight;
    }, 5);
    console.log(set);
  });
};

const getChats = (chats) => {
  loadingChat.value = true;
  chats.chatMessages.map((msg) =>{
      const decodedMessages = decodeURIComponent(msg.message)
    msg.message = decodedMessages    
    })
  setTimeout(() => {
    
    dataObjectChat.value = chats;
    refreshScroll()
    loadingChat.value = false;
  }, 1200);
};
const refreshScroll = () =>{
  
    setTimeout(() => {
      const scrollIng = document.querySelector(".scrolling");
      scrollIng.scrollTop = scrollIng.scrollHeight;
    }, 5);
}
const getMessages = () => {
  socketConnect.socket.emit("findMessagesforSteve", (data) => {
    
    userChats.value = data;
    console.log(data);
    loading.value = false 
  });
};
</script>

<template>
  <LayoutAuthenticated>
    
    <div class="h-[89vh]">
      <SectionMain class="h-full !ml-10 !mr-[70px] !max-w-full">
        <div class="flex gap-2 items-center mb-[10px] ">
          <BaseButton to="/dashboard" :icon="mdiArrowLeftDropCircle" color="info" rounded-full small />
          <p class="font-semibold text-[23px]">Chat Steve</p>
      </div>
      <div v-if="loading" class="w-full h-full justify-center items-center flex">
        <LoadingSpinner />
      </div>
        <div class="flex h-full w-full shadow-xl" v-else>
          <div class="w-[50%] flex flex-col h-full shadow-[1px_1px_10px_1px_#8080801a;]">
            <div class="h-[100px]">
              <div class="h-full p-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-[70px] h-[70px]">
                      <img class="w-full h-full object-contain rounded-full shadow-lg"
                        src="../../assets/img/png/steve_buy_usd.png" />
                    </div>
                    <div>
                      <span class="text-[21px]">Steve</span>
                      <p class="text-[14px]">Hi!, I'am Steve</p>
                    </div>
                  </div>
                  <BaseIcon :path="mdiDotsHorizontal" w="w-10" h="h-10" class="sizeIconClip text-[#8080806e]" />
                </div>
              </div>
            </div>
            <div class="h-full w-full p-[15px] flex items-center overflow-hidden">
              <div class="w-full h-full shadow-[1px_1px_10px_1px_#80808036] rounded-[38px]">
                <div class="h-full w-full p-[10px] overflow-hidden">
                  <div class="w-full relative p-[13px]">
                    <div class="flex items-center justify-center">
                      <input type="text" placeholder="Send Message..."
                        class="w-full pl-4 rounded-[20px] shadow-lg text-base p-4 bg-gray-400/10" />
                      <BaseIcon :path="mdiMagnify" w="w-10" h="h-10"
                        class="absolute right-[17px] sizeIconSearch text-[#8080806e]" />
                    </div>
                  </div>
                  <div class="flex flex-col w-full h-full overflow-auto">
                    <div class="p-2 pt-[13px] pb-[12px]" :class="userChats[chats]?.id === dataObjectChat?.id
                        ? 'bg-[#5f5b5b0d] rounded-[9px]'
                        : ''
                      " v-for="(chats, index) in Object.keys(userChats)" :key="index">
                      <div class="flex items-center justify-between" @click="getChats(userChats[chats])">
                        <div class="flex gap-2 items-center">
                          <div class="w-[59px] h-[59px]">
                            <img class="w-full h-full object-contain rounded-full shadow-lg" :src="userChats[chats]?.imagen === null
                                ? '../../assets/img/png/steve_buy_usd.png'
                                : host + userChats[chats]?.imagen
                              " />
                          </div>

                          <span>{{ userChats[chats].firstName }}</span>
                          <span>{{ userChats[chats].lastName }}</span>
                        </div>
                        <span
                          class="rounded-full w-[28px] h-[28px] p-[3px] shadow-xl text-center bg-blue-500 text-[15px] font-semibold text-white"
                          @change="read(userChats[chats].id)" v-if="countMessageUserread">
                          {{ countMessageUserResived }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="loadingChat" class="w-full h-full justify-center items-center flex">
            <LoadingSpinner />
          </div>
          <div class="w-full h-full" v-else>
            <div class="w-full h-full flex flex-col" v-if="dataObjectChat">
              <div class="h-[94px] p-[10px] shadow-[1px_1px_10px_1px_#80808012] w-full">
                <div class="h-full">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-[70px] h-[70px]">
                        <img class="w-full h-full object-contain rounded-full shadow-lg" :src="dataObjectChat?.imagen
                            ? host + dataObjectChat?.imagen
                            : '../../assets/img/png/steve_buy_usd.png'
                          " />
                      </div>
                      <div>
                        <span class="text-[21px]">{{
                          dataObjectChat?.firstName
                        }}</span>
                        <p class="text-[14px]">
                          Hi!, I'am {{ dataObjectChat?.firstName }}
                        </p>
                      </div>
                    </div>
                    <div class="flex">
                      <BaseIcon :path="mdiMagnify" w="w-10" h="h-10" class="sizeIconClip text-[#8080806e]" />
                      <BaseIcon :path="mdiDotsHorizontal" w="w-10" h="h-10" class="sizeIconClip text-[#8080806e]" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full h-full  overflow-hidden">
                <div class="h-full p-4 overflow-auto scrolling">
                  <div class="w-full mt-2 " v-for="chatMessageUser in dataObjectChat?.chatMessages" :class="chatMessageUser.userFrom.id === idSteve
                      ? '   flex justify-end'
                      : '  flex justify-start'
                    ">
                    <div class="w-[410px] flex" :class="chatMessageUser.userFrom.id === idSteve
                        ? ' justify-end'
                        : 'justify-start'
                      ">
                      <div class="rounded-[20px] p-[15px] pr-[25px] w-fit" :class="chatMessageUser.userFrom.id === idSteve
                          ? '   bg-blue-400/80 rounded-br'
                          : '  bg-gray-200/50 rounded-bl'
                        ">
                        <p class="text-[#2a2a2bde]">
                          {{  chatMessageUser.message }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form @submit="sendMessageUser">
                <div class="w-full p-5 rounded-bl-3xl rounded-br-3xl">
                  <div class="relative">
                    <div class="flex justify-center items-center">
                      <BaseIcon :path="mdiPaperclip" w="w-10" h="h-10"
                        class="absolute left-[6px] sizeIconClip text-[#8080806e] cursor-pointer" />
                      <input type="text" placeholder="Send Message..."
                        class="w-full p-[15px] pl-[43px] pr-[56px] rounded-[20px] shadow-lg text-base"
                        v-model="message" />
                      <BaseIcon :path="mdiSendCircle" w="w-10" h="h-10"
                        class="absolute right-[12px] sizeIcon text-[#2563eb] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div v-else class="w-full h-full justify-center items-center flex flex-col text-2xl text-gray-400">
              <p>Hello Steve!</p>
              <p>Welcome to your Chats, select one of them to start chatting</p>
            </div>
          </div>
        </div>
      </SectionMain>
    </div>
  </LayoutAuthenticated>
</template>

<style scope>
.sizeIcon>svg {
  height: 50px;
  width: 42px;
}

.sizeIconSearch>svg {
  height: 34px;
  width: 31px;
}

.sizeIconClip>svg {
  width: 30px;
  height: 35px;
}
</style>
