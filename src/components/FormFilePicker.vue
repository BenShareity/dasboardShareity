<script setup>
import { mdiUpload } from "@mdi/js";
import { computed, ref, watch, watchEffect } from "vue";
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps({
  modelValue: {
    type: [Object, File, Array],
    default: null,
  },
  mediaClass: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: mdiUpload,
  },
  accept: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: "info",
  },
  isRoundIcon: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const root = ref(null);

const file = ref(props.modelValue);

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

const showFilename = computed(() => !props.isRoundIcon && file.value);

const modelValueProp = computed(() => props.modelValue);

watch(modelValueProp, (value) => {
  file.value = value;

  if (!value) {
    root.value.input.value = null;
  }
});

const imagenRef = ref(null);
const videoRef = ref(null);

const upload = (event) => {
  console.log('props.mode :>> ', file.value);
  console.log("event.target", event.target.files);
  const value = event.target.files || event.dataTransfer.files;

  file.value = value[0];

  emit("update:modelValue", value[0]);

  const reader = new FileReader();

  if (isVideo.value) {
    reader.onload = function (e) {
      const videoSrc = e.target.result;
      const video = videoRef.value;
      video.src = videoSrc;
    };
  } else {
    reader.onload = function (e) {
      const imagen = imagenRef.value;
      imagen.src = e.target.result;
    };
  }

  reader.readAsDataURL(value[0]);
};
</script>

<template>
  <div class="flex items-stretch justify-start relative">
    <label class="inline-flex">
      <BaseButton as="a" :class="{ 'w-12 h-12': isRoundIcon, 'rounded-r-none': showFilename }"
        :icon-size="isRoundIcon ? 24 : undefined" :label="isRoundIcon ? null : label" :icon="icon" :color="color"
        :rounded-full="isRoundIcon" />
      <input ref="root" type="file"
        class="absolute top-0 left-0 w-full h-full opacity-0 outline-none cursor-pointer -z-1" :accept="accept"
        @input="upload" />
    </label>
    <div v-if="showFilename"
      class="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-r">
      <span class="text-ellipsis line-clamp-1">
        {{ file.name }}
      </span>
    </div>
  </div>
  <img v-if="!isVideo" ref="imagenRef" :src="modelValue" :class="file ? mediaClass : ''" />
  <video v-else ref="videoRef" :src="modelValue" :class="file ? mediaClass : ''" autoplay controls></video>
</template>
