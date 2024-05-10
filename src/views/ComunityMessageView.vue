<script setup>
import { reactive, ref, watchEffect, onBeforeMount } from "vue";
import { mdiArrowLeftDropCircle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import "vue-color-kit/dist/vue-color-kit.css";
import "@vuepic/vue-datepicker/dist/main.css";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import CampaignsController from "@/controllers/ChallengeController";
import MessageController from "@/controllers/MessageController";
import UserController from "@/controllers/UserController";
import ChallengeController from "@/controllers/ChallengeController";
import { useAlertStore } from "@/stores/alerts";
import router from "@/router";

const typeMessage = [
  { id: 1, label: "Manual" },
  { id: 2, label: "Date" },
  { id: 3, label: "Achievement" },
];
const profile = ref({});
const role = ref();
const showConfirmationModal = ref(false);
const totalCredits = ref();
const priceCredits = ref(1);
const priceMessage = ref();
const totalMessage = ref();
const total = ref();
const errorCredits = ref(null);
const alertStore = useAlertStore();
const showModalCredit = ref(false);
onBeforeMount(async () => {
  profile.value = await UserController.getMyProfile();
  role.value = profile.value.rol;

  totalCredits.value = await UserController.getCredit(profile.value.id);

  console.log(totalCredits.value.credits);
}),
  watchEffect(() => {
    console.log(profile.value);
    CampaignsController.getChallengeDashboard().then((data) => {
      console.log(data);
      data.forEach((challenge) => {
        challengeList.value.push({
          id: challenge.id,
          label: challenge.name,
          userChallenges: challenge.userChallenges,
        });
      });
      console.log("mensaje de prueba", challengeList.value);
    });
  });

const challengeList = ref([]);
const snackbar = ref(false);
const form = reactive({
  challenge: challengeList[0],
  message: "",
  test: true,
  link: false,
  sms: false,
  community: false,
});

const routeCredits = () => {
  router.push("/credits");
};
const sendCommunityMessage = () => {
  if (!form.sms && !form.community) {
    console.error("Debes seleccionar al menos SMS o Inside Community.");
    alertStore.createAlert({
      title: "Select SMS or Community!",
      icon: "$success",
      text: "You must select at least SMS or Inside Community.!",
      color: "red",
    });
    return;
  }

  if (!form.challenge) {
    console.error("Debes seleccionar un desafío.");
    alertStore.createAlert({
      title: "Select a challenge!",
      icon: "$success",
      text: "You must select a challenge..!",
      color: "red",
    });
    return;
  }

  totalMessage.value = form.challenge.userChallenges.length;
  showConfirmationModal.value = true;
};

const confirmSend = () => {
  showConfirmationModal.value = false;
  console.log("CONFIRMSEND");
  console.log("Profile.value", profile.value.credits);

  if (form.sms && form.challenge) {
    let id = form.challenge.id;
    let smsData = {
      message: form.message,
      test: form.test,
      link: form.link,
    };
    console.log(form.challenge.userChallenges);
    total.value = priceCredits.value * totalMessage.value;

    MessageController.SmsComunnuty(id, smsData)
      .then((data) => {
        snackbar.value = true;
        form.message = "";
        console.log("Aqui", showConfirmationModal.value);
      })
      .catch((err) => {
        let error = err.response.data.message;
        errorCredits.value = error;
        alertStore.createAlert({
          title: "Insufficient credits",
          color: "error",
          icon: "$warning",
          text: error,
        });
      });
    console.log("prueba", form.sms);
  }
  if (form.community && form.challenge) {
    let id = form.challenge.id;
    MessageController.sendComunity(id, form.message)
      .then((data) => {
        snackbar.value = true;
        form.message = "";
      })
      .catch((err) => {
        let error = err.response.data.message;
        errorCredits.value = error;
        alertStore.createAlert({
          title: "Insufficient credits",
          color: "error",
          icon: "$warning",
          text: error,
        });
      });
  }
};

console.log("mensaje3", totalMessage.value);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between pb-5">
        <div class="flex gap-2 items-center">
          <BaseButton
            :icon="mdiArrowLeftDropCircle"
            to="/dashboard"
            color="info"
            rounded-full
            small
          />
          <p class="lg:text-xl text-lg">Community Message</p>
        </div>
      </div>
      <!-- Modal Confirm Send Message -->
      <v-dialog v-model="showConfirmationModal" width="auto">
        <v-card>
          <v-card-title class="text-h5"> Send Message? </v-card-title>
          <v-card-text>
            Are you sure you want to <b>Send</b> this message to
            {{ totalMessage }} members of the community?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              red
              variant="text"
              @click="showConfirmationModal = false"
            >
              Cancel
            </v-btn>
            <v-btn color="green-darken-1" variant="text" @click="confirmSend">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Insufficent Credits -->
      <v-dialog v-model="showModalCredit" width="auto">
        <v-card>
          <v-card-title class="text-4xl font-bold pt-5">
            {{ errorCredits }}
          </v-card-title>
          <div
            class="flex flex-column items-center justify-center flex-wrap gap-3 p-5"
          >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2"
                color="red-darken-1"
                variant="text"
                @click="showModalCredit = false"
              >
                Cancel
              </v-btn>
              <v-btn
                class="mr-2"
                color="green-darken-1"
                variant="text"
                @click="() => router.push('/credits')"
              >
                Get Credits
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <CardBox
        is-form
        class="col-span-3"
        @submit.prevent="sendCommunityMessage"
      >
        <div class="gap-3">
          <FormField label="Challenge">
            <FormControl
              v-model="form.challenge"
              value="Select challenge"
              :options="challengeList"
              required
            />
          </FormField>

          <FormField>
            <div class="flex flex-col gap-5">
              <FormCheckRadio
                v-if="role === 'admin'"
                label="Test message: This notification will be send only to approved test accounts"
                v-model="form.test"
              />
              <FormCheckRadio
                label="Send challenge link: This notification will cointain the link to the user challenge"
                v-model="form.link"
              />

              <FormCheckRadio
                label="SMS: This notification will be sent via SMS, credits will be charged"
                v-model="form.sms"
              />

              <FormCheckRadio
                label="Inside Community: This notification will be shown on the inside community feed"
                v-model="form.community"
              />
            </div>
          </FormField>

          <FormField label="Message">
            <FormControl textarea v-model="form.message" required />
          </FormField>
        </div>
        <template #footer>
          <BaseButtons class="justify-end">
            <BaseButton color="info" type="submit" label="Send" />
          </BaseButtons>
        </template> </CardBox
      ><v-snackbar v-model="snackbar" :timeout="3000" color="green">
        <p class="text-lg italic font-bold">Mensaje Enviado</p>

        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </SectionMain>
  </LayoutAuthenticated>
</template>
