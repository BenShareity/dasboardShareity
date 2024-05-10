<script setup>
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ref, watch } from "vue";

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
import FormFilePicker from "@/components/FormFilePicker.vue";
import UtilityMethods from "@/utility/utilityMethods";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import RegisterController from "../controllers/RegisterConstroller";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import { useAlertStore } from "@/stores/alerts";
import { regexEmail } from "@/utility/regex";
import "intl-tel-input/build/css/intlTelInput.css";
import "intl-tel-input/build/js/intlTelInput.js";
import intlTelInput from "intl-tel-input";
import { rewriteDefault } from "vue/compiler-sfc";

const selectOptions = [
  { id: 1, label: "cause - Non-profits" },
  { id: 2, label: "sponsor - Brands, Corporations, etc" },
  { id: 3, label: "influencer - Content Creators" },
  { id: 4, label: "agency - Marketing companies, concerts and events..." },
];

const alertStore = useAlertStore();
const countries = RegisterController.getCountries();
const logo = ref("");
const host = import.meta.env.VITE_IMAGE_HOST;
const isSubmitDisabled = ref(false);
const isSubmitDisabled2 = ref(false);
const codePhone = ref(false);

const valores = window.location.search;

const errorSponsorName = ref(null);
const errorfirstName = ref(null);
const errorlastName = ref(null);
const errorEmail = ref(null);
const errorOrganization = ref(null);
const errorPass = ref(null);
const errorpassVerify = ref(null);
const errorPhone = ref(null);
const errorLogo = ref(null);
const errorCode = ref(null);
const errorTerms = ref(null);

const disableResendCode = ref(false);
const router = useRouter();
const route = useRoute();
const messageError = ref();
const idphone = ref();
const isBlur = ref(false);
const refEmail = ref();
const isLoading = ref(false);
const isLoadingCodePhone = ref(false);
const showSendCode = ref(true);
const inValid = ref(false);
const codeAlert = ref();
const verifyTerms = ref(false);
const showResendCode = ref(false);
const emailUrl = ref("");
const typeCauseUrl = ref(false);
const typeSponsorUrl = ref(false);

const correctSponsorName = ref(false);
const correctFirstName = ref(false);
const correctLastName = ref(false);
const correctCompanyName = ref(false);
const correctEmail = ref(false);
const correctpass = ref(false);
const correctPassVerify = ref(false);
const correctPhone = ref(false);
const correctCode = ref(false);

const form = reactive({
  rol: selectOptions[0],
  roltype: selectOptions[0],
  firstName: "",
  lastName: "",
  organizationName: "",
  phoneCode: countries[0],
  phone: "",
  phoneRegister: "",
  email: "",
  code: "",
  logo: "",
  promotional: "",
  setPass: false,
  pass: "",
  passVerify: "",
  organization: {
    name: "",
    description: "",
    color: "#cccccc",
    personName: "",
    personLastname: "",
    personEmail: "",
  },
  sponsor: {
    name: "",
    logo: "",
    personName: "",
    personLastname: "",
    personEmail: "",
    status: 1,
  },
});
const telInput = ref();
onMounted(() => {
  const input = document.getElementById("telephone");
  telInput.value = intlTelInput(input, {
    preferredCountries: ["us", "in", "ca"],
    // Otros opciones de inicialización si es necesario
  });
  input.addEventListener("countrychange", function (e) {
    console.log(telInput);
  });
  if (route.query?.email && route.query?.type) {
    emailUrl.value = route.query.email;
    console.log("email", emailUrl.value);
    typeSponsorUrl.value = route.query.type;

    if (route.query?.type == "cause") {
      console.log("rol", form.rol);
      form.rol.id = 1;
      form.roltype = selectOptions[0];
    } else if (route.query?.type == "sponsor") {
      console.log("rol", form.rol);
      form.rol.id = 2;
      form.roltype = selectOptions[1];
    }
  }
  console.log("msj", route.query);
});

