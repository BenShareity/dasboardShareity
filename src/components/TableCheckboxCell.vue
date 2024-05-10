<script setup>
import { ref, watch } from "vue";

defineProps({
  type: {
    type: String,
    default: "td",
  },
  value: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["checked"]);

const checked = ref(false);

watch(checked, (newVal) => {
  emit("checked", newVal);

});

function setValue(newVal) {
  checked.value = newVal;
}
// watch(value, (newVal) => {
//   checked.value = newVal;
// });
</script>

<template>
  <component :is="type" class="lg:w-1">
    <label class="checkbox">
      <input v-model="checked" type="checkbox" />
      <span class="check" />
    </label>
  </component>
</template>
