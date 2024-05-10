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
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import UserController from "@/controllers/UserController";

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
import FriendsController from "@/controllers/FriendsController";
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
const profile = ref({});
const friends = ref([]);
// const route
const router = useRouter();
const loading = ref(false);
const host = ref(import.meta.env.VITE_IMAGE_HOST);
const noPic = "default/nopic.jpg";
watchEffect(async () => {
  loading.value = true;
  profile.value = await UserController.getMyProfile();
  friends.value = await FriendsController.getFriends();
  loading.value = false;

  console.log(friends.value);
});
const goChatsFriends = (friend) => {
  console.log(friend);
  router.push(`/friends/chat/${friend.id}`);
  localStorage.setItem("userName", friend.username);
};
</script>

<template>
  <LayoutAuthenticated>
    <div class="h-[89vh]">
      <SectionMain class="h-full">
        <div class="flex gap-2 items-center mb-[10px]">
          <BaseButton
            to="/dashboard"
            :icon="mdiArrowLeftDropCircle"
            color="info"
            rounded-full
            small
          />
          <p class="font-semibold text-[23px]">Friends</p>
        </div>
        <div class="w-full h-full">
          <div
            class="h-full shadow-lg p-7 pt-[60px] rounded-lg overflow-hidden"
          >
            <div class="flex flex-col h-full w-full gap-5 overflow-auto">
              <div
                v-if="loading"
                class="flex justify-center items-center w-full h-full"
              >
                <LoadingSpinner />
              </div>
              <div
                class="text-[#2f2f2f2e] font-medium w-full h-full flex justify-center items-center text-[30px]"
                v-else-if="friends.length == 0"
              >
                You still don't have friends
              </div>
              <div
                v-else
                v-for="(friend, index) in friends"
                :key="index"
                class="flex p-5 shadow-md rounded-lg"
              >
                <div class="flex items-center w-full gap-2">
                  <div class="w-[54] h-[54px]">
                    <img
                      :src="
                        !friend?.imagen ? host + noPic : host + friend?.imagen
                      "
                      class="w-full h-full object-contain object-center"
                    />
                  </div>
                  <div class="flex items-center justify-between w-full pr-2">
                    <div>
                      <span class="text-[#4d4d4d] font-medium text-[19px]">{{
                        `${friend.firstName} ${friend.lastName}`
                      }}</span>
                      <!-- <p>{{array.descriptions}}</p> -->
                      <p class="text-[#000000] font-bold text-[13px]">
                        {{
                          friend.messages
                            ? `${friend.firstName}, He has sent you ${friend.messages} new messages`
                            : null
                        }}
                      </p>
                    </div>
                    <div class="position relative">
                      <!-- <div>{{array.messages ? array.messages : null }}</div> -->
                      <button
                        class="w-[85px] h-[45px] shadow-lg bg-[#2563eb] text-white rounded-lg font-semibold text-[18px]"
                        @click="goChatsFriends(friend)"
                      >
                        Chats
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
</style>