watch(
  () => form.sponsor.name,
  () => {
    if (!form.sponsor.name) {
      errorSponsorName.value = "Required field";
      correctSponsorName.value = false;
    } else {
      errorSponsorName.value = null;
      correctSponsorName.value = true;
    }
  }
);
watch(
  () => form.firstName,
  () => {
    if (!form.firstName) {
      errorfirstName.value = "Required field";
      correctFirstName.value = false;
    } else {
      errorfirstName.value = null;
      correctFirstName.value = true;
    }
  }
);

watch(
  () => form.lastName,
  () => {
    if (!form.lastName) {
      errorlastName.value = "Required field";
      correctLastName.value = false;
    } else {
      errorlastName.value = null;
      correctLastName.value = true;
    }
  }
);

watch(
  () => form.email,
  async () => {
    if (!form.email) {
      errorEmail.value = "Required field";
    } else if (!regexEmail.test(form.email.trim())) {
      errorEmail.value = "Invalid email";
    } else {
      try {
        let res = await RegisterController.verifyEmail(form);
        errorEmail.value = null;
        correctEmail.value = true;

        console.log("res :>> ", res);
      } catch (error) {
        console.log(error);
        errorEmail.value = error.message;
        correctEmail.value = false;
      }
    }
  }
);

watch(
  () => form.organizationName,
  () => {
    if (!form.organizationName) {
      errorOrganization.value = "Required field";
      correctCompanyName.value = false;
    } else {
      errorOrganization.value = null;
      correctCompanyName.value = true;
    }
  }
);

watch(
  () => form.pass,
  () => {
    if (!form.pass) {
      errorPass.value = "Required field";
      correctpass.value = false;
    } else {
      errorPass.value = null;

      correctpass.value = true;
    }
  }
);

watch(
  () => form.code,
  () => {
    if (!form.code) {
      errorCode.value = "Required field";
      correctCode.value = false;
    } else if (isNaN(form.code)) {
      errorCode.value = "Only numbers";
      correctCode.value = false;
    } else {
      errorCode.value = null;
      correctCode.value = true;
    }
  }
);

watch(
  () => form.passVerify,
  () => {
    console.log(form.pass, form.passVerify);
    if (!form.passVerify) {
      errorpassVerify.value = "Required field";
      correctPassVerify.value = false;
    } else if (form.pass !== form.passVerify) {
      errorpassVerify.value = "Passwords do not match";
      correctPassVerify.value = false;
    } else {
      errorpassVerify.value = null;
      correctPassVerify.value = true;
    }
  }
);
watch(
  () => form.phone,
  async () => {
    if (!form.phone) {
      errorPhone.value = "Required field";
      correctPhone.value = false;
    } else if (isNaN(form.phone)) {
      errorPhone.value = "Only numbers";
      correctPhone.value = false;
    } else if (form.phone.length > 9) {
      const formattedNumber = telInput.value.selectedCountryData.dialCode;
      let phone = `${formattedNumber}${form.phone}`;
      try {
        let res = await RegisterController.verifyPhone(phone);
        errorPhone.value = null;

        correctPhone.value = true;
      } catch (error) {
        console.error(error);
        errorPhone.value = error.message;
      }
    }
  }
);

watch(
  () => form.logo,
  () => {
    if (!form.logo) {
      errorLogo.value = "Required field";
    } else {
      errorLogo.value = null;
    }
  }
);

watch(
  () => verifyTerms,
  () => {
    if (!verifyTerms) {
      errorTerms.value = "Required field";
    } else {
      errorTerms.value = null;
    }
  }
);

const onFileChange = (e) => {
  form.imageFile = e.target.files[0];
};

const handleLogo = (newValue) => {
  if (newValue) {
    form.logo = newValue;
    errorLogo.value = null;
  }
};

