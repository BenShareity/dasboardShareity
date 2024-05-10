<template>
  <div class="flex items-center space-x-2">
    <div
      class="w-8 h-8 rounded-full shadow-md"
      :style="{ backgroundColor: color }"
    ></div>
    <button
      class="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md px-2 py-1 text-sm"
      @click="showColorPicker = true"
    >
      Pick Color
    </button>
    <transition name="modal">
      <div
        v-if="showColorPicker"
        class="fixed inset-0 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div class="bg-white rounded-lg shadow-lg p-4">
          <vue-color-kit
            :color="color"
            @input="onColorChange"
            @confirm="onColorConfirm"
            @cancel="onColorCancel"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
import VueColorKit from "vue-color-kit";

export default {
  name: "ColorPicker",
  components: {
    VueColorKit,
  },
  props: {
    value: {
      type: String,
      default: "#000000",
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const showColorPicker = ref(false);
    const color = ref(props.value);

    const onColorChange = (newColor) => {
      color.value = newColor;
    };

    const onColorConfirm = () => {
      emit("update:value", color.value);
      showColorPicker.value = false;
    };

    const onColorCancel = () => {
      showColorPicker.value = false;
    };

    return {
      showColorPicker,
      color,
      onColorChange,
      onColorConfirm,
      onColorCancel,
    };
  },
};
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
