<script setup>
import {
  mdiArrowLeftDropCircle,
  mdiAccountBox,
  mdiPencil,
  mdiPlus,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import TwilioController from "@/controllers/TwilioController";
import { computed, ref, watchEffect, reactive, onMounted } from "vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import ChallengeController from "@/controllers/ChallengeController";
import UserController from "@/controllers/UserController";
import "intl-tel-input/build/css/intlTelInput.css";
import "intl-tel-input/build/js/intlTelInput.js";
import intlTelInput from "intl-tel-input";
import { useAlertStore } from "@/stores/alerts";

const phoneNumbers = ref([]);
const modaOfMyChallenge = ref(false);
const searchName = ref("");

const idNumber = ref({});
const checkable = false;
const perPage = ref(10);
const phoneNumberId = ref(null);
const totalPages = ref(0);
const currentPage = ref(1);
const profile = ref({});
const challenges = ref([]);
const checkedRows = ref([]);
const myChallengeList = ref([]);
const modalError = ref(false);
const errorChallengeNumber = ref(null);
const sorting = ref({ field: "firstName", order: 1 });
const challengeName = reactive({
  challenge: myChallengeList[0],
});
const phone = ref("");
const teleInput = ref();
const alertStore = useAlertStore();
watchEffect(async () => {
  profile.value = await UserController.getMyProfile();

  await TwilioController.getAllNumberLink().then((data) => {
    phoneNumbers.value = data;
    totalPages.value = Math.ceil(data.length / perPage.value);
  });

  if (profile.value.rol === "admin") {
    const input = document.getElementById("telephone");
    teleInput.value = intlTelInput(input, {
      preferredCountries: ["us", "in", "ca"],
    });
    input.addEventListener("countrychange", function () {
      console.log("teleInput.value", teleInput.value);
    });
  }
});

const openModalMyChallenge = (myNumber) => {
  phoneNumberId.value = myNumber.id;
  idNumber.value = myNumber;
  ChallengeController.getMyChallengesNumber().then((data) => {
    challenges.value = data;
    console.log("dataaa", data);
    let list = data.map((item) => {
      return { id: item.id, label: item.name };
    });
    myChallengeList.value = list;
    challengeName.challenge = list[0];
  });

  modaOfMyChallenge.value = true;
};
const addNumbeToMyChllange = async () => {
  let idChallenge = challengeName?.challenge?.id;

  try {
    const respo = await TwilioController.putNumberLink(phoneNumberId.value, {
      challenge: idChallenge,
    });

    if (respo) {
      const index = phoneNumbers.value.indexOf(idNumber.value);
      phoneNumbers.value[index].challenge = respo.challenge;
      alertStore.createAlert({
        title: "Number added to challenge",
        color: "success",
        text: "The number has been successfully added to your challenge",
      });
      modaOfMyChallenge.value = false;
    }
  } catch (error) {
    if (error) {
      alertStore.createAlert({
        color: "error",
        text: "This challenge already has a number assigned",
      });
    }
  }
};
const onLimitInputNumber = (e) => {
  phone.value = phone.value.replace(/[^0-9]/g, "");
};
const addNewNumber = async () => {
  let numberPhone = {
    number: `+${teleInput.value.selectedCountryData.dialCode}${phone.value}`,
  };
  await TwilioController.newNumber(numberPhone)
    .then((data) => {
      phoneNumbers.value.push(data);
      phone.value = "";
      alertStore.createAlert({
        title: "Number add",
        color: "success",
        text: "Number added with I exist to the list.",
      });
      console.log(data);
    })
    .catch((error) => {
      alertStore.createAlert({
        title: "Number already exists",
        color: "error",
        text: "The added number already exists in the list.",
      });
    });
};

const itemsPaginated = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;

  return phoneNumbers.value
    .sort((a, b) => {
      if (sorting.value.field === "campaign") {
        console.log(a);
        return (
          (a?.challenge === null ? b?.challenge && 1 : -1) * sorting.value.order
        );
      }
    })
    .slice(start, start + perPage.value);
});

