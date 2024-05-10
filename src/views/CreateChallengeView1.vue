<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import {
  mdiAccount,
  mdiAccountGroup,
  mdiHandCoinOutline,
  mdiInformation,
  mdiMail,
  mdiArrowLeftDropCircle,
  mdiAnimation,
  mdiCamera
} from "@mdi/js";

import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
// import ColorPicker from "@/components/ColorPicker.vue";
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import SponsorController from "@/controllers/SponsorController";
import AnimationController from "@/controllers/AnimationController";
import ChallengeController from "@/controllers/ChallengeController";
import { useRoute, useRouter } from "vue-router";
import OrganizationController from "@/controllers/OrganizationController";
import UtilityMethods from "@/utility/utilityMethods";
import { useAlertStore } from "@/stores/alerts.js";
import UserController from "@/controllers/UserController";
import FormControlIcon from "@/components/FormControlIcon.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import { computed } from "vue";

const host = import.meta.env.VITE_IMAGE_HOST;
const route = useRoute();
const router = useRouter();

const challengeType = [
  { id: 1, label: "Picture" },
  { id: 2, label: "Selfie" },
  { id: 3, label: "Video" },
  { id: 4, label: "Audio" },
  { id: 5, label: "Game" },
  { id: 6, label: "Animation Image" },
  { id: 7, label: "Animation Video" },
  { id: 8, label: "Animation Share No Donate Image" },
  { id: 9, label: "Animation Share No Donate Video" },
  { id: 10, label: "No Donate Video" },
  { id: 11, label: "No Donate Meta Image" },
  { id: 12, label: "No Donate Meta Video" },
];

const inviteDonate = [
  { id: 1, label: "Yes" },
  { id: 2, label: "No" },
];

const challengeData = ref();
const startDate = ref();
const endDate = ref();
const lightbeatStartDate = ref();
const lightbeatEndDate = ref();
const sponsors = ref([]);
const animations = ref([]);
const organizations = ref([]);
const animationUrl = ref();
const lightbeatDesign = ref();
const typeDonationIcon = ref();
const introduction = ref();
const animation = ref();
const customQr = ref();
const insufficientCredit = ref(null);
const isLoading = ref(false);
const alertStore = useAlertStore();
const badge = ref();
const url = ref();
const bgChallengePreview = ref()
const file = ref()
const badgePreview = ref()
const profile = ref({});
const regeUrlLogo = ref(/^[^\/]+\/[^\/]+\.[^.\/]+$/);
const modalChallengeCredit = ref(false);
const animationObject = ref({ newAnimationName: "", newAnimationDuration: "" });
const donationObject = ref({
  typeDonationName: "",
});
let lightbeatDesignMedia = ref("");
let typeDonationIconMedia = ref("");
let animationMedia = ref("");
let introductionMedia = ref("");

const form = reactive({
  name: "",
  description: "",
  amount: "",
  maxAmount: "",
  donateName: "",
  instructions: "",
  shareMessage: "",
  shareMessageShort: "",
  type: challengeType[0],
  organization: organizations[0],
  sponsor: sponsors[0],
  animation: animations[0],
  inviteDonate: inviteDonate[0],
  haveSponsor: false,
  typeDonation: false,
  addLighBeat: false,
  reactions: false,
  addIntroduction: false,
  typeDonationName: "",
  addInstructions: false,
  newAnimation: false,
  newAnimationName: "",
  newAnimationDuration: "",
});
const title = route.query.id ? "Edit" : "Create";

