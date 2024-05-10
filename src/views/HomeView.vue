<script setup>
import { onMounted } from "vue";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import UserController from "@/controllers/UserController";
import AgencyController from "@/controllers/AgencyController";
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
const user = ref({});
const errorAdminApprove = ref(null);
let fullCause = ref(Boolean);
let fullAgency = ref(Boolean);
const agencydata = ref({});
const router = useRouter();
const openModal = ref(false);

onMounted(async () => {
  user.value = await UserController.getMyProfile();

  await UserController.adminApprove()
    .then(() => {})
    .catch((err) => {
      errorAdminApprove.value = err.response.data.message;
      console.log(errorAdminApprove.value);
    });
  const role = user.value.rol;
  if (role == "cause" && user.value.organization.logo == "") {
    fullCause = false;
  } else {
    fullCause = true;
  }
  console.log(user.value);
  if (role == "agency") {
    agencydata.value = await AgencyController.getByUser(store.getUserId());
    if (agencydata.name == "" || agencydata.name == null) {
      fullAgency = false;
    } else {
      fullAgency = true;
    }
  }
});

function goEditCause(id) {
  router.push({
    name: "create-cause",
    query: {
      id: id,
    },
  });
}

function goEditAgency(id) {
  router.push({
    name: "create-agency",
    query: {
      id: id,
    },
  });
}

// :nickName="nickName"
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Hi," :userName="user.firstName" main>
        <!-- <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->
      </SectionTitleLineWithButton>
      <div class="grid min-w-[50%] gap-6 mb-6">
        <CardBoxWidget
          :icon="mdiCartOutline"
          label="Annoucements from Shareity"
          content="Welcome to the Shareity Dashboard ™! Let's create some awesome campaigns! Please start a live chat session below if you have any questions!"
        />
        <CardBoxWidget
          v-if="errorAdminApprove"
          :icon="mdiCartOutline"
          content="You have not been approved by our administrators yet! We are verifying your information, this process may take from 24 to 72 hours.!"
        />

        <CardBoxWidget
          v-if="!fullCause"
          :icon="mdiCartOutline"
          label="Reminder"
          :content="'Your organization data is incomplete, please click on the button bellow in order to complete your organization data and enable challenge creation.'"
        />
        <BaseButton
          v-if="!fullCause"
          label="Edit Cause"
          color="info"
          :icon="mdiPlus"
          @click="goEditAgency(agencydata.id)"
        />
        <CardBoxWidget
          v-if="!fullAgency"
          :icon="mdiCartOutline"
          label="Reminder"
          :content="'Your agency data is incomplete, please click on the button bellow in order to complete your agency data and enable all dashboard features.'"
        />
        <BaseButton
          v-if="!fullAgency"
          label="Edit Agency"
          color="info"
          :icon="mdiPlus"
          @click="goEditCause(user.organization.id)"
        />
        <!-- <CardBoxWidget
          trend="12%"
          trend-type="down"
          color="text-blue-500"
          :icon="mdiCartOutline"
          :number="7770"
          prefix="$"
          label="Sales"
        /> -->
        <!--CardBoxWidget
          trend="Overflow"
          trend-type="alert"
          color="text-red-500"
          :icon="mdiChartTimelineVariant"
          :number="256"
          suffix="%"
          label="Performance"
        /> -->
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="flex flex-col justify-between">
          <!-- <CardBoxTransaction
            v-for="(transaction, index) in transactionBarItems"
            :key="index"
            :amount="transaction.amount"
            :date="transaction.date"
            :business="transaction.business"
            :type="transaction.type"
            :name="transaction.name"
            :account="transaction.account"
          /> -->
        </div>
        <div class="flex flex-col justify-between">
          <!-- <CardBoxClient
            v-for="client in clientBarItems"
            :key="client.id"
            :name="client.name"
            :login="client.login"
            :date="client.created"
            :progress="client.progress"
          /> -->
        </div>
      </div>

      <!-- <SectionBannerStarOnGitHub class="mt-6 mb-6" /> -->

      <!-- <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
        <BaseButton
          :icon="mdiReload"
          color="whiteDark"
          @click="fillChartData"
        />
      </SectionTitleLineWithButton> -->
      <!-- 
      <CardBox class="mb-6">
        <div v-if="chartData">
          <line-chart :data="chartData" class="h-96" />
        </div>
      </CardBox> -->

      <!-- <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" /> -->
      <!-- 
      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar> -->
      <!-- 
      <CardBox has-table>
        <TableSampleClients />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