const sendCode = async () => {
  const formattedNumber = telInput.value.selectedCountryData.dialCode;
  form.phoneRegister = `${formattedNumber}${form.phone}`;
  try {
    let res = await RegisterController.sendCode(form.phoneRegister).then(
      (resp) => {
        codeAlert.value = resp.code;
      }
    );
    console.log("res :>> ", res);
    console.log(formattedNumber);
    console.log(form.phone);

    isLoadingCodePhone.value = true;
    showSendCode.value = false;
    setTimeout(() => {
      isLoadingCodePhone.value = false;
      showSendCode.value = true;
      showResendCode.value = true;
    }, 15000);
  } catch (error) {
    console.error("Error:", error);
    errorPhone.value = "Invalid number";
  }
};

const onInput = (e) => {
  const formattedNumber = telInput.value.selectedCountryData.dialCode;
  console.log(formattedNumber);
  let idCode = `+${formattedNumber}`;
};
watch(() => {
  if (form.rol.id === 2 || route.query?.type == "sponsor") {
    isSubmitDisabled.value =
      !form.sponsor.name ||
      !form.firstName ||
      !form.lastName ||
      !form.organizationName ||
      !form.pass ||
      !form.passVerify ||
      form.pass !== form.passVerify ||
      !form.phone ||
      isNaN(form.phone) ||
      !form.code ||
      !form.logo ||
      verifyTerms.value == false;
  }
});
watch(() => {
  isSubmitDisabled2.value =
    !form.firstName ||
    !form.lastName ||
    !form.organizationName ||
    !form.pass ||
    !form.passVerify ||
    form.pass !== form.passVerify ||
    !form.phone ||
    isNaN(form.phone) ||
    !form.code ||
    !form.logo ||
    verifyTerms.value == false;
});

watch(() => {
  disableResendCode.value = form.code > 0;
});

watch(() => {
  codePhone.value =
    !form.phone ||
    errorPhone.value == "Number already exist" ||
    form.phone.length < 9;
});