function sort(field) {
  if (sorting.value.field === field) {
    console.log("campo", field);
    sorting.value.order *= -1;
  } else {
    sorting.value.field = field;
    sorting.value.order = 1;
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <!-- Modal My Challenge Cause/Sponsor -->
    <v-dialog v-model="modaOfMyChallenge" width="auto">
      <v-card>
        <v-card-title class="text-4xl font-bold pt-5">
          Add a phone number to your campaign
        </v-card-title>
        <div
          class="flex flex-column items-center justify-center flex-wrap gap-3 p-5"
        >
          <div class="flex items-center justify-beetwen gap-2">
            <ul>
              <!-- <li v-for="(name, index) in nameMembersSelected" :key="index">
                  {{ name }}
                </li> -->
            </ul>
            <FormField label="Select your Challenge">
              <FormControl
                v-model="challengeName.challenge"
                :options="myChallengeList"
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
              @click="modaOfMyChallenge = false"
            >
              Close
            </v-btn>
            <v-btn
              class="mr-2"
              color="green-darken-1"
              variant="text"
              @click="addNumbeToMyChllange"
            >
              Accept
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <!-- Error Modal Number -->
    <v-dialog v-model="modalError" width="auto">
      <v-card>
        <v-card-title class="text-4xl font-bold pt-5">
          {{ errorChallengeNumber }}
        </v-card-title>
        <div
          class="flex flex-column items-center justify-center flex-wrap gap-3 p-5"
        >
          <div class="flex items-center justify-beetwen gap-2"></div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-2"
              color="red-darken-1"
              variant="text"
              @click="modalError = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
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
          <p class="font-extrabold">Campaign Phone Number</p>
          <FormField>
            <FormControl
              v-model="searchName"
              :icon="mdiAccountBox"
              value="Search"
            />
          </FormField>
        </div>
        <div
          class="flex gap-[10px] items-center"
          v-if="profile.rol === 'admin'"
        >
          <FormField label="Add New Number">
            <input
              id="telephone"
              type="tel"
              class="border input-custom rounded-md h-[48px] w-full"
              v-model="phone"
              @input="onLimitInputNumber($event.target.value)"
            />
          </FormField>

          <BaseButton
            color="info"
            :label="'Add Number'"
            small
            :icon="mdiPlus"
            @click="addNewNumber"
          />
        </div>
      </div>

      <CardBox class="mb-6 m" has-table>
        <div>
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

          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
              class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="w-60 px-6 py-3">Phone Number</th>
                  <th scope="col" class="w-80 px-6 py-3">
                    <div class="flex items-center">
                      Campaign
                      <a @click="sort('campaign')"
                        ><svg
                          class="w-3 h-3 ml-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                          />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" class="w-20 px-6 py-3">
                    <span class="text-center">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="client in itemsPaginated"
                  :key="client.id"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCheckboxCell
                    v-if="checkable"
                    @checked="checked($event, client)"
                  />
                  <td class="px-6 py-4">{{ client.number }}</td>
                  <td class="px-6 py-4" v-if="client?.challenge">
                    <router-link
                      :to="`/campaigns/info?id=${client?.challenge}`"
                      >{{ client?.challenge.name }}</router-link
                    >
                  </td>
                  <td class="px-6 py-4" v-else>No challenge to show</td>

                  <td class="px-6 py-4">
                    <h2 v-if="client?.challenge" class="text-gray-400">
                      Challenge Assigned
                    </h2>
                    <BaseButton
                      v-else
                      class="mt-3 text-lg font-bold"
                      :icon="mdiPlus"
                      small
                      :label="'Add'"
                      color="success"
                      @click="openModalMyChallenge(client)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"
          >
            <h2
              v-if="phoneNumbers.length <= 0"
              class="text-center text-gray-300"
            >
              There are no numbers available
            </h2>
            <BaseLevel v-else>
              <v-pagination
                :length="totalPages"
                color="black"
                :total-visible="perPage"
                v-model="currentPage"
              ></v-pagination>
            </BaseLevel>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style>
.button {
  display: flex;
  align-items: center !important;
}
</style>