watchEffect(async () => {
  profile.value = await UserController.getMyProfile();
  console.log(picker.color);
  if (badge.value) {
    console.log(badge.value);
  }
  SponsorController.getAllDashboard(true).then((data) => {
    let filteres = data.filter((item) => {
      return item.logo;
    });

    const filtradoMap = filteres.map((item) => {
      return {
        id: item.id,
        name: item.name,
        logo: regeUrlLogo.value.test(item.logo) ? item.logo : "",
      };
    });
    const res = filtradoMap.filter((item) => {
      return item.logo;
    });
    let resMap = res.map((item) => {
      return {
        id: item.id,
        label: item.name,
        logo: item.logo,
      };
    });
    console.log(resMap);
    sponsors.value = resMap;
    form.sponsor = resMap[0];
  });
  if (profile.value.rol !== "admin") {
    AnimationController.getByUser(profile.value.id).then((data) => {
      console.log(data);
      let list = data.map((item) => {
        return { id: item.id, label: item.name };
      });
      animations.value = list;
      form.animation = list[0];
    });
  } else {
    AnimationController.getAll().then((data) => {
      let list = data.value.map((item) => {
        return { id: item.id, label: item.name };
      });
      animations.value = list;
      form.animation = list[0];
    });
  }
  OrganizationController.getDashboard().then((data) => {
    console.log(profile.value.rol);

    let filteres = data.filter((item) => {
      return item.logo;
    });

    const filtradoMap = filteres.map((item) => {
      return {
        id: item.id,
        name: item.name,
        logo: regeUrlLogo.value.test(item.logo) ? item.logo : "",
      };
    });
    const res = filtradoMap.filter((item) => {
      return item.logo;
    });
    let resMap = res.map((item) => {
      return { id: item.id, label: item.name, logo: item.logo };
    });
    organizations.value = resMap;
    form.organization = resMap[0];
  });
  if (route.query.id)
    ChallengeController.getById(route.query.id).then((data) => {
      console.log("edit", data);
      challengeData.value = data;
      form.badge = host + data.badge;
      form.url = host + data.url;
      typeDonationIcon.value = host + data.typeDonationIcon;
      startDate.value = data.startDate;
      endDate.value = data.endDate;
      form.name = data.name;
      form.description = data.description;
      form.amount = data.amount;
      form.maxAmount = data.maxAmount;
      form.donateName = data.donateName;
      form.instructions = data.instructions;
      form.shareMessage = data.shareMessage;
      form.shareMessageShort = data.shareMessageShort;
      form.type = challengeType.filter(
        (type) => type.id === data.resource.id
      )[0];
      form.organization = organizations.value.filter(
        (org) => org.id === data.organization.id
      )[0];
      form.sponsor =
        data.sponsors.length > 0
          ? sponsors.value.filter(
            (spn) => spn.id === data.sponsors[0].sponsor.id
          )[0]
          : null;
      form.typeDonationName = data.typeDonationDescription;
      form.inviteDonate =
        data.inviteDonate == 1 ? inviteDonate[0] : inviteDonate[1];
      form.haveSponsor = data.sponsors.length == 0;
      form.typeDonation = data.typeDonation === "object";
      form.addLighBeat = data.lightbeatStartDate ? true : false;
      form.reactions = data.reactions == 1;
      form.addInstructions = data.instructions != "";
      picker.color = data.color;
    });

}, [route.query.id]);

watch(() => { });

const picker = reactive({
  showcolorpicker: false,
  color: "#59c7f9",
  suckerCanvas: null,
  suckerArea: [],
  isSucking: false,
});

const changeColor = (color) => {
  picker.color = color.hex;
};
const isVideo = computed(() => {
  if (!file.value) {
    return false;
  }
  if (file.value instanceof File) {
    const extension = file.value.name.split(".").pop();
    return extension === "mp4" || extension === "mov";
  } else if (file.value instanceof String || file.value instanceof URL) {
    const extension = file.value.split(".").pop();
    return extension === "mp4" || extension === "mov";
  }
});
const playVideo = () => {
  isVideo.value.play
}
const handleBadge = (newValue) => {
  badge.value = newValue;
  badgePreview.value = URL.createObjectURL(newValue)
  console.log("aja", badgePreview.value);
};

const handleUrl = (newValue) => {
  url.value = newValue;
  file.value = newValue
  bgChallengePreview.value = URL.createObjectURL(newValue)
};