const submit = async () => {
  isLoading.value = true;
  if (!form.firstName) {
    errorfirstName.value = "Required field";
  }
  if (!form.lastName) {
    errorlastName.value = "Required field";
  }
  if (!emailUrl.value) {
    if (!form.email) {
      errorEmail.value = "Required field";
    } else if (!regexEmail.test(form.email.trim())) {
      errorEmail.value = "Invalid email";
    }
  }

  if (!form.organizationName) {
    errorOrganization.value = "Required field";
  }

  if (!form.pass) {
    errorPass.value = "Required field";
  }

  if (!form.passVerify) {
    errorpassVerify.value = "Required field";
  } else if (form.pass !== form.passVerify) {
    errorpassVerify.value = "Passwords do not match";
  }

  if (!form.phone) {
    errorPhone.value = "Required field";
  } else if (isNaN(form.phone)) {
    errorPhone.value = "Only numbers";
  } else {
    errorPhone.value = null;
  }
  console.log(form.logo);
  if (!emailUrl.value && !route.query?.type) {
    if (!form.logo) {
      errorLogo.value = "Required field";
      return;
    }
  }

  if (form.rol.id == 1) {
    form.organization.name = form.organizationName;
    form.organization.personName = form.firstName;
    form.organization.personLastname = form.lastName;
    form.organization.personEmail = form.email;
    form.sponsor = null;
  }
  if (form.rol.id == 2) {
    form.sponsor.name = form.organizationName;
    form.sponsor.personName = form.firstName;
    form.sponsor.personLastname = form.lastName;
    form.sponsor.personEmail = form.email;
    form.organization = null;
  }

  let logoMedia = await UtilityMethods.verifyMedia(
    form.logo,
    form.rol.id == 1 ? "organization" : "sponsor"
  );
  console.log(logoMedia);
  form.logo = logoMedia;
  // Verificar si hay errores de validación
  console.log("desck", route.query?.type);
  if (route.query?.type == "cause") {
    console.log("consola", emailUrl.value);
    form.email = emailUrl.value;
    console.log("form-organization", form);
    RegisterController.registerOrganization(form)
      .then(async (res) => {
        console.log("register :>> ", res);
        if (res) {
          try {
            alertStore.createAlert({
              title: "User successfully registered! ",
              icon: "$success",
              text: "the user has been created successfully!",
            });
          } catch (error) {
            console.log("error :>> ", error);
            alertStore.createAlert({
              title: "an error has occurred try later! ",
              icon: "$error",
              text: "the user has been created successfully!",
            });
          }
        }
        router.push("/MessageNewRegister");
      })
      .catch((error) => {
        console.log("exploto", inValid.value);
        if (error.error) {
          inValid.value = true;
          console.log("akgo");
          messageError.value = "An error occurred while registering the user";
        }
        alertStore.createAlert({
          title: `An error occurred while registering the user ${error.error}`,
          icon: "$danger",
          text: error.message,
          color: "red-accent-4",
        });
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else if (route.query?.type == "sponsor") {
    form.email = emailUrl.value;
    console.log("form-sponsor", form);
    RegisterController.registerSponsor(form)
      .then(async (res) => {
        console.log("register :>> ", res);
        if (res) {
          try {
            alertStore.createAlert({
              title: "User successfully registered! ",
              icon: "$success",
              text: "the user has been created successfully!",
            });
          } catch (error) {
            console.log("error :>> ", error);
            alertStore.createAlert({
              title: "an error has occurred try later! ",
              icon: "$error",
              text: "the user has been created successfully!",
            });
          }
        }
        router.push("/MessageNewRegister");
      })
      .catch((error) => {
        console.log("exploto", inValid.value);
        if (error.error) {
          inValid.value = true;
          console.log("akgo");
          messageError.value = "An error occurred while registering the user";
        }
        alertStore.createAlert({
          title: `An error occurred while registering the user ${error.error}`,
          icon: "$danger",
          text: error.message,
          color: "red-accent-4",
        });
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    console.log("form-registernormal", form);
    RegisterController.register(form)
      .then(async (res) => {
        console.log("register :>> ", res);

        if (res) {
          try {
            alertStore.createAlert({
              title: "User successfully registered! ",
              icon: "$success",
              text: "the user has been created successfully!",
            });
          } catch (error) {
            console.log("error :>> ", error);
            alertStore.createAlert({
              title: "an error has occurred try later! ",
              icon: "$error",
              text: "the user has been created successfully!",
            });
          }
        }
        router.push("/message-register");
      })
      .catch((error) => {
        console.log("exploto", inValid.value);
        if (error.error) {
          inValid.value = true;
          console.log("akgo");
          messageError.value = "An error occurred while registering the user";
        }
        alertStore.createAlert({
          title: `An error occurred while registering the user ${error.error}`,
          icon: "$danger",
          text: error.message,
          color: "red-accent-4",
        });
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};
function showCode() {
  if (codeAlert.value) {
    one += 1;
    if (one === 3) {
      one = 0;
      alert("Code:" + "  " + codeAlert.value);
    }
  }
}
// const olblur = async (e) => {
//   console.log("a :>> ", refEmail.value.focus());
//   if (!form.email) {
//     errorEmail.value = "Required field";
//   } else if (!regexEmail.test(form.email.trim())) {
//     errorEmail.value = "Invalid email";
//   } else {
//     errorEmail.value = null;

//     console.log("res :>> ", res);
//   }
// };

/** prueba de ejercicio
 *
 * *
 *
 */
// se muestra en consola el valor "25"
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="blueWhite">
      <CardBox
        v-if="!form.setPass"
        :class="`${cardClass} my-8`"
        is-form
        @submit.prevent="submit"
      >
        <div class="flex justify-center">
          <img
            class="w-2/3"
            src="/assets/shareity-logo.png"
            alt="Shareity Logo"
          />
        </div>

        <FormField v-if="typeSponsorUrl" label="Who are youuu?">
          <FormControl
            v-model="form.roltype"
            :options="selectOptions"
            :icon="mdiCity"
            disabled
          />
        </FormField>

        <FormField v-else label="Who are you?">
          <FormControl
            v-model="form.rol"
            :options="selectOptions"
            :icon="mdiCity"
          />
        </FormField>
        <FormField
          v-if="form.rol.id === 2 || route.query?.type == 'sponsor'"
          label="Sponsor Name"
        >
          <FormControl
            v-model="form.sponsor.name"
            :icon="mdiAccount"
            name="name"
            autocomplete="username"
            :error="'hola'"
            :class="correctSponsorName ? 'clase2 green' : ''"
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorSponsorName"
          >
            {{ errorSponsorName }}
          </p>
        </FormField>

        <FormField label="First Name">
          <FormControl
            v-model="form.firstName"
            :icon="mdiAccount"
            name="firstName"
            autocomplete="username"
            :class="correctFirstName ? 'clase2 green' : ''"
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorfirstName"
          >
            {{ errorfirstName }}
          </p>
        </FormField>

        <FormField label="Last Name">
          <FormControl
            v-model="form.lastName"
            :icon="mdiAccount"
            name="firstName"
            autocomplete="username"
            :class="correctLastName ? 'clase2 green' : ''"
          />
          <p class="text-red text-sm font-medium uppercase pt-2">
            {{ errorlastName }}
          </p>
        </FormField>

        <FormField v-if="form.rol.id != 3" label="Company Name">
          <FormControl
            v-model="form.organizationName"
            :icon="mdiCityVariant"
            name="companyName"
            autocomplete="current-password"
            :class="correctCompanyName ? 'clase2 green' : ''"
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorOrganization"
          >
            {{ errorOrganization }}
          </p>
        </FormField>

        <FormField v-if="emailUrl" label="Email" class="form_style">
          <FormControl
            v-model="emailUrl"
            :icon="mdiAt"
            name="email"
            autocomplete="current-password"
            class="border rounded-md h-[48px] w-full"
            ref="refEmail"
            disabled
          />
        </FormField>

        <FormField v-else label="Email" class="form_style">
          <FormControl
            v-model="form.email"
            :icon="mdiAt"
            name="email"
            autocomplete="current-password"
            class="border rounded-md h-[48px] w-full"
            :class="[correctEmail ? 'clase2 green' : '']"
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorEmail"
          >
            {{ errorEmail }}
          </p>
        </FormField>

        <FormField label="Password">
          <FormControl
            v-model="form.pass"
            :icon="mdiStarCircle"
            name="promoCode"
            type="password"
            :class="correctpass ? 'clase green' : ''"
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorPass"
          >
            {{ errorPass }}
          </p>
        </FormField>
        <FormField label="Verify Password">
          <FormControl
            v-model="form.passVerify"
            :icon="mdiStarCircle"
            name="promoCode"
            type="password"
            class="focus:border-indigo-300"
            :class="correctPassVerify ? 'clase green' : ''"
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorpassVerify"
          >
            {{ errorpassVerify }}
          </p>
        </FormField>

        <FormField
          label="Phone"
          class="form_style"
          :class="correctPhone ? 'clase3 green' : ''"
        >
          <input
            @input="onInput($event.target.value)"
            type="tel"
            v-model="form.phone"
            class="border input-custom rounded-md h-[48px] w-full"
            id="telephone"
          />

          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorPhone"
          >
            {{ errorPhone }}
          </p>
        </FormField>

        <FormField
          label="Registration Code"
          help="This code will be sent to your phone"
          @click="showCode()"
          :class="!showSendCode ? '!mb-2' : ''"
        >
          <div class="flex sm:flex-row flex-col gap-3">
            <template v-if="isLoadingCodePhone">
              <BaseButton
                class="sm:w-1/3 h-[48px] pointer-events-none mb-1.5"
                color="info"
                :isLoading="true"
              />
            </template>
            <template v-else>
              <div v-if="!showResendCode" class="sm:w-1/3">
                <BaseButton
                  v-if="showSendCode"
                  color="info"
                  label="Send Code"
                  @click="sendCode"
                  :disabled="codePhone"
                  :isLoading="isLoadingCodePhone"
                />
              </div>

              <div v-else-if="showResendCode" class="sm:w-1/3">
                <BaseButton
                  v-if="showSendCode"
                  color="info"
                  label="Resend Code"
                  @click="sendCode"
                  :disabled="codePhone || disableResendCode"
                  :isLoading="isLoadingCodePhone"
                />
              </div>
            </template>

            <FormControl
              v-model="form.code"
              :icon="mdiCheckDecagram"
              name="regisCode"
              autocomplete="current-password"
              id=""
              class="sm:w-2/3 z-0"
              :class="[correctCode ? 'clase2 green ' : '']"
            />
          </div>

          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorCode"
          >
            {{ errorCode }}
          </p>
        </FormField>

        <p class="text-blue flex-col text-xs uppercase" v-if="!showSendCode">
          A code have been sent to your phone number. Please enter it
        </p>

        <FormField label="Company  Logo (Required)">
          <FormFilePicker
            :modelValue="form.logo"
            v-on:update:model-value="handleLogo"
            label="Upload"
            mediaClass="w-52 h-52"
            required
          />
          <p
            class="text-red text-sm font-medium uppercase pt-2"
            v-if="errorLogo"
          >
            {{ errorLogo }}
          </p>
          <div class="flex items-center mt-2">
            <FormField>
              <FormCheckRadio
                label="- I have read and agree with the"
                v-model="verifyTerms"
              />
            </FormField>
            <p class="ml-1 inline mb-7 underline text-[#57BDF8]">
              <a target="_blank" href="https://shareity.com/terms-of-use/"
                >terms of use</a
              >
            </p>
            <p
              class="text-red text-sm font-medium uppercase pt-2"
              v-if="errorTerms"
            >
              {{ errorLogo }}
            </p>
          </div>
        </FormField>

        <template #footer>
          <BaseButtons type="flex-col justify-center items-center">
            <BaseButton
              v-if="form.rol.id === 2"
              type="submit"
              color="info"
              class="sm:w-1/2 w-full"
              label="Create Account"
              :disabled="isSubmitDisabled || !form.logo"
              :isLoading="isLoading"
            />
            <BaseButton
              v-else
              type="submit"
              color="info"
              class="sm:w-1/2 w-full"
              label="Create Account"
              :disabled="isSubmitDisabled2 || !form.logo"
              :isLoading="isLoading"
            />
            <BaseButton
              to="/"
              color="info"
              outline
              class="sm:w-1/2 w-full"
              label="I Already Have An Account"
            />
          </BaseButtons>

          <span
            v-if="inValid"
            class="text-red text-sm font-medium uppercase pt-2 text-center mt-5 ml-8"
          >
            {{ messageError }}</span
          >
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<style>
.form_style .iti {
  width: 100%;
}

input[type="tel"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
}

.green input {
  border-color: rgb(36 233 16 / 100%) !important;
}

/* input[type="password"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  --tw-ring-color: rgb(146, 94, 144);
} */

/* .pepito > input[type="text"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  --tw-ring-color: rgba(233, 175, 17, 0.274);
} */

.colorNew > span {
  color: #1fd63d !important;
}

.clase input[type="password"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  --tw-ring-color: rgb(0, 255, 13);
}
.clase2 input[type="text"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  --tw-ring-color: rgb(0, 255, 13);
}
.clase3 input[type="tel"]:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  --tw-ring-color: rgb(0, 255, 13);
}
/* input[type="text"]:focus  {
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    --tw-ring-color: #85595f;
}   */
</style>
