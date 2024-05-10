<script setup>
import {
  mdiAccount,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiPhone,
  mdiSmartCard,
} from "@mdi/js";
import UserAvatar from "@/components/UserAvatar.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { watchEffect } from "vue";
import UserController from "@/controllers/UserController";
import ProfileController from "@/controllers/ProfileController";
import { ref, watch } from "vue";
import { computed } from "vue";
import { useAlertStore } from "@/stores/alerts.js";
import BaseLevel from "@/components/BaseLevel.vue";

const host = import.meta.env.VITE_IMAGE_HOST;
const alertStore = useAlertStore();
let profileForm = ref({});
const userAvatarFile = ref();
const passwordForm = ref({});
const profile = ref({});
const buttonDisableProfile = ref(false)
const disableNewPassword = ref(false)
const changes = ref(false);
const validateAvatar = computed(() => {
  if (profile.value.imagen) {
    return host + profile.value.imagen;
  } else {
    return host + "default/user_default.png";
  }
});
const handleProfilePicture = (newValue) => {
  userAvatarFile.value = newValue;
};
const checkChanges = (e) => {
  if (e.target.value) {
    if (!profileForm.value.lastName || !profileForm.value.firstName) {
      buttonDisableProfile.value = false
      return
    }
    buttonDisableProfile.value = true
    return
  }
};
watch(() => {
  if (userAvatarFile.value) {
    buttonDisableProfile.value = true
  }
  if (!profileForm.value.lastName || !profileForm.value.firstName) {
    buttonDisableProfile.value = false
    return
  }
  if (!passwordForm?.value?.password_confirmation && !passwordForm?.value?.newPassword) {
    return
  } else if (passwordForm?.value?.password_confirmation === passwordForm?.value?.newPassword) {
    disableNewPassword.value = true
    return
  } else {
    disableNewPassword.value = false
  }
})



watchEffect(async () => {
  const { id, firstName, lastName, email, username, rol, bio, imagen } =
    (profile.value = await UserController.getMyProfile());
  profileForm.value = {
    id,
    firstName,
    lastName,
    email,
    username,
    rol,
    bio,
  };
});

const submitProfile = () => {
  ProfileController.updateDataUser(profileForm.value).then(() => {
    alertStore.createAlert({
      title: "Data updated!",
      icon: "$success",
      text: "The data has been updated successfully!",
    });
  });
  if (userAvatarFile.value) {
    submitAvatarUser();
  }
};



const submitAvatarUser = async () => {
  const id = profile.value.id;
  await ProfileController.userAvatar({
    id,
    file: userAvatarFile.value,
  });
};

const submitPass = () => {
  try {
    ProfileController.updatePassUser(passwordForm.value)
      .then(() => {
        alertStore.createAlert({
          title: "Data updated!",
          icon: "$success",
          text: "The data has been updated successfully!",
        });
        console.log("aquistoypapa", passwordForm.value);
      })
      .catch((error) => {
        alertStore.createAlert({
          title: "Error while updating",
          color: "danger",
          text: error.response.data.message,
        });
        console.error("error", error);
      });
  } catch (error) {}
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Profile" main>
      </SectionTitleLineWithButton>
      <CardBox class="mb-5">
        <BaseLevel type="flex justify-around lg:justify-center">
          <div class="flex items-center">
            <UserAvatar :avatar="validateAvatar">
              <slot />
            </UserAvatar>
          </div>
          <div class="text w-[600px] h-full">
            <div class="space-y-3 text-center">
              <div class="flex justify-center md:block"></div>
              <h1 class="text-2xl">
                Howdy, <b>Edit your profile settings!</b>
              </h1>
            </div>
          </div>
        </BaseLevel>
      </CardBox>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardBox is-form @submit.prevent="submitProfile">
          <FormField label="Profile Picture" help="Max 500kb">
            <FormFilePicker v-model="userAvatarFile" label="Upload" />
          </FormField>
          <div class="grid grid-cols-2 gap-2">
            <FormField label="First Name" help="Required. Your name">
              <FormControl @input="checkChanges" v-model="profileForm.firstName" :icon="mdiAccount" name="FirstName"
                required autocomplete="FirstName" />
            </FormField>
            <FormField label="Last Name" help="Required. Your name">
              <FormControl @input="checkChanges" v-model="profileForm.lastName" :icon="mdiAccount" name="lastName"
                required autocomplete="lastName" />
            </FormField>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <FormField label="Phone" help="This field can't be edited">
              <FormControl v-model="profileForm.phone" :icon="mdiPhone" type="phone" name="phone" autocomplete="Phone"
                disabled />
            </FormField>
            <FormField label="User Type" help="This field can't be edited">
              <FormControl v-model="profileForm.rol" :icon="mdiSmartCard" type="rol" name="rol" autocomplete="rol"
                disabled />
            </FormField>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <FormField label="Email" help="This field can't be edited">
              <FormControl v-model="profileForm.email" :icon="mdiMail" type="email" name="email" required
                autocomplete="email" disabled />
            </FormField>
            <FormField v-if="profileForm.username != ''" label="Username" help="This field can't be edited">
              <FormControl v-model="profileForm.username" :icon="mdiAccount" type="username" name="username"
                autocomplete="username" disabled />
            </FormField>
            <FormField v-else label="Username" help="This field can't be edited">
              <FormControl value="This user does not have a username" :icon="mdiAccount" type="username" name="username"
                autocomplete="username" />
            </FormField>
          </div>

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Save" class="mr-2"
                :disabled="buttonDisableProfile ? false : true" />
              <!--<BaseButton color="info" label="Options" outline />-->
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox is-form @submit.prevent="submitPass">
          <div class="flex flex-col justify-center h-100">
            <FormField label="New password" help="Required. New password">
              <FormControl v-model="passwordForm.newPassword" :icon="mdiFormTextboxPassword" name="newPassword"
                type="password" required autocomplete="new-password" />
            </FormField>

            <FormField label="Confirm password" help="Required. New password one more time">
              <FormControl v-model="passwordForm.password_confirmation" :icon="mdiFormTextboxPassword"
                name="password_confirmation" type="password" required autocomplete="new-password" />
            </FormField>
            <span v-if="passwordForm.newPassword != passwordForm.password_confirmation
              " style="color: red">Passwords don't match!</span>
          </div>

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Save" class="mr-2"
                :disabled="disableNewPassword ? false : true" />
              <!--<BaseButton color=" info" label="Options" outline />-->
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