const handleLightbeatDesign = (newValue) => {
  lightbeatDesign.value = newValue;
};
const handleTypeDonationIcon = (newValue) => {
  typeDonationIcon.value = newValue;
};
const handleIntroduction = (newValue) => {
  introduction.value = newValue;
};
const handleAnimationUrl = (newValue) => {
  animationUrl.value = newValue;
};

const test = async () => {
  alertStore.createAlert({
    title: "Challenge Created!",
    icon: "$success",
    text: "the challenge has been created successfully!",
  });
};

async function storeTempAnimation() {
  // animationObject.value = {
  //   newAnimationName: form.newAnimationName,
  //   newAnimationDuration: form.newAnimationDuration,
  //   newAnimation: animation.value
  // };

  // if (animation.value != undefined) {
  //   animationMedia.value = await UtilityMethods.verifyMedia(
  //     animation.value,
  //     "animations"
  //   );
  //   console.log(animationMedia.value);
  // }
  if (form.newAnimation) {
    let newAnimation = await UtilityMethods.verifyMedia(
      animationUrl.value,
      "animations"
    );
    let animationData = {
      idUsr: profile.value.id,
      recource: newAnimation,
      recourceJPG: newAnimation,
      duration: form.newAnimationDuration,
      name: form.newAnimationName,
      format: newAnimation.split(".")[1],
    };
    form.animation = await AnimationController.create(animationData).then(
      () => {
        AnimationController.getByUser(profile.value.id).then((data) => {
          console.log(data);
          let list = data.map((item) => {
            return { id: item.id, label: item.name };
          });
          animations.value = list;
          form.animation = list[0];
        });
      }
    );
  }
  form.newAnimation = false;
}
async function storeTempDonationType() {
  donationObject.value = {
    typeDonationName: form.typeDonationName,
  };
  if (form.typeDonation) {
    typeDonationIconMedia.value = await UtilityMethods.verifyMedia(
      typeDonationIcon.value,
      "challenges"
    );
  }
  form.typeDonation = false;
}
async function storeTemplightbeat() {
  if (form.addLighBeat) {
    lightbeatDesignMedia.value = await UtilityMethods.verifyMedia(
      lightbeatDesign.value,
      "challenges"
    );
  }
  form.addLighBeat = false;
}
async function storeTempIntroduction() {
  introductionMedia = "";
  if (form.addIntroduction) {
    introductionMedia = await UtilityMethods.verifyMedia(
      introduction.value,
      "challenges"
    );
  }
  form.introduction = false;
}

