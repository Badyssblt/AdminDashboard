<script setup>
import { ref, onMounted } from 'vue';

// Créer une référence réactive pour stocker les boutons
const buttons = ref([]);

// Tableau pour générer dynamiquement les boutons
const buttonTypes = ['home', 'users', 'assets'];

onMounted(() => {
  localStorage.setItem('table_count', buttons.value.length);
});

const setButtonRef = (el) => {
  if (el) {
    buttons.value.push(el);
  }
};
</script>

<template>
  <aside>
    <div class="flex flex-col w-72">
      <AdminAsideButton
          v-for="(type, index) in buttonTypes"
          :key="index"
          :ref="setButtonRef"
          @click="$emit('changeType', type)"
      >
        {{ type.charAt(0).toUpperCase() + type.slice(1) }}
      </AdminAsideButton>
    </div>
  </aside>
</template>
