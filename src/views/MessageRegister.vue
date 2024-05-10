<script setup>

import { useRouter, useRoute } from "vue-router";


import {
  mdiAccount,
  mdiAt,
  mdiCellphone,
  mdiCheckDecagram,
  mdiCity,
  mdiCityVariant,
  mdiPlus,
  mdiStarCircle,
} from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import UtilityMethods from "@/utility/utilityMethods";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { useAlertStore } from "@/stores/alerts";



const alertStore = useAlertStore();
const router = useRouter();


</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="blueWhite">
      <CardBox :class="`${cardClass} my-8`" is-form>
        <div class="flex flex-col items-center">
          <img
            class="w-2/3"
            src="/assets/shareity-logo.png"
            alt="Shareity Logo"
          />

          <CardBoxWidget
            
            :icon="mdiCartOutline"
            label="Verify your Account"
            content="Your account has been registered, please check your email to validate your account"
            class="text-center"
          />

        </div>
        <template #footer>
          <BaseButtons type="flex-col justify-center items-center">
            <BaseButton
              
              to="/"
              color="info"
              class="sm:w-1/2 w-full"
              label="Login"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<style>
.form_style .iti {
  width: 100%;
}
</style>