const submit = async () => {

  /*   await ChallengeController.createThumbnail(url.value).then((response)=>{
    console.log("RESPONSE Thumbnail: ", response)
  }); */
  isLoading.value = true;
  // if (form.newAnimation) {
  //   let newAnimation = await UtilityMethods.verifyMedia(
  //     animationUrl.value,
  //     "animations"
  //   );
  //   let animationData = {
  //     idUsr: profile.value.id,
  //     recource: newAnimation,
  //     recourceJPG: newAnimation,
  //     duration: animationObject.newAnimationDuration,
  //     name: animationObject.newAnimationName,
  //     format: newAnimation.split(".")[1],
  //   };
  //   form.animation = await AnimationController.create(animationData);
  // }

  let badgeMedia = undefined;
  if (badge.value) {
    badgeMedia = await UtilityMethods.verifyMedia(badge.value, "challenges");
  }
  let urlMedia = undefined;
  if (url.value) {
    urlMedia = await UtilityMethods.verifyMedia(url.value, "challenges");
  }

  // let introductionMedia = "";
  // if (form.addIntroduction) {
  //   introductionMedia = await UtilityMethods.verifyMedia(
  //     introduction.value,
  //     "challenges"
  //   );
  // }

  let animationMedia = "";
  if (animation.value != undefined) {
    animationMedia = await UtilityMethods.verifyMedia(
      animation.value,
      "animations"
    );
  }

  let customQrMedia = "";
  if (customQr.value != undefined) {
    customQrMedia = await UtilityMethods.verifyMedia(
      customQr.value,
      "challenges"
    );
  }
  let challengeData = {
    idUsrCreate: profile.value.id,
    name: form.name,
    description: form.description,
    startDate: startDate.value,
    endDate: endDate.value,
    amount: form.amount,
    inviteDonate: form.inviteDonate.id == 1,
    maxAmount: form.maxAmount,
    lightbeatStartDate: lightbeatStartDate.value,
    lightbeatEndDate: lightbeatEndDate.value,
    shareMessage: form.shareMessage,
    shareMessageShort: form.shareMessageShort,
    reactions: form.reactions,
    color: picker.color,
    instructions: form.instructions,
    typeDonation: form.typeDonation ? "object" : "money",
    typeDonationDescription: donationObject.value.typeDonationName,
    idAnimation: form.animation.id,
    idSponsor: !form.haveSponsor ? form.sponsor.id : null,
    idResource: form.type.id,
    idOrganization: form.organization.id,
    badge: badgeMedia,
    url: urlMedia,
    lightbeatDesign: lightbeatDesignMedia.value,
    typeDonationIcon: typeDonationIconMedia.value,
    introduction: introductionMedia,
    animation: animationMedia,
  };
  let challengeUpdateData = {
    name: form.name,
    description: form.description,
    startDate: startDate.value,
    endDate: endDate.value,
    amount: form.amount,
    inviteDonate: form.inviteDonate.id == 1,
    maxAmount: form.maxAmount,
    lightbeatStartDate: lightbeatStartDate.value,
    lightbeatEndDate: lightbeatEndDate.value,
    shareMessage: form.shareMessage,
    shareMessageShort: form.shareMessageShort,
    reactions: form.reactions,
    color: picker.color,
    typeDonation: form.typeDonation ? "object" : "money",
    typeDonationDescription: form.typeDonationName,
    idResource: form.type.id,
    badge: badgeMedia,
    url: urlMedia,
    lightbeatDesign: lightbeatDesignMedia,
    typeDonationIcon: typeDonationIconMedia,
  };

  if (profile.value.rol != 'admin') {
    await ChallengeController.challengeCredits(challengeData?.maxAmount)
      .then((res) => { })
      .catch((error) => {

        insufficientCredit.value = error.response.data.message;
        alertStore.createAlert({
          title: "It seems you don't have enough credit",
          color: "error",
          icon: "$warning",
          text: insufficientCredit.value,
        });
        isLoading.value = false;
        console.log("este es el erro", error.response.data.message);
      });
    return
  }

  if (route.query.id) {
    challengeUpdateData.idChallenge = route.query.id;
    challengeUpdateData.idAnimation = form.animation.id;

    await ChallengeController.updateChallenge(
      route.query.id,
      challengeUpdateData
    )
      .then(async () => {
        console.log("color actualizado", challengeUpdateData.color);
        if (form.newAnimation) {
          await AnimationController.updateAnimation(
            challengeUpdateData.idAnimation,
            animationData
          );
        }
        alertStore.createAlert({
          title: "Challenge Updated!",
          icon: "$success",
          text: "the challenge has been Updated successfully!",
        });
        router.push("/campaigns");
      })
      .catch((error) => {
        alertStore.createAlert({
          title: "Error!",
          color: "error",
          icon: "$warning",
          text: "We could not create the challenge!",
        });
        console.log("error", error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    let userId = profile.value.id;
    let userRole = profile.value.rol;
    let amount = 1;

    console.log(userRole);
    await ChallengeController.createChallenge(challengeData)
      .then(() => {
        alertStore.createAlert({
          title: "Challenge Created!",
          icon: "$success",
          text: "the challenge has been created successfully!",
        });
        router.push("/campaigns");
      })
      .catch((error) => {
        alertStore.createAlert({
          title: "Error!",
          color: "error",
          icon: "$success",
          text: "We could not create the challenge!",
        });
        console.log("error", error);
      })
      .finally(() => {
        isLoading.value = false;
      });
    // if (userRole != "admin") amount = await UserController.getCredit(userId);
  }

};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Modal New Animation -->
      <v-dialog v-model="form.newAnimation" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Please fill fields to upload new animation
          </v-card-title>
          <div class="flex flex-column items-center justify-center flex-wrap gap-3 p-5">
            <div class="flex items-center justify-beetwen gap-2">
              <FormField v-if="form.newAnimation" label="Upload new animation" help="Max 500kb">
                <FormFilePicker label="Upload" :modelValue="animationUrl" v-on:update:model-value="handleAnimationUrl"
                  mediaClass="w-full h-96" />
              </FormField>

              <FormField v-if="form.newAnimation" label="Animation name" help="Required.">
                <FormControl v-model="form.newAnimationName" :icon="mdiAnimation" name="animationName" required
                  autocomplete="newAnimationName" />
              </FormField>

              <FormField v-if="form.newAnimation" label="Animation duration (seconds)" help="Required.">
                <FormControl v-model="form.newAnimationDuration" :icon="mdiAnimation" name="animationDuration" required
                  autocomplete="5" />
              </FormField>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="mr-2" color="red-darken-1" variant="text" @click="form.newAnimation = false">
                Cancel
              </v-btn>
              <v-btn class="mr-2" color="green-darken-1" variant="text" @click="storeTempAnimation()">
                Submit
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!-- Modal ligthbeat-->
      <v-dialog v-model="form.addLighBeat" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Please fill fields to type donation
          </v-card-title>
          <div class="flex flex-column items-center justify-center flex-wrap gap-3 p-5">
            <div class="flex items-center justify-beetwen gap-2">
              <FormField v-if="form.addLighBeat" label="Select Lightbeat Design">
                <FormFilePicker label="Upload" :modelValue="lightbeatDesign"
                  v-on:update:model-value="handleLightbeatDesign" />
              </FormField>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="mr-2" color="red-darken-1" variant="text" @click="form.addLighBeat = false">
                Cancel
              </v-btn>
              <v-btn class="mr-2" color="green-darken-1" variant="text" @click="storeTemplightbeat()">
                Submit
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!-- Modal Type donation -->
      <v-dialog v-model="form.typeDonation" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Please fill fields to type donation
          </v-card-title>
          <div class="flex flex-column items-center justify-center flex-wrap gap-3 p-5">
            <div class="flex items-center justify-beetwen gap-2">
              <FormField v-if="form.typeDonation" label="Name">
                <FormControl v-model="form.typeDonationName" :icon="mdiAccount" />
              </FormField>

              <FormField v-if="form.typeDonation" label="Select Image" help="Max 500kb">
                <FormFilePicker label="Upload" :modelValue="typeDonationIcon"
                  v-on:update:model-value="handleTypeDonationIcon" mediaClass="h-24 w-24 mt-3" />
              </FormField>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="mr-2" color="red-darken-1" variant="text" @click="form.typeDonation = false">
                Cancel
              </v-btn>
              <v-btn class="mr-2" color="green-darken-1" variant="text" @click="storeTempDonationType()">
                Submit
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!-- Modal add introduction -->
      <v-dialog v-model="form.addIntroduction" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            Please fill fields to type donation
          </v-card-title>
          <div class="flex flex-column items-center justify-center flex-wrap gap-3 p-5">
            <div class="flex items-center justify-beetwen gap-2">
              <FormField v-if="form.addInstructions" label="Challenge instructions">
                <FormControl v-model="form.instructions" :icon="mdiInformation" />
              </FormField>
              <FormField v-if="form.addIntroduction" label="Select Introduction Video" :v-show="title == 'Create'">
                <FormFilePicker label="Upload" :modelValue="introduction"
                  v-on:update:model-value="handleIntroduction" />
              </FormField>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="mr-2" color="red-darken-1" variant="text" @click="form.addIntroduction = false">
                Cancel
              </v-btn>
              <v-btn class="mr-2" color="green-darken-1" variant="text" @click="storeTempIntroduction()">
                Submit
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!-- Modal Insufficient credits -->
      <v-dialog v-model="modalChallengeCredit" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            {{ insufficientCredit }}
          </v-card-title>
          <div class="flex flex-column items-center justify-center flex-wrap gap-3 p-5">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="mr-2" color="red-darken-1" variant="text" @click="modalChallengeCredit = false">
                Cancel
              </v-btn>
              <v-btn class="mr-2" color="green-darken-1" variant="text" @click="() => router.push('/credits')">
                Get Credits
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>

      <div class="pb-5">
        <div class="flex justify-between pb-5">
          <div class="flex gap-2 items-center">
            <BaseButton :icon="mdiArrowLeftDropCircle" to="/campaigns" color="info" rounded-full small />
            <p class="font-extrabold">{{ title }} Challenge</p>
          </div>
          <div class="b">
            <BaseButton v-if="sponsors.length == 0" v-show="role === 'cause' || role === 'admin'" class="mr-5"
              label="Add Sponsor" color="info" :icon="mdiPlus" to="/create-sponsor" />
          </div>
        </div>
      </div>

      <div v-if="!isLoading && sponsors.length == 0" class="grid min-w-[50%] gap-6 mb-6">
        <CardBoxWidget :icon="mdiCartOutline" label="It seems that there are no sponsor related to you yet :("
          content='You can create a sponsor by clicking on the "+ Add sponsor" button!' />
      </div>

      <div v-else class="grid grid-cols-3 lg:grid-cols-4 gap-6">
        <CardBox is-form class="col-span-3" @submit.prevent="submit">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <FormField label="Challenge Name" help="Required.">
              <FormControl v-model="form.name" :icon="mdiAccount" name="challengeName" required
                autocomplete="challengeName" />
            </FormField>
            <FormField label="Challenge Description" help="Required.">
              <FormControl v-model="form.description" :icon="mdiMail" name="description" required
                autocomplete="description" label="data" />
            </FormField>
            <FormField label="Badge Image" help="Max 500kb">
              <FormFilePicker label="Upload" v-on:update:model-value="handleBadge" mediaClass="h-24 w-24 mt-3"
                required />
              <div class="w-24 h-24">
                <img v-if="badgeMedia != null" :src="host + badgeMedia" alt="" />
              </div>
            </FormField>
            <FormField label="Challenge Background" help="Max 500kb">
              <FormFilePicker label="Upload" v-on:update:model-value="handleUrl" mediaClass="w-full h-96" required />
              <!-- <div class="w-24 h-24">
                <img v-if="urlMedia != null" :src="host + urlMedia" alt="" />
              </div> -->
            </FormField>
            <FormField label="Type">
              <FormControl v-model="form.type" :options="challengeType" :icon="mdiCity" />
            </FormField>

            <FormField label="Organization">
              <FormControl :disabled="title === 'Edit'" v-model="form.organization" :options="organizations"
                :icon="mdiCity" />
            </FormField>

            <FormField label="Select an Animation">
              <FormControl v-model="form.animation" type="text" :options="animations" :icon="mdiAnimation" />
            </FormField>

            <FormField label="New Animation">
              <FormCheckRadio v-model="form.newAnimation" @click="modalAnimation = true" type="checkbox"
                label="Or upload a new one" />
            </FormField>

            <!-- <FormField
              v-if="form.newAnimation"
              label="Upload new animation"
              help="Max 500kb"
            >
              <FormFilePicker
                label="Upload"
                :modelValue="animationUrl"
                v-on:update:model-value="handleAnimationUrl"
                mediaClass="w-full h-96"
              />
            </FormField>

            <FormField
              v-if="form.newAnimation"
              label="Animation name"
              help="Required."
            >
              <FormControl
                v-model="form.newAnimationName"
                :icon="mdiAnimation"
                name="animationName"
                required
                autocomplete="newAnimationName"
              />
            </FormField>

            <FormField
              v-if="form.newAnimation"
              label="Animation duration (seconds)"
              help="Required."
            > -->
            <!-- <FormControl
                v-model="form.newAnimationDuration"
                :icon="mdiAnimation"
                name="animationDuration"
                required
                autocomplete="5"
              />
            </FormField> -->

            <FormField label="Type">
              <FormCheckRadio v-model="form.haveSponsor" type="checkbox" label="Unsponsored?" />
            </FormField>

            <FormField label="Sponsor" v-show="!form.haveSponsor">
              <FormControl :disabled="title === 'Edit'" v-model="form.sponsor" type="text" :options="sponsors"
                :icon="mdiCity" />
            </FormField>

            <FormField label="Start Date">
              <Datepicker v-model="startDate" />
            </FormField>

            <FormField label="End Date">
              <Datepicker v-model="endDate" />
            </FormField>

            <FormField>
              <FormCheckRadio v-model="form.typeDonation" @click="modalDonation = true" type="checkbox"
                label="Something Different Than Money?" />
            </FormField>

            <FormField v-if="!form.typeDonation" label="Invite Donate">
              <FormControl v-model="form.inviteDonate" type="text" :options="inviteDonate" />
            </FormField>

            <FormField v-if="!form.typeDonation" label="Amount Per Challenge ($)">
              <FormControl v-model="form.amount" :icon="mdiHandCoinOutline" />
            </FormField>

            <FormField v-if="!form.typeDonation" label="Maximun Donation ($)">
              <FormControl v-model="form.maxAmount" :icon="mdiHandCoinOutline" />
            </FormField>

            <!-- <FormField v-if="form.typeDonation" label="Name">
              <FormControl v-model="form.typeDonationName" :icon="mdiAccount" />
            </FormField>

            <FormField
              v-if="form.typeDonation"
              label="Select Image"
              help="Max 500kb"
            >
              <FormFilePicker
                label="Upload"
                :modelValue="typeDonationIcon"
                v-on:update:model-value="handleTypeDonationIcon"
                mediaClass="h-24 w-24 mt-3"
              />
            </FormField> -->

            <FormField>
              <FormCheckRadio v-model="form.addLighBeat" @click="modalLightBeat = true" type="checkbox"
                label="Add LightBeat To This Challenge" />
            </FormField>

            <!-- <FormField v-if="form.addLighBeat" label="Select Lightbeat Design">
              <FormFilePicker
                label="Upload"
                :modelValue="lightbeatDesign"
                v-on:update:model-value="handleLightbeatDesign"
              />
            </FormField> -->

            <!-- <FormField v-if="form.addLighBeat" label="Start Lightbeat Date">
              <Datepicker v-model="lightbeatStartDate" />
            </FormField>

            <FormField v-if="form.addLighBeat" label="End Lightbeat Date">
              <Datepicker v-model="lightbeatEndDate" />
            </FormField> -->

            <FormCheckRadio v-model="form.reactions" type="checkbox"
              label="Do you want members to react to your challenge?" />

            <FormField v-if="form.addIntroduction" label="Select Introduction Video" :v-show="title == 'Create'">
              <FormFilePicker label="Upload" :modelValue="introduction" v-on:update:model-value="handleIntroduction" />
            </FormField>

            <FormField>
              <FormCheckRadio v-model="form.addInstructions" @click="form.addIntroduction = true" type="checkbox"
                label="Do you want to add instructions to this challenge?" />
            </FormField>

            <!-- <FormField
              v-if="form.addInstructions"
              label="Challenge instructions"
            >
              <FormControl v-model="form.instructions" :icon="mdiInformation" />
            </FormField> -->

            <FormField label="Social Media Sharing Text">
              <FormControl v-model="form.shareMessage" :icon="mdiAccountGroup" />
            </FormField>

            <FormField label="Social Media Sharing Text (Short)">
              <FormControl v-model="form.shareMessageShort" :icon="mdiAccountGroup" />
            </FormField>

            <FormField label="Banner Color">
              <div class="flex flex-row">
                <BaseButton @click="
        picker.showcolorpicker = picker.showcolorpicker
          ? false
          : true
        " class="text-black w-full" label="Select Color" />
                <div class="ml-2 h-12 w-24 rounded-md" :style="{ background: picker.color }"></div>
              </div>
              <div style="position: relative">
                <div v-show="picker.showcolorpicker" style="position: absolute">
                  <ColorPicker theme="light" :color="picker.color" :sucker-hide="false"
                    :sucker-canvas="picker.suckerCanvas" :sucker-area="picker.suckerArea" @changeColor="changeColor"
                    @openSucker="picker.openSucker" />
                </div>
              </div>
            </FormField>
          </div>
          <template #footer>
            <BaseButtons class="justify-end">
              <BaseButton color="info" type="submit" label="Save" v-if="form" :isLoading="isLoading" />
            </BaseButtons>
          </template>
        </CardBox>
        <div>
          <div :class="'h-[70%] w-[337px] rounded-[20px] bg-white flex shadow-lg absolute z-[100]'">
            <div class="absolute h-full w-[337px] -z-1">
              <img v-if='!isVideo'
                :src="bgChallengePreview ? bgChallengePreview : '../../assets/img/png/steve_buy_usd.png'"
                :class="bgChallengePreview ? ' h-full object-cover rounded-[20px]' : 'h-full rounded-[20px]'">
              <video v-else :src='bgChallengePreview' class="h-full object-fill rounded-[20px]" autoplay loop></video>
            </div>
            <div style="background-color: rgb(61 61 61 / 27%)" class="w-full h-[115px] rounded-b-lg rounded-t-xl">
              <div class="w-full h-full relative">
                <div
                  :style="picker?.color ? { background: picker.color, borderRadius: '20px 20px 0px 0px' } : { background: '' }"
                  class="w-full h-[32px] absolute -z--1"></div>
                <div class="w-full h-full flex">
                  <div class="w-[36%] h-100% relative z-10">
                    <img :src="badgePreview ? badgePreview : host + form.sponsor?.logo"
                      class="p-[3px] h-full w-full rounded-2xl object-contain" />
                  </div>
                  <div class="w-[75%]">
                    <div class=" relative z-10 justify-center items-center text-center flex h-[32px]">
                      <p v-if="!form.name" class="text-white text-[19px] font-semibold">Name Challenge</p>
                      <p v-else class="text-white text-[19px] font-semibold">{{ form.name }}</p>
                    </div>
                    <div class="flex justify-evenly">
                      <p class='w-[35%] font-semibold text-[17px] '>Sponsor</p>
                      <p class='w-[30%] font-semibold text-[17px]'>Donate</p>
                      <p class='w-[28%] font-semibold text-[17px] text-center'>To</p>
                    </div>
                    <div class="w-full h-[37%]">
                      <div class="flex justify-evenly  items-center w-full h-full g-[6px]">
                        <div class="w-full h-full">
                          <div class="h-full w-full">
                            <img :src="host + form.sponsor?.logo" class=" w-full object-contain h-full rounded-2xl  " />
                          </div>
                        </div>
                        <div class="w-full">
                          <p class="text-[35px] text-center font-semibold" v-if="form.amount">${{ form.amount }}</p>
                          <p class="text-[35px] text-center font-semibold" v-else>$0</p>
                        </div>
                        <div class=" h-full w-full">
                          <div class="h-full w-full">
                            <img :src="host + form.organization?.logo" class=" w-full object-contain h-full " />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="w-full flex justify-center align-center absolute bottom-11">
                <div class="flex flex-col gap-[16px]">
                  <div class="flex justify-center ">
                    <span v-if="!form.description" class="text-white text-[19px] p-[10px] font-medium">Challenge
                      Description</span>
                    <span v-else class="text-white text-[19px] p-[10px] font-medium">{{ form.description }}</span>
                  </div>
                  <div class="flex justify-center items-center">
                    <div class="bg-sky-500 rounded-[10px]">
                      <div class="justify-center items-center flex ">
                        <div>

                          <BaseIcon :path="mdiCamera" w='w-10' h='h-10'
                            class=" z-10 pointer-events-none text-white dark:text-slate-400 sizeIcon" />
                        </div>
                        <span class="pr-[9px] text-white font-bold font-sans uppercase ">ACCEPT THE
                          CHALLENGE!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style scope>
.sizeIcon>svg {
  height: 25px;
  width: 30px
}
</style>
